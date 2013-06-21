# dynamic CRUD form generated from a JSON schema, demonstrating MVVM pattern

![alt text](http://i.imgur.com/N0L20yk.png "screenshot")

Render dynamic form generated from an object schema and an object instance. Uses KendoUI GPL version for widget library.

example schema:

    {
      "name": "com.wingspan.tmf.v2.domain.DummyBean",
      "label": "localize:name:com.wingspan.tmf.v2.domain.DummyBean",
      "fields": {
        "id": {
           "name": "id",
           "label": "internal-id",
           "dataType": "text",
           "placeholder": "",
           "helpText": "",
           "array": false,
           "readonly": true,
           "required": true,
           "multiLine": false,
           "options": null,
           "maxLength": 36,
           "minLength": 36,
           "pattern": "",
           "maxValue": null,
           "minValue": null,
           "decimals": 0,
           "stepValue": 1.0
        },
        "isCoreForLevel": {
          "dataType": "boolean",
          ...
        },
        "modifiedDate": {
          "dataType": "datetime",
          ...
        },
        ...
      }
    }

example instance:

    "data": {
      "id": "7ADA9C9C-806C-11E2-B2F8-B4BDF046605F",
      "tmfItemId": "105.20",
      "tmfItemType": "Clinical Trial Agreement",
      "description": "To document agreement of trial requirements between sponsor or 3rd Party and site/ PI.",
      "isCoreForLevel": true,
      "modifiedDate": 1361911170254
    }

this is a self contained single page app that needs no backend. There are ajax calls that are mocked out with Mockjax (see `myapp/mocks.js`).

This form editor loosely follows the MVVM design pattern, though it does not use data binding. When you click submit, form changes will persist to a Backbone.Model. The backbone model could be wired up to sync to a RESTful backend, or the application could listen to events on the model and make an arbitrary request, or the application could add <form> html to the page that can submit the form.

From the javascript console, try these commands while watching the live DOM:

    window.crudFormView.model.get('tmfItemId')
    window.crudFormView.model.set('tmfItemId', 42)
    window.crudFormView.model.get('tmfItemId')

Code is proof of concept and does some bad things, like mutating DOM while attached.
