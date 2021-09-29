const table = document.querySelector('table');
const eventContent = document.querySelector('.content');

function displayEventContent(event) {
	const content = JsonView.createTree(event.content, event.id);
	JsonView.render(content, eventContent);
}

function createTableRow(event) {
	const row = document.createElement('tr');
	row.id = event.id;

	const rowData = document.createElement('td');
	rowData.innerHTML = event.agsmEvent;

	row.appendChild(rowData);

	return row;
}

function addEventToTable(event) {
	const row = createTableRow(event);

	table.appendChild(row);
	document.getElementById(event.id).onclick = function () {
		displayEventContent(event);
	};
}

function onMessage(event) {
	if (event.type === 'init') {
		// addEventToTable({ id: 'agsmINIT', type: 'agsmEvent', content: {}, agsmEvent: '@AGSM_INIT' });
		if (event.initParams && Object.keys(event.initParams).length > 0) {
			event.initParams.events.forEach((_e) => {
				addEventToTable(_e);
			});
		}
	} else if (event.type === 'action') {
		if (event.action === 'reload') {
			table.innerHTML = '';
			eventContent.innerHTML = '';
			addEventToTable({ id: 'agsmINIT', type: 'agsmEvent', content: {}, agsmEvent: '@AGSM_INIT' });
		}
	} else if (event.type === 'agsm_event') {
		addEventToTable(event);
	}
}

addEventToTable({ id: 'agsmINIT', type: 'agsmEvent', content: {}, agsmEvent: '@AGSM_INIT' });

setTimeout(() => sendMessage({ type: 'action', action: 'init' }), 100);

// setInterval(function () {
// 	sendMessage('keep alive');
// }, 20000);

// const data = {
// 	e: 1,
// 	test: 2,
// 	b: {
// 		h: 5,
// 		e: 1,
// 		test: 2,
// 		b: {
// 			h: 5,
// 			e: 1,
// 			test: 2,
// 			b: {
// 				h: 5,
// 				e: 1,
// 				test: 2,
// 				b: {
// 					h: 5,
// 					e: 1,
// 					test: 2,
// 					b: {
// 						e: 1,
// 						test: 2,
// 						b: {
// 							h: 5,
// 							e: 1,
// 							test: 2,
// 							b: {
// 								h: 5,
// 								e: 1,
// 								test: 2,
// 								b: { h: 5, e: 1, test: 2, b: { h: 5, e: 1, test: 2, b: { e: 1, test: 2 } } },
// 							},
// 						},
// 					},
// 				},
// 			},
// 		},
// 	},
// };

// const data = {};

// const content = JsonView.createTree(data);
// const content2 = JsonView.createTree(data, 'content2');
// const content3 = JsonView.createTree(data, 'content3');

// JsonView.render(content, document.querySelector('.content'));
// JsonView.render(content2, document.querySelector('.content'));
// JsonView.render(content3, document.querySelector('.content'));
