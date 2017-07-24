/* eslint-env node */
'use strict';

var path = require('path');

module.exports = {
    name: 'ember-cli-simplewebrtc',

    blueprintsPath: function() {
        return path.join(__dirname, 'blueprints');
    },

    included: function(app, parentAddon) {
        this._super.included(app);

        var target = (parentAddon || app);

        if (target.app) {
            target = target.app;
        }

        var bowerDir = target.bowerDirectory;
        target.import(bowerDir + '/SimpleWebRTC/out/simplewebrtc-with-adapter.bundle.js');

        target.import('vendor/simplewebrtc.js', {
            exports: {
                SimpleWebRTC: ['default']
            }
        });
    }
};
