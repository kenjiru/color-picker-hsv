YUI().use('node', 'gallery-color-picker-hsv', function(Y){
    console.log('Demo gallery-color-picker-hsv.');

    var colorPicker = new Y.ColorPickerHsv();

    colorPicker.render();
});