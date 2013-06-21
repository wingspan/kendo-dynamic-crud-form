define([
    "backbone", "underscore", "myapp/util", "myapp/Form"
], function(Backbone, _, util, Form) {
    "use strict";


    function entrypoint() {
        var asyncBeanTypeInfo = util.getJSON('/api/types/DummyBean');
        asyncBeanTypeInfo.fail(function() { alert('fail'); });


        var DummyBeanModel = Backbone.Model.extend({
            urlRoot: '/api/beans/DummyBean',
            parse: function(modelResponse) {
                return modelResponse.data;
            }
        });

        var dummyBeanModel = window.dummyBeanModel = new DummyBeanModel({id: '8439112E-806C-11E2-B0ED-B4BDF046605F'});
        dummyBeanModel.on('change', function(e) {
            var o = JSON.stringify(e.changedAttributes());
            console.log(o);
        });
        dummyBeanModel.fetch();

        // initialize and render the view as soon as we have the type metadata;
        // we can sync the view with the model values when the model is ready.
        $.when(asyncBeanTypeInfo).done(function(respTypeInfo) {

            var crudFormView = window.crudFormView = new Form.CrudFormView({
                typeInfo: respTypeInfo.data,
                fieldInfo: respTypeInfo.data.fields,
                model: dummyBeanModel
            });

            // now attach
            $('[data-wspt="root"]').append(crudFormView.$el);
        });
    }

    return {
        entrypoint: entrypoint
    };
});

