Y.ColorPickerHsv = Y.Base.create('colorPickerHsv', Y.Widget, [], {
    CONTENT_TEMPLATE : null,
    _selectedColor : null,
    _colorControl : null,
    _colorSelector : null,
    _hueControl : null,
    _hueSelector : null,
    _r : null,
    _g : null,
    _b : null,
    _h : null,
    _s : null,
    _v : null,
    _hex : null,

    initializer : function(config) {
        console.log('ColorPickerHsv initialized!');
    },

    renderUI : function() {
        var contentBox = this.get('contentBox'),
            color = this.get('color');

        contentBox.append(COLOR_PICKER_HSV_TEMPLATE);

        this._selectedColor = contentBox.one('.selected-color');

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

        this._hex = contentBox.one('#hex');

        if (color) {
            this._setRgb(color);
            this._updateHsvFromRgb();
            this._updateHexFromRgb();
        }
    },

    bindUI : function() {
        var contentBox = this.get('contentBox');

        this._colorControl.on('mousedown', this._colorMouseDown, this);
        this._hueControl.on('mousedown', this._hueMouseDown, this);

        contentBox.delegate('valuechange', this._rgbChanged, '.rgb input', this);
        contentBox.delegate('valuechange', this._hsvChanged, '.hsv input', this);
        contentBox.delegate('valuechange', this._hexChanged, '.hex input', this);
    },

    _colorMouseDown : function(e) {
        this._mouseMoveSub = Y.on('mousemove', this._changeColor, null, this);
        this._mouseUpSub = Y.on('mouseup', this._clearMouseSubs, null, this);
    },

    _hueMouseDown : function(e) {
        this._mouseMoveSub = Y.on('mousemove', this._changeHue, null, this);
        this._mouseUpSub = Y.on('mouseup', this._clearMouseSubs, null, this);
    },

    _clearMouseSubs : function() {
        this._mouseMoveSub.detach();
        this._mouseUpSub.detach();
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
        this._updateRgbFromHsv(false);
        this._updateHexFromRgb(false);
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
        this._updateRgbFromHsv(false);
        this._updateHexFromRgb(false);
    },

    _rgbChanged : function() {
        console.log('_rgbChanged');

        this._updateHsvFromRgb();
        this._updateHexFromRgb();
    },

    _hsvChanged : function() {
        console.log('_hsvChanged');

        this._updateRgbFromHsv();
        this._updateHexFromRgb();
    },

    _hexChanged : function() {
        console.log('_hexChanged');

        this._updateRgbFromHex();
        this._updateHsvFromRgb();
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

    _updateRgbFromHsv : function(moveColorSelector) {
        var h = this._h.get('value'),
            s = this._s.get('value'),
            v = this._v.get('value'),
            hsvStr = Y.Color.fromArray([h, s, v], Y.Color.TYPES.HSV),
            rgbArr = Y.Color._hsvToRgb(hsvStr, true);

        this._r.set('value', rgbArr[0]);
        this._g.set('value', rgbArr[1]);
        this._b.set('value', rgbArr[2]);

        if (typeof moveColorSelector == 'undefined' || moveColorSelector) {
            this._updateColorSelector();
        }
    },

    _updateRgbFromHex : function() {
        var hexStr = '#' + this._hex.get('value'),
            rgbStr = Y.Color.toRGB(hexStr),
            rgbArr = Y.Color.toArray(rgbStr);

        this._r.set('value', rgbArr[0]);
        this._g.set('value', rgbArr[1]);
        this._b.set('value', rgbArr[2]);

        this._updateHueSelector();
    },

    _updateHexFromRgb : function(moveHueSelector) {
        var r = this._r.get('value'),
            g = this._g.get('value'),
            b = this._b.get('value'),
            rgbStr = Y.Color.fromArray([r, g, b], Y.Color.TYPES.RGB),
            hexStr = Y.Color.toHex(rgbStr);

        this._hex.set('value', hexStr.substr(1));

        if (typeof moveHueSelector == 'undefined' || moveHueSelector) {
            this._updateHueSelector();
        }
    },

    _updateHsvFromRgb : function() {
        var r = this._r.get('value'),
            g = this._g.get('value'),
            b = this._b.get('value'),
            rgbStr = Y.Color.fromArray([r, g, b], Y.Color.TYPES.RGB),
            hsvArr = Y.Color._rgbToHsv(rgbStr, true);

        this._h.set('value', hsvArr[0]);
        this._s.set('value', hsvArr[1]);
        this._v.set('value', hsvArr[2]);

        this._updateColorSelector();
    },

    _updateColorSelector : function() {
        var s = this._s.get('value'),
            v = this._v.get('value');

        this._moveColorSelector({
            x: parseInt(150 * s/100, 10),
            y: parseInt(150 * (100-v)/100, 10)
        });
    },

    _updateHueSelector : function() {
        var h = this._h.get('value'),
            y = parseInt(150 - 150 * h/360, 10);

        this._moveHueSelector(y);
    },

    _moveColorSelector : function(point) {
        this._colorSelector.setStyles({
            'left' : point.x - 8,
            'top' : point.y - 8
        });

        this._updateSelectedColor();
    },

    _moveHueSelector : function(y) {
        this._hueSelector.setStyle('top', y - 8);

        this._updateSelectedColor();
        this._updateBaseColor();
    },

    _updateBaseColor : function() {
        var h = this._h.get('value'),
            hsvStr = Y.Color.fromArray([h, 100, 100], Y.Color.TYPES.HSV),
            rgbStr = Y.Color._hsvToRgb(hsvStr),
            hexStr = Y.Color.toHex(rgbStr);

        this._colorControl.setStyle('background-color', hexStr);
    },

    _updateSelectedColor : function() {
        var hex = this._hex.get('value');

        this._selectedColor.setStyle('background-color', '#' + hex);
    }
}, {
    ATTRS : {
        color : null
    }
});