import { create } from "zustand";
import { ConnectionStatus } from "@triplit/client";

const STORAGE_KEY = "triplit_last_connection_time";

interface ConnectionStatusState {
  lastConnectionTime: number | null;
  connectionStatus: ConnectionStatus | null;
  setLastConnectionTime: (timestamp: number) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  loadFromStorage: () => void;
  clearTimestamp: () => void;
}

export const useConnectionStatusStore = create<ConnectionStatusState>()((set) => ({
  lastConnectionTime: null,
  connectionStatus: null,

  setLastConnectionTime: (timestamp: number) => {
    set({ lastConnectionTime: timestamp });

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, timestamp.toString());
    } catch (error) {
      console.warn("Failed to save connection timestamp to localStorage:", error);
    }
  },

  setConnectionStatus: (status: ConnectionStatus) => {
    set({ connectionStatus: status });
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        if (!isNaN(timestamp) && timestamp > 0) {
          set({ lastConnectionTime: timestamp });
        } else {
          // Invalid timestamp, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn("Failed to load connection timestamp from localStorage:", error);
    }
  },

  clearTimestamp: () => {
    set({ lastConnectionTime: null });

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear connection timestamp from localStorage:", error);
    }
  },
}));
