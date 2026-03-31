import { doc, onSnapshot, updateDoc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface TimerState {
  isRunning: boolean;
  startTime: Timestamp | null;
  baseSeconds: number;
}

const TIMER_DOC_ID = 'global_timer';

export const stateService = {
  // Subscribe to the global timer state
  subscribeToTimer: (callback: (state: TimerState) => void) => {
    const docRef = doc(db, 'settings', TIMER_DOC_ID);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as TimerState);
      } else {
        // Initialize if not exists
        const initialState = { isRunning: false, startTime: null, baseSeconds: 0 };
        setDoc(docRef, initialState);
        callback(initialState);
      }
    });
  },

  // Update timer state
  updateTimer: async (newState: Partial<TimerState>) => {
    const docRef = doc(db, 'settings', TIMER_DOC_ID);
    try {
      await updateDoc(docRef, newState);
    } catch (e) {
      // Create if update fails (doc doesn't exist yet)
      await setDoc(docRef, newState, { merge: true });
    }
  },

  // Resume or Pause helper
  toggleTimer: async (currentState: TimerState, currentElapsed: number) => {
    if (currentState.isRunning) {
      // Pausing: save current elapsed into baseSeconds, clear startTime
      await stateService.updateTimer({
        isRunning: false,
        startTime: null,
        baseSeconds: currentElapsed
      });
    } else {
      // Resuming: set current time as startTime
      await stateService.updateTimer({
        isRunning: true,
        startTime: Timestamp.now(),
        // baseSeconds remains as it was
      });
    }
  },

  // Reset helper
  resetTimer: async () => {
    await stateService.updateTimer({
      isRunning: false,
      startTime: null,
      baseSeconds: 0
    });
  }
};
