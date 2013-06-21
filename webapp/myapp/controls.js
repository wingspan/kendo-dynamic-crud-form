define(['underscore', 'jquery', 'kendo'], function(_, $, kendo) {
    'use strict';

    var exports = {};

    /**
     * (private)
     * property functions (combined getter & setter).
     * the returned closures work as both getters and setters, exploiting javascript's `undefined`.
     * Kendo's `value` and jquery's `val` work the same way.
     */

    function KendoProp(kendoType, el) {
        return function(optionalNewVal) {
            var isGetter = _.isUndefined(optionalNewVal);
            return (isGetter ? $(el).data(kendoType).value()
                             : $(el).data(kendoType).value(optionalNewVal));
        };
    }

    function KendoDateProp(kendoType, el) {
        return function(optionalNewVal) {
            var isGetter = _.isUndefined(optionalNewVal);
            return (isGetter ? $(el).data(kendoType).value()
                : $(el).data(kendoType).value(new Date(optionalNewVal)));
        };
    }



    function InputProp(el) {
        return function(optionalNewVal) {
            var isGetter = _.isUndefined(optionalNewVal);
            return (isGetter ? $(el).find('input').prop('value')
                             : $(el).find('input').prop('value', optionalNewVal));
        };
    }


    /**
     * (private)
     * widget builders, for rendering dynamic bean field controls as the proper type.
     * Some controls are Kendo, others (e.g. text) are just DOM w/ CSS.
     */

    function installText(el, fieldMetadata) {
        var textInputTag = _.str.sprintf('<input type="text" class="k-textbox">', fieldMetadata.name);
        $(el).html(textInputTag);
        return InputProp(el);
    }

    function installBoolean(el, fieldMetadata) {
        $(el).html('<input>').kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [ { text: "Yes", value: "true" }, { text: "No", value: "false" } ],
            index: 0
        });
        return KendoProp('kendoDropDownList', el);
    }

    function installNumber(el, fieldMetadata) {
        $(el).kendoNumericTextBox({
            format: "n" + fieldMetadata.decimals,
            min: fieldMetadata.minValue,
            max: fieldMetadata.maxValue,
            step: fieldMetadata.stepValue
        });
        return KendoProp('kendoNumericTextBox', el);
    }

    function installDatetime(el, fieldMetadata) {
        var picker = $(el).html('<input>').kendoDateTimePicker();
        return KendoDateProp('kendoDateTimePicker', picker);
    }






    /**
     * Attaches the control to existing placeholderDom; the placeholderDom should be
     * a span or div.
     *
     * Returns a "value property" for the new control. The property is a closure over
     * the control's value. In this way we don't care that Kendo, raw dom, or whatever
     * exposes different interfaces to get at the control's contained value.
     *
     * Works with detached dom.
     */
    exports.install = function(el, fieldMetadata) {
        var dispatch = {
            text: installText,
            number: installNumber,
            datetime: installDatetime,
            boolean: installBoolean
        };
        var installFn = dispatch[fieldMetadata.dataType];
        var prop = installFn(el, fieldMetadata);
        return prop; // the property is a closure over the control's value
    };


    return exports;
});
