import { get } from 'svelte/store';
import { timerState } from '$lib/stores';

export function startTimer(id: string) {
  const timers = get(timerState);
  timers[id] = Date.now() + 24 * 60 * 60 * 1000;
  timerState.set(timers);
}

export function resetTimer(id: string) {
  const timers = get(timerState);
  delete timers[id];
  timerState.set(timers);
}

export function resetAllTimers() {
  timerState.set({});
}

export function getTimers() {
  return get(timerState);
}
