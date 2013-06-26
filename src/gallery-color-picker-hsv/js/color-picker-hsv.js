Y.ColorPickerHsv = Y.Base.create('colorPickerHsv', Y.Widget, [], {
    CONTENT_TEMPLATE : null,
    _colorControl: null,
    _colorSelector : null,
    _hueControl : null,
    _hueSelector : null,
    _r : null,
    _g : null,
    _b : null,
    _h : null,
    _s : null,
    _v : null,

    initializer : function(config) {
        console.log('ColorPickerHsv initialized!');
    },

    renderUI : function() {
        var contentBox = this.get('contentBox'),
            color = this.get('color');

        contentBox.append(COLOR_PICKER_HSV_TEMPLATE);

        this._colorControl = contentBox.one('.color-control');
        this._colorSelector = contentBox.one('.color-selector');

        this._hueControl = contentBox.one('.hue-control');
        this._hueSelector = contentBox.one('.hue-selector');

        this._r = contentBox.one('#r');
        this._g = contentBox.one('#g');
        this._b = contentBox.one('#b');

        this._h = contentBox.one('#h');
        this._s = contentBox.one('#s');
        this._v = contentBox.one('#v');

        if (color) {
            this._setRgb(color);
        }
    },

    bindUI : function() {
        this._colorControl.on('mousedown', this._changeColor, this);
        this._colorControl.on('mousemove', this._changeColor, this);

        this._hueControl.on('mousedown', this._changeHue, this);
        this._hueControl.on('mousemove', this._changeHue, this);
    },

    _changeColor : function(e) {
        var controlPosition, point;

        // check for left click pressed
        if (e.button !== 1)
            return;

        controlPosition = this._colorControl.getXY();
        point = {
            x: e.pageX - controlPosition[0],
            y: e.pageY - controlPosition[1]
        };

        console.log(point.x + ', ' + point.y);

        this._moveColorSelector(point);
        this._setSaturationAndValue(point);
    },

    _changeHue : function(e) {
        var controlY, y;

        // left click
        if (e.button !== 1)
            return;

        controlY = this._hueControl.getY();
        y = e.pageY - controlY;

        console.log(y);

        this._moveHueSelector(y);
        this._setHue(y);
    },

    _setRgb: function(rgbColor) {
        var rgbStr = Y.Color.toRGB(rgbColor),
            rgbArr = Y.Color.toArray(rgbStr);

        this._r.set('value', rgbArr[0]);
        this._g.set('value', rgbArr[1]);
        this._b.set('value', rgbArr[2]);
    },

    _setSaturationAndValue : function(point) {
        var s = parseInt(100*(Math.max(0,Math.min(150, point.x)))/150, 10),
            v = parseInt(100*(150 - Math.max(0,Math.min(150, point.y)))/150, 10);

        this._s.set('value', s);
        this._v.set('value', v);
    },

    _setHue : function(y) {
        var h = parseInt(360*(150 - Math.max(0,Math.min(150,(y))))/150, 10);

        this._h.set('value', h);
    },

    _moveColorSelector : function(point) {
        this._colorSelector.setStyles({
            'left' : point.x - 8,
            'top' : point.y - 8
        });
    },

    _moveHueSelector : function(y) {
        this._hueSelector.setStyle('top', y - 8);
    }
}, {
    ATTRS : {
        color : null
    }
});