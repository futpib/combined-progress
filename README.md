# Combined Progress
Easily express progress of multiple tasks and subtasks

## Demo
![](../../Downloads/gif/gif.cropped.frameopt.gif)
```js
// Modern JavaScript
async function startup(progress) {
	progress(0/3)
	await recalculateSplines(progress.subtask('splines'))
	progress(1/3)
	await challengeEverything(progress.subtask('challenge'))
	progress(2/3)
	await exceedCpuQuota(progress.subtask('cpu'));
	progress(3/3)
}

// ES5
function startup(progress) {
	progress(0/3);
	return simulateFuture(progress.subtask('future'))
		.tap(function () {
			progress(1/3)
		})
		.then(function () {
			return shake(progress.subtask('shake')
		})
		.tap(function () {
			progress(2/3)
		})
		.then(function () {
			return bendTheSpoon(progress.subtask('spoon'))
		})
		.tap(function () {
			progress(3/3)
		});

}
```

## Install
```
$ yarn add combined-progress
```
or
```
$ npm install combined-progress
```