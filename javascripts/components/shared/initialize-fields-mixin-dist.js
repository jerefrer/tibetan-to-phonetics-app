"use strict";

var initializeFieldsMixin = {
  methods: {
    initializeField: function initializeField(field, defaultValue, storageField) {
      var _this = this;

      var pushLoadedField = function pushLoadedField(field) {
        _this.loadedFields.push(field);

        if (_this.loadedFields.length >= _this.numberOfFieldsToLoad) _this.loading = false;
      };

      Storage.get(storageField || field, defaultValue, function (value) {
        _this[field] = value;
        pushLoadedField(field);
      });
    }
  }
};