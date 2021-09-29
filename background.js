var eventsPreReload = [];
var tabsCommunicating = [];
var ports = [];

function sendAgsmEvent(event) {
	ports.forEach(function (port) {
		port.postMessage(event);
	});
}

chrome.runtime.onConnect.addListener(function (port) {
	if (port.name !== 'agsm-devtools') return;
	ports.push(port);
	port.onDisconnect.addListener(function () {
		var i = ports.indexOf(port);
		if (i !== -1) ports.splice(i, 1);
	});

	port.onMessage.addListener(function (event) {
		if (event?.type === 'action') {
			switch (event.action) {
				case 'init':
					chrome.storage.local.get(['events'], function (result) {
						sendAgsmEvent({
							type: 'init',
							initParams: result,
						});
					});
					break;
				default:
					break;
			}
		}
	});
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tabsCommunicating.includes(tabId)) {
		if (changeInfo.status == 'loading') {
			eventsPreReload = [];
			chrome.storage.local.set({ events: [] });
			const newEvent = {
				type: 'action',
				action: 'reload',
			};

			sendAgsmEvent(newEvent);
		}
	}
});

chrome.runtime.onMessageExternal.addListener((event, sender, sendResponse) => {
	if (!event?.type) return;

	const agsmTabID = sender.tab?.id;
	if (agsmTabID) tabsCommunicating.push(agsmTabID);
	eventsPreReload.push(event);
	chrome.storage.local.set({ events: eventsPreReload });

	sendAgsmEvent(event);
});
