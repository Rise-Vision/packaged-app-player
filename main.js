var debugMode = false;
var gLaunchData;
var windowOptions = {
	'frame': 'none',
	'left': 0,
	'top': 0,
	'width': 600,
	'height': 400
};
var os;

function launchApp(launchData) {

    console.log('Application started. launchData:');
    console.log(launchData);
    getCurrentOS();
}

function getCurrentOS() {
    	chrome.runtime.getPlatformInfo(function(info) {
		os = info.os;
		getDisplayProperties();
    	});
}

function getDisplayProperties() {
	chrome.system.display.getInfo(function(displays) {	
		windowOptions.width = 0;
		for (var i = 0; i < displays.length; i++) {
		        var display = displays[i];
		        if (i === 0) {
				windowOptions.height = display.bounds.height;
			}
			windowOptions.width = windowOptions.width + display.bounds.width;
		}
		if(os != "win" || displays.length === 1) {
			windowOptions.state = debugMode ? 'normal' : 'fullscreen';
		}
		startViewer();
	});
}

function startViewer() {
    console.log('debugMode = ' + debugMode + ' | screenWidth = ' + windowOptions.width + ' | screenHeight = ' + windowOptions.height + ' | state = ' + windowOptions.state + ' | os = ' + os);
    chrome.app.window.create('index.html', windowOptions,
    function (win) {
    	gLaunchData = {'debugMode': debugMode, 'windowOptions': windowOptions, 'os' : os, 'sockets': []};
        win.contentWindow.launchData = gLaunchData;
        win.onClosed.addListener(handleOnWinClosed);
    });
}

function handleOnWinClosed() {
	console.log("app is closing...");
	console.log(gLaunchData);
	//close opened sockets
	for ( var i = 0; i < gLaunchData.sockets.length; i++) {
		chrome.socket.destroy(gLaunchData.sockets[i]);
	}
	chrome.power.releaseKeepAwake();
};


chrome.runtime.onUpdateAvailable.addListener(function(details) {
	if (os == "cros") {
		console.log("updating to version " + details.version);
		chrome.runtime.reload();
	} else {
		log("[reload - not supported on "+os+", new version will be available on app restart]");
       	}	
});

chrome.power.requestKeepAwake("display");
chrome.app.runtime.onLaunched.addListener(launchApp);