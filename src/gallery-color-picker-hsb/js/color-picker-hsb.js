Y.ColorPickerHsb = Y.Base.create('colorPickerHsb', Y.Widget, [], {
    CONTENT_TEMPLATE : null,

    initializer : function(config) {
        console.log('ColorPickerHsb initialized!');
    },

    renderUI : function() {
        var contentBox = this.get('contentBox');

        contentBox.append(COLOR_PICKER_HSB_TEMPLATE);
    }
});