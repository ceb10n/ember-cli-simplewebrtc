/* eslint-env node */
module.exports = {
    description: 'Install SimpleWebRTC from bower',

    normalizeEntityName: function() {
    },

    afterInstall: function(options) {
        return this.addBowerPackageToProject('SimpleWebRTC');
    }
};
