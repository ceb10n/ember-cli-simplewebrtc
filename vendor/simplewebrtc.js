(function() {

    function generateModule(name, values) {
        define(name, [], function() {
            'use strict';

            return values;
        });
    }

    generateModule('simplewebrtc', { 'default': SimpleWebRTC });
})();
