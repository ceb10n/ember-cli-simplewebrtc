import Ember from 'ember';
import layout from '../templates/components/simple-webrtc';
import SimpleWebRTC from 'simplewebrtc';

export default Ember.Component.extend({
    localId: 'localVideo',

    remoteId: 'remoteVideo',

    layout,

    // the simple webrtc object
    webrtc: null,

    // show remote video element
    showRemoteVideo: true,

    // show own local video stream element
    showLocalVideo: false,

    // Ask for the camera access immediately
    autoRequestMedia: true,

    tagName: 'span',

    chatRoom: 'defaultChatRoom',

    didInsertElement() {
        const options = {
            localVideoEl: this.get('localId'),
            remoteVideoEl: this.get('remoteId'),
            autoRequestMedia: this.get('autoRequestMedia'),
            media: {
                video: true,
                audio: true
            },
            receiveMedia: {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            },
            localVideo: {
                autoplay: true,
                mirror: true,
                muted: true
            }
        };

        const webrtc = new SimpleWebRTC(options);

        webrtc.on('connectionReady', this.get('connectionReady'));
        webrtc.on('createdPeer', this.get('createdPeer'));
        webrtc.on('stunservers', this.get('stunservers'));
        webrtc.on('turnservers', this.get('turnservers'));
        webrtc.on('localScreenAdded', this.get('localScreenAdded'));
        webrtc.on('leftRoom', this.get('leftRoom'));
        webrtc.on('videoAdded', this.get('videoAdded'));
        webrtc.on('videoRemoved', this.get('videoRemoved'));

        var that = this;

        webrtc.on('readyToCall', function() {
            webrtc.joinRoom(that.get('chatRoom'));
        });

        this.set('webrtc', webrtc);
    },

    // emitted when the signaling connection emits the connect event, with
    // the unique id for the session.
    connectionReady: function(sessionId) { },

    // emitted three times:
    // when joining a room with existing peers, once for each peer
    // when a new peer joins a joined room
    // when sharing screen, once for each peer
    createdPeer: function(peer) { },

    // emitted when the signaling connection emits the same event
    stunservers: function(...args) { },

    // emitted when the signaling connection emits the same event
    turnservers: function(...args) { },

    // emitted after triggering the start of screen sharing
    localScreenAdded: function(el) { },

    // emitted after successfully leaving the current room, ending all peers,
    // and stopping the local screen stream
    leftRoom: function(roomName) { },

    // emitted when a peer stream is added
    videoAdded: function(videlEl, peer) { },

    // emitted when a peer stream is removed
    videoRemoved: function(videoEl, peer) { },
});
