chrome.devtools.panels.create('AGSM', null, '../html/agsm_panel.html', (panel) => {
	var _window;

	var events = [];
	var port = chrome.runtime.connect({ name: 'agsm-devtools' });
	port.onMessage.addListener(function (event) {
		if (_window) {
			_window.onMessage(event);
		} else {
			events.push(event);
		}
	});

	panel.onShown.addListener(function temp(panelWindow) {
		panel.onShown.removeListener(temp);
		_window = panelWindow;

		_window.sendMessage = function (event) {
			port.postMessage(event);
		};

		var event;
		while ((event = events.shift())) _window.onMessage(event);
	});
});
