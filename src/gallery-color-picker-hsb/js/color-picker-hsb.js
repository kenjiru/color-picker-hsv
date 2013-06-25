Y.ColorPickerHsb = Y.Base.create('colorPickerHsb', Y.Widget, [], {
    CONTENT_TEMPLATE : null,
    _colorControl: null,
    _colorSelector : null,
    _hueControl : null,
    _hueSelector : null,

    initializer : function(config) {
        console.log('ColorPickerHsb initialized!');
    },

    renderUI : function() {
        var contentBox = this.get('contentBox');

        contentBox.append(COLOR_PICKER_HSB_TEMPLATE);

        this._colorControl = contentBox.one('.color-control');
        this._colorSelector = contentBox.one('.color-selector');

        this._hueControl = contentBox.one('.hue-control');
        this._hueSelector = contentBox.one('.hue-selector');
    },

    bindUI : function() {
        this._colorControl.on('click', this.onColorClick, this);
        this._hueControl.on('click', this.onHueClick, this);
    },

    onColorClick : function(e) {
        var xy, x, y;

        // left click
        if (e.button == 1) {
            xy = this._colorControl.getXY(),
            x = e.pageX - xy[0],
            y = e.pageY - xy[1];

            console.log(x + ', ' + y);

            this._colorSelector.setStyles({
                'left' : x - 8,
                'top' : y - 8
            })
        }
    },

    onHueClick : function(e) {
        var controlY, mouseY, y;

        // left click
        if (e.button == 1) {
            controlY = this._hueControl.getY(),
            y = e.pageY - controlY,

            console.log(y);

            this._hueSelector.setStyle('top', y - 8);
        }
    }
});