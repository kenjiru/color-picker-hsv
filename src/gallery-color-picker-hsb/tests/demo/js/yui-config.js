/**
 * This configuration is meant to be used from inside a web server.
 * It won't work if run from the local file system.
 */
YUI_config = {
    filter: "raw",
    debug: true,
    combine: false,
    base: 'http://yui.yahooapis.com/3.10.1/build/',

    modules: {
        'gallery-color-picker-hsb' : {
            base : '/build/'
        }
    }
};