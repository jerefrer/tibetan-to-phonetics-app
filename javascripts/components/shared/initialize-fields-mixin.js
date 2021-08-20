var initializeFieldsMixin = {
  methods: {
    initializeField(field, defaultValue, storageField) {
      var pushLoadedField = (field) => {
        this.loadedFields.push(field);
        if (this.loadedFields.length >= this.numberOfFieldsToLoad)
          this.loading = false;
      }
      Storage.get(storageField || field, defaultValue, (value) => {
        this[field] = value;
        pushLoadedField(field);
      })
    }
  }
}