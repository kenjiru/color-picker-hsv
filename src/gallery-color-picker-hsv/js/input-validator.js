var InputValidator = Y.Base.create('inputValidator', Y.Base, [], {
    _node : null,
    _min : null,
    _max : null,
    _hex : false,

    initializer : function(config) {
        var node = config.node;

        if (!node)
            return;

        this._node = node;
        this._min = parseInt(node.getAttribute('min'));
        this._max = parseInt(node.getAttribute('max'));
        this._hex = parseInt(node.getAttribute('hex'));

        node.on('valuechange', this._onValueChange, this);
    },

    _onValueChange : function(e) {
        var value = e.newValue;

        console.log(e);

        if (this._min !== null && this._min > value) {

        }

        if (this._max !== null && this._max < value) {
            e.halt();
        }

        if (this._hex && this._isValidHex(value) == false) {
            e.halt();
        }
    },

    _isValidHex : function(value) {
        return true;
    }
}, {
    attachToInputs : function(node) {
        var inputs = node.all('input'),
            validators = [];

        inputs.each(function(input){
            if (input.getAttribute('min') || input.getAttribute('max') || input.getAttribute('hex')) {
                validators.push(new InputValidator({
                    node : input
                }));
            }
        });
    }
});