// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
var containerDiv = document.getElementById("container-div");
var instanceURL = "https://anntest.my.connect.aws/ccp-v2/";
var loginWindow;

var _agent;
// initialize the streams api
function init() {
    // initialize the ccp
    connect.core.initCCP(containerDiv, {
        ccpUrl: instanceURL,            // REQUIRED
        loginPopup: false,               // optional, defaults to `true`
        region: "ap-southeast-2",         // REQUIRED for `CHAT`, optional otherwise
        softphone: {                    // optional
            allowFramedSoftphone: true,   // optional
            disableRingtone: false,       // optional
            ringtoneUrl: "./ringtone.mp3" // optional
        },
        pageOptions: { //optional
            enableAudioDeviceSettings: false, //optional, defaults to 'false'
            enablePhoneTypeSettings: true //optional, defaults to 'true'
        }
    });

    connect.core.getEventBus().subscribe(connect.EventType.ACK_TIMEOUT, function () {
        try {
            connect.getLog().warn('ACK_TIMEOUT occurred, attempting to pop the login page.');
            var width = 500;
            var height = 600;
            var left = (screen.width / 2) - (width / 2);
            var top = (screen.height / 2) - (height / 2);

            loginWindow = window.open(instanceURL, 'true', 'width=' + width + ',height=' + height +
                ',menubar=no,status=no,toolbar=no,left=' + left + ',top=' + top);
        } catch (e) {
            connect.getLog().error('ACK_TIMEOUT occurred but we are unable to open the login popup.' + e).withException(e);
        }
    });

    connect.agent(function (agent) {
        loginWindow.close();

        _agent = agent;
        _agent.onRefresh(function (a) {
            var state = a.getAgentStates()[0];
            a.setState(state, {
                success: function () { window.alert("success"); },
                failure: function () { window.alert("fail"); }
            });
        });
    });
}
// Write your Javascript code.
