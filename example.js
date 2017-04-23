/* eslint-disable unicorn/no-process-exit, no-use-extend-native/no-use-extend-native */

// Install optional dependencies if you want to run this.

const Promise = require('bluebird');
const range = require('lodash.range');
const clear = require('clear');

const stringify = require('json-stable-stringify');

const combinedProgress = require('./index');

function delay() {
	return Promise.delay(100 * Math.random());
}

function makeSleeper(steps) {
	return function (progress) {
		return Promise.mapSeries(range(steps), i => {
			progress(i / steps);
			return delay();
		});
	};
}

const recalculateSplines = makeSleeper(20);
const challengeEverything = makeSleeper(40);
const exceedCpuQuota = makeSleeper(80);

async function startup(progress) {
	await delay();
	progress(0 / 3);
	await recalculateSplines(progress.subtask('splines'));
	progress(1 / 3);
	await challengeEverything(progress.subtask('challenge'));
	progress(2 / 3);
	await exceedCpuQuota(progress.subtask('cpu'));
	progress(3 / 3);
}

startup(combinedProgress(p => {
	clear();
	console.log(stringify(p, {space: 2}));
}))
	.then(() => {
		process.exit(0);
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
