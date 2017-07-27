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

    isFullScreen: false,

    isVideoMuted: false,

    isAudioMuted: false,

    didInsertElement() {
        const options = {
            localVideoEl: this.get('localId'),
            // remoteVideoEl: this.get('remoteId'),
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
                mirror: false,
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

        webrtc.on('videoAdded', function (video, peer) {
            console.log('video added', video);
            var remotes = document.getElementById('videos');

            if (remotes) {
                that.$("#localVideo").attr('class', 'mini-video');
                var container = document.createElement('div');
                that.$(video).attr('class', 'fullscreen-video inverted');
                // container.className = 'fullscreen-video';
                // container.id = 'container_' + webrtc.getDomId(peer);
                container.appendChild(video);

                video.oncontextmenu = function () { return false; };

                remotes.appendChild(container);


            }
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

    actions: {
        muteAudio: function() {
            const isAudioMuted = this.get('isAudioMuted');

            if (isAudioMuted) {
                this.get('webrtc').unmute();
            } else {
                this.get('webrtc').mute();
            }

            this.set('isAudioMuted', !isAudioMuted);
        },

        muteVideo: function() {
            const isVideoMuted = this.get('isVideoMuted');

            if (isVideoMuted) {
                this.get('webrtc').resumeVideo();
            } else {
                this.get('webrtc').pauseVideo();
            }

            this.set('isVideoMuted', !isVideoMuted);
        },

        setFullscreen: function() {
            const isFullScreen = this.get('isFullScreen');
            const docElement = document.documentElement;

            if (isFullScreen) {
                this.$("#fullscreen").attr('title', 'Enter fullscreen');

                if (document.cancelFullscreen) {
                    document.cancelFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                else if (document.msCancelFullscreen) {
                    document.msCancelFullscreen();
                } else {
                    console.log('shit');
                }
            } else {
                this.$("#fullscreen").attr('title', 'Exit fullscreen');

                if (docElement.requestFullscreen) {
                    docElement.requestFullscreen();
                }
                else if (docElement.mozRequestFullScreen) {
                    docElement.mozRequestFullScreen();
                }
                else if (docElement.webkitRequestFullscreen) {
                    docElement.webkitRequestFullscreen();
                }
                else if (docElement.msRequestFullscreen) {
                    docElement.msRequestFullscreen();
                }
            }

            this.set('isFullScreen', !isFullScreen);
        }
    }
});
