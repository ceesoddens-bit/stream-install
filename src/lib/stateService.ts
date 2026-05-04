import { onSnapshot, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { tenantDoc } from './firebase';

export interface TimerState {
  isRunning: boolean;
  startTime: Timestamp | null;
  baseSeconds: number;
}

const TIMER_DOC_ID = 'global_timer';

export const stateService = {
  subscribeToTimer: (callback: (state: TimerState) => void) => {
    const docRef = tenantDoc('settings', TIMER_DOC_ID);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as TimerState);
      } else {
        const initialState = { isRunning: false, startTime: null, baseSeconds: 0 };
        setDoc(docRef, initialState);
        callback(initialState);
      }
    });
  },

  updateTimer: async (newState: Partial<TimerState>) => {
    const docRef = tenantDoc('settings', TIMER_DOC_ID);
    try {
      await updateDoc(docRef, newState);
    } catch {
      await setDoc(docRef, newState, { merge: true });
    }
  },

  toggleTimer: async (currentState: TimerState, currentElapsed: number) => {
    if (currentState.isRunning) {
      await stateService.updateTimer({
        isRunning: false,
        startTime: null,
        baseSeconds: currentElapsed
      });
    } else {
      await stateService.updateTimer({
        isRunning: true,
        startTime: Timestamp.now(),
      });
    }
  },

  resetTimer: async () => {
    await stateService.updateTimer({
      isRunning: false,
      startTime: null,
      baseSeconds: 0
    });
  }
};
