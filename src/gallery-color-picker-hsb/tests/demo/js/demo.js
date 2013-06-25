YUI().use('node', 'gallery-color-picker-hsb', function(Y){
    console.log('Demo gallery-color-picker-hsb.');

    var placeHolder = Y.one('#colorPicker'),
        colorPicker = new Y.ColorPickerHsb();

    colorPicker.render(placeHolder);
});