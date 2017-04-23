
const defaultsDeep = require('lodash.defaultsdeep');

function combinedProgress(...args) {
	let name;
	let listener;

	if (args.length === 2) {
		name = args[0];
		listener = args[1];
	} else {
		listener = args[0];
	}

	let lastProgressObject = {};

	function notifyListener(progressPatch) {
		const progressObject = defaultsDeep({}, progressPatch, lastProgressObject);
		lastProgressObject = progressObject;
		listener(progressObject);
	}

	const cp = function (progressFloat) {
		notifyListener({
			name,
			progress: progressFloat
		});
	};

	cp.subtask = function (name) {
		const listener = function (progressObject) {
			notifyListener({
				subtasks: {
					[name]: progressObject
				}
			});
		};
		return combinedProgress(name, listener);
	};

	return cp;
}

module.exports = combinedProgress;
