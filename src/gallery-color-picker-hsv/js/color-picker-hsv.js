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
    _mouseMoveSub : null,
    _mouseUpSub : null,

    initializer : function(config) {
        this.publish('colorChanged');
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

        this._setHexColor(this.get('color') || '#000000');
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
        this._clearMouseSubs();
        this._mouseMoveSub = Y.one(document).on('mousemove', this._colorSelectorMoved, this);
        this._mouseUpSub = Y.one(document).on('mouseup', this._clearMouseSubs, this);

        this._colorSelectorMoved(e);
    },

    _hueMouseDown : function(e) {
        this._clearMouseSubs();
        this._mouseMoveSub = Y.one(document).on('mousemove', this._hueSelectorMoved, this);
        this._mouseUpSub = Y.one(document).on('mouseup', this._clearMouseSubs, this);

        this._hueSelectorMoved(e);
    },

    _colorSelectorMoved : function(e) {
        var controlPosition, x, y;

        // check for left click pressed
        if (e.button !== 1)
            return;

        controlPosition = this._colorControl.getXY();
        x = e.pageX - controlPosition[0];
        y = e.pageY - controlPosition[1];

        this._moveColorSelector(x, y);
        this._setSaturationAndValue(x, y);
        this._updateRgbFromHsv(false);
        this._updateHexFromRgb(false);

        this._updateSelectedColor();

        e.halt();
    },

    _hueSelectorMoved : function(e) {
        var controlY, y;

        // left click
        if (e.button !== 1)
            return;

        controlY = this._hueControl.getY();
        y = e.pageY - controlY;

        this._moveHueSelector(y);
        this._setHue(y);
        this._updateRgbFromHsv(false);
        this._updateHexFromRgb(false);

        this._updateBaseColor();
        this._updateSelectedColor();

        e.halt();
    },

    _clearMouseSubs : function() {
        if (this._mouseMoveSub) {
            this._mouseMoveSub.detach();
            this._mouseMoveSub = null;
        }
        if (this._mouseUpSub) {
            this._mouseUpSub.detach();
            this._mouseUpSub = null;
        }
    },

    _rgbChanged : function(e) {
        if (this._checkNumberInput(e) == false)
            return;

        this._updateHsvFromRgb();
        this._updateHexFromRgb();
    },

    _hsvChanged : function(e) {
        if (this._checkNumberInput(e) == false)
            return;

        this._updateRgbFromHsv();
        this._updateHexFromRgb();
    },

    _hexChanged : function(e) {
        if (this._checkHexInput(e) == false)
            return;

        this._updateRgbFromHex();
        this._updateHsvFromRgb();
        this._fireColorChangedEvent();
    },

    _checkNumberInput : function(e) {
        var input = e.currentTarget,
            newVal = parseInt(e.newVal, 10),
            min = input.getAttribute('min'),
            max = input.getAttribute('max');

        if (!Y.Lang.isNumber(newVal) || newVal < min || newVal > max) {
            input.addClass('invalid');

            return false;
        }
        input.removeClass('invalid');

        return true;
    },

    _checkHexInput : function(e) {
        var input = e.currentTarget;

        if (!this._isValidHexColor(e.newVal) && e.newVal[0] !== '#') {
            input.addClass('invalid');

            return false;
        }
        input.removeClass('invalid');

        return true;
    },

    _setSaturationAndValue : function(x, y) {
        var s = parseInt(100*(Math.max(0,Math.min(150, x)))/150, 10),
            v = parseInt(100*(150 - Math.max(0,Math.min(150, y)))/150, 10);

        this._s.set('value', s);
        this._v.set('value', v);
    },

    _setHue : function(y) {
        var h = parseInt(360*(150 - Math.max(0,Math.min(150,(y))))/150, 10);

        this._h.set('value', h);
    },

    _updateRgbFromHsv : function(moveHueSelector) {
        var h = this._h.get('value'),
            s = this._s.get('value'),
            v = this._v.get('value'),
            hsvStr = Y.Color.fromArray([h, s, v], Y.Color.TYPES.HSV),
            rgbArr = Y.Color._hsvToRgb(hsvStr, true);

        this._r.set('value', rgbArr[0]);
        this._g.set('value', rgbArr[1]);
        this._b.set('value', rgbArr[2]);

        if (typeof moveHueSelector == 'undefined' || moveHueSelector) {
            this._updateHueSelector();
        }
    },

    _updateRgbFromHex : function() {
        var hexStr = '#' + this._hex.get('value'),
            rgbStr = Y.Color.toRGB(hexStr),
            rgbArr = Y.Color.toArray(rgbStr);

        this._r.set('value', rgbArr[0]);
        this._g.set('value', rgbArr[1]);
        this._b.set('value', rgbArr[2]);

        this._updateColorSelector();
    },

    _updateHexFromRgb : function(moveHueSelector) {
        var r = this._r.get('value'),
            g = this._g.get('value'),
            b = this._b.get('value'),
            rgbStr = Y.Color.fromArray([r, g, b], Y.Color.TYPES.RGB),
            hexStr = Y.Color.toHex(rgbStr);

        this._hex.set('value', hexStr.substr(1));

        if (typeof moveHueSelector == 'undefined' || moveHueSelector) {
            this._updateColorSelector();
        }

        this._fireColorChangedEvent();
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

        this._updateHueSelector();
    },

    _updateColorSelector : function() {
        var s = this._s.get('value'),
            v = this._v.get('value');

        this._moveColorSelector(
            parseInt(150 * s/100, 10),
            parseInt(150 * (100-v)/100, 10)
        );
    },

    _updateHueSelector : function() {
        var h = this._h.get('value'),
            y = parseInt(150 - 150 * h/360, 10);

        this._moveHueSelector(y);
    },

    _moveColorSelector : function(x, y) {
        x = this._minMax(x, 0, 150);
        y = this._minMax(y, 0, 150);

        this._colorSelector.setStyles({
            'left' : x - 7,
            'top' : y - 7
        });

        this._updateSelectedColor();
    },

    _moveHueSelector : function(y) {
        y = this._minMax(y, 0, 150);

        this._hueSelector.setStyle('top', y - 5);

        this._updateSelectedColor();
        this._updateBaseColor();
    },

    _updateBaseColor : function() {
        var h = this._h.get('value'),
            hsvStr = Y.Color.fromArray([h, 100, 100], Y.Color.TYPES.HSV),
            rgbStr = Y.Color._hsvToRgb(hsvStr),
            hexStr = Y.Color.toHex(rgbStr);

        if (hexStr) {
            this._colorControl.setStyle('backgroundColor', hexStr);
        }
    },

    _updateSelectedColor : function() {
        var hex = this._hex.get('value');

        if (hex) {
            this._selectedColor.setStyle('backgroundColor', '#' + hex);
        }
    },

    _getHexColor : function() {
        if (this._hex && this._hex.get('value')) {
            return '#' + this._hex.get('value');
        }

        return '';
    },

    _setHexColor : function(color) {
        if (this._hex && this._isValidHexColor(color)) {
            if (color[0] == '#')
                color = color.substr(1);

            this._hex.set('value', color);
            this._updateRgbFromHex();
            this._updateHsvFromRgb();
        }
    },

    _fireColorChangedEvent : function() {
        this.fire('colorChanged', {
            color : this._getHexColor()
        });
    },

    _minMax : function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    _isValidHexColor : function(str) {
        return /(^#*[0-9A-F]{6}$)|(^#*[0-9A-F]{3}$)/i.test(str);
    }
}, {
    ATTRS : {
        color : {
            getter : function() {
                return this._getHexColor();
            },
            setter : function(value) {
                this._setHexColor(value);

                return value;
            }
        }
    }
});