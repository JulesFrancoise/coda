/** From @most/core:
 * https://github.com/mostjs/core/blob/master/packages/core/test/
 */
/** @license MIT License (c) copyright 2010-2015 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import {
  newScheduler,
  newTimeline,
  currentTime,
  delay,
} from '@most/scheduler';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  propagateEventTask,
  propagateEndTask,
  runEffects,
  tap,
} from '@most/core';
import { disposeWith, disposeNone } from '@most/disposable';
import VirtualTimer from './VirtualTimer';
import withAttr from '../../src/lib/with_attr';

export function newEnv() {
  const timer = new VirtualTimer();
  return {
    tick: n => timer.tick(n),
    scheduler: newScheduler(timer, newTimeline()),
  };
}

export function ticks(dt) {
  const { tick, scheduler } = newEnv();
  tick(dt);
  return scheduler;
}

export function collectEvents(stream, scheduler) {
  const into = [];
  const s = tap(x => into.push({ time: currentTime(scheduler), value: x }), stream);
  return runEffects(s, scheduler).then(() => into);
}

export const collectEventsFor = (nticks, stream) => (
  collectEvents(stream, ticks(nticks))
);

const appendEvent = (sink, scheduler) => (s, event) => {
  const task = delay(event.time, propagateEventTask(event.value, sink), scheduler);
  return { tasks: s.tasks.concat(task), time: Math.max(s.time, event.time) };
};

const cancelOne = task => task.dispose();

const cancelAll = tasks => Promise.all(tasks.map(cancelOne));

const runEvents = (events, sink, scheduler) => {
  const s = events.reduce(appendEvent(sink, scheduler), { tasks: [], time: 0 });
  const end = delay(s.time, propagateEndTask(sink), scheduler);
  return disposeWith(cancelAll, s.tasks.concat(end));
};

class AtTimes {
  constructor(array) {
    this.events = array;
  }

  run(sink, scheduler) {
    return this.events.length === 0
      ? disposeNone()
      : runEvents(this.events, sink, scheduler);
  }
}

export const atTimes = array => withAttr({})(new AtTimes(array));

export const atTime = (time, value) => atTimes([{ time, value }]);

export const makeEventsFromArray = (dt, a) => (
  atTimes(a.map((value, i) => ({ time: i * dt, value })))
);

export const makeEvents = (dt, n) => (
  makeEventsFromArray(dt, Array.from(Array(n), (_, i) => i))
);

function randVect(n) {
  return Array.from(Array(n), () => Math.random());
}

export const makeRandomEvents = (n, size) => ((size > 1)
  ? makeEventsFromArray(0, Array.from(Array(n), () => randVect(size)))
  : makeEventsFromArray(0, randVect(n)));
