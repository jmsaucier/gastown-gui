'use client';

/**
 * App State Context
 * Global state management using React Context and useReducer
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { StatusResponse, Convoy, Agent, WebSocketEvent, MailMessage } from '@/types';

export interface AppState {
  status: StatusResponse | null;
  convoys: Convoy[];
  agents: Agent[];
  events: WebSocketEvent[];
  mail: MailMessage[];
}

type Action =
  | { type: 'SET_STATUS'; payload: StatusResponse }
  | { type: 'SET_CONVOYS'; payload: Convoy[] }
  | { type: 'UPDATE_CONVOY'; payload: Convoy }
  | { type: 'SET_AGENTS'; payload: Agent[] }
  | { type: 'ADD_EVENT'; payload: WebSocketEvent }
  | { type: 'CLEAR_EVENTS' }
  | { type: 'SET_MAIL'; payload: MailMessage[] }
  | { type: 'ADD_MAIL'; payload: MailMessage };

interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

const initialState: AppState = {
  status: null,
  convoys: [],
  agents: [],
  events: [],
  mail: [],
};

const MAX_EVENTS = 500;

function appStateReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
        // Extract agents from status if present
        agents: action.payload.agents || state.agents,
      };

    case 'SET_CONVOYS':
      return {
        ...state,
        convoys: action.payload || [],
      };

    case 'UPDATE_CONVOY': {
      const convoy = action.payload;
      if (!convoy?.id) return state;

      const index = state.convoys.findIndex(c => c.id === convoy.id);
      const newConvoys = [...state.convoys];
      
      if (index >= 0) {
        newConvoys[index] = { ...newConvoys[index], ...convoy };
      } else {
        newConvoys.unshift(convoy);
      }

      return {
        ...state,
        convoys: newConvoys,
      };
    }

    case 'SET_AGENTS':
      return {
        ...state,
        agents: action.payload || [],
      };

    case 'ADD_EVENT': {
      const event = {
        ...action.payload,
        timestamp: action.payload.timestamp || new Date().toISOString(),
      };

      const newEvents = [event, ...state.events];
      
      // Trim to MAX_EVENTS
      if (newEvents.length > MAX_EVENTS) {
        newEvents.length = MAX_EVENTS;
      }

      return {
        ...state,
        events: newEvents,
      };
    }

    case 'CLEAR_EVENTS':
      return {
        ...state,
        events: [],
      };

    case 'SET_MAIL':
      return {
        ...state,
        mail: action.payload || [],
      };

    case 'ADD_MAIL': {
      const mail = action.payload;
      const newMail = [mail, ...state.mail];
      
      return {
        ...state,
        mail: newMail,
      };
    }

    default:
      return state;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
