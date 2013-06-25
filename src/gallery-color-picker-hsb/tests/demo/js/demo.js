YUI().use('node', 'gallery-color-picker-hsb', function(Y){
    console.log('Demo gallery-color-picker-hsb.');

    var colorPicker = new Y.ColorPickerHsb();

    colorPicker.render();
});