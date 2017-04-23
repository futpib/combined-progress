
import test from 'ava';
import {spy} from 'sinon';

import combinedProgress from './index';

test.beforeEach(t => {
	t.context.listener = spy();
	t.context.progress = combinedProgress(t.context.listener);
});

test('passes calls to listener', t => {
	const {progress, listener} = t.context;

	progress(0.5);

	t.true(listener.calledOnce);
	t.deepEqual(listener.lastCall.args, [{
		progress: 0.5
	}]);
});

test('named root task', t => {
	t.context.progress = combinedProgress('root', t.context.listener);
	const {progress, listener} = t.context;

	progress(0.5);

	t.true(listener.calledOnce);
	t.deepEqual(listener.lastCall.args, [{
		name: 'root',
		progress: 0.5
	}]);
});

test('subtask thing', async t => {
	const {progress, listener} = t.context;

	async function task(progress) {
		progress(0 / 3);
		await subtask1(progress.subtask('subtask1'));
		progress(1 / 3);
		await subtask2(progress.subtask('subtask2'));
		progress(2 / 3);
		await subtask3(progress.subtask('subtask3'));
		progress(3 / 3);
	}

	async function subtask1(progress) {
		progress(0);
		await subtask1subtask1(progress.subtask('subtask1subtask1'));
		progress(1);
	}

	function subtask1subtask1(progress) {
		progress(1);
	}

	function subtask2(progress) {
		progress(1);
	}

	function subtask3() {
		// No-op
	}

	await task(progress);

	t.is(listener.callCount, 8);

	t.deepEqual(listener.getCalls().map(c => c.args[0]), [
		{
			progress: 0
		},

		{
			progress: 0,
			subtasks: {
				subtask1: {
					name: 'subtask1',
					progress: 0
				}
			}
		},

		{
			progress: 0,
			subtasks: {
				subtask1: {
					name: 'subtask1',
					progress: 0,
					subtasks: {
						subtask1subtask1: {
							name: 'subtask1subtask1',
							progress: 1
						}
					}
				}
			}
		},

		{
			progress: 0,
			subtasks: {
				subtask1: {
					name: 'subtask1',
					progress: 1,
					subtasks: {
						subtask1subtask1: {
							name: 'subtask1subtask1',
							progress: 1
						}
					}
				}
			}
		},

		{
			progress: 0.3333333333333333,
			subtasks: {
				subtask1: {
					name: 'subtask1',
					progress: 1,
					subtasks: {
						subtask1subtask1: {
							name: 'subtask1subtask1',
							progress: 1
						}
					}
				}
			}
		},

		{
			progress: 0.3333333333333333,
			subtasks: {
				subtask1: {
					name: 'subtask1',
					progress: 1,
					subtasks: {
						subtask1subtask1: {
							name: 'subtask1subtask1',
							progress: 1
						}
					}
				},
				subtask2: {
					name: 'subtask2',
					progress: 1
				}
			}
		},

		{
			progress: 0.6666666666666666,
			subtasks: {
				subtask1: {
					name: 'subtask1',
					progress: 1,
					subtasks: {
						subtask1subtask1: {
							name: 'subtask1subtask1',
							progress: 1
						}
					}
				},
				subtask2: {
					name: 'subtask2',
					progress: 1
				}
			}
		},

		{
			progress: 1,
			subtasks: {
				subtask1: {
					name: 'subtask1',
					progress: 1,
					subtasks: {
						subtask1subtask1: {
							name: 'subtask1subtask1',
							progress: 1
						}
					}
				},
				subtask2: {
					name: 'subtask2',
					progress: 1
				}
			}
		}
	]);
});
