define([
    'backbone', 'underscore',
    "myapp/util",
    "myapp/controls",
    "text!myapp/CrudPage.html",
    "text!myapp/formitem.html"
], function(Backbone, _, util, controls, pageTemplate, formItemTemplate) {
    "use strict";

    var exports = {};


    exports.CrudFormView = Backbone.View.extend({

        events: {
            'click [data-wspt="beansave"]': 'submit'
        }

        ,initialize: function(options) {
            var self = this;

            // type and field info are configuration params (not the model).
            _.defaults(self, _.pick(options, 'typeInfo', 'fieldInfo'));

            // render the form controls immediately
            self.render();

            // render the form values whenever the model is ready
            self.model.on('change', self.syncFormValuesWithModel, self);
            //self.model.on('invalid', self.render, self); -- render invalid hints
        }

        ,syncFormValuesWithModel: function() {
            var self = this;
            _.each(self.formProps, function(prop, fieldName) {
                prop(self.model.get(fieldName));
            });
        }

        ,render: function() {
            var self = this;
            console.assert(self.formProps === undefined, "only call render once");

            self.$el.html(pageTemplate);
            var beanEls = self.$el.find('li[data-beanfield]');
            var beanFields = _.map(beanEls, function(beanEl) { return $(beanEl).data()['beanfield']; });
            var beanElsByName = _.object(beanFields, beanEls);

            self.formProps = util.mapo(beanElsByName, function(el, fieldName) {
                var prop = self._renderControl(el, self.fieldInfo[fieldName]);
                var initialVal = self.model.get(fieldName);
                prop(initialVal);
                return [fieldName, prop];
            });

            return this;
        }

        /**
         * (private)
         * Side-effecty, will mutate DOM to render the control.
         * Returns a "property" fn for the control's value.
         */
        ,_renderControl: function(beanEl, meta) {
            // the template lays out a row in the form (label and such), as well
            // as a placeholder for the actual control (textbox, datepicker...).

            // render the form item template, which contains a placeholder
            // for the javascript control.
            $(beanEl).html(_.template(formItemTemplate, meta));

            // install the control
            var controlPlaceholder = $(beanEl).find('[data-wspt-control]');
            var prop = controls.install(controlPlaceholder, meta);
            return prop;
        }

        /**
         * could self.formProps be considered a ViewModel?
         */
        ,getValues: function() {
            var self = this;
            // resolve the form's current state
            return util.mapo(self.formProps, function(prop, key){
                return [key, prop()];
            });
        }

        ,submit: function(e) {
            var self = this;
            self.model.set(self.getValues());
            self.model.save();
        }

    });


    return exports;
});
