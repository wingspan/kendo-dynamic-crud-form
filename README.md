
Render dynamic form generated from an object schema and an object instance. Uses KendoUI GPL version for widget library.

this is a self contained single page app that needs no backend. There are ajax calls that are mocked out with Mockjax (see `myapp/mocks.js`).

This form editor loosely follows the MVVM design pattern, though it does not use data binding. When you click submit, form changes will persist to a Backbone.Model. The backbone model could be wired up to sync to a RESTful backend, or the application could listen to events on the model and make an arbitrary request, or the application could add <form> html to the page that can submit the form.

From the javascript console, try these commands while watching the live DOM:

    window.crudFormView.model.get('tmfItemId')
    window.crudFormView.model.set('tmfItemId', 42)
    window.crudFormView.model.get('tmfItemId')