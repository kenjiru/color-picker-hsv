YUI().use('node', 'gallery-color-picker-hsv', function(Y){
    console.log('Demo gallery-color-picker-hsv.');

    var colorPicker = new Y.ColorPickerHsv({
            color : 'f00'
        }),
        colorInput = Y.one('#colorInput');

    colorPicker.render();
    colorPicker.on('colorPickerHsv:colorChanged', function(ev) {
        colorInput.set('value', ev.color);
    });
});