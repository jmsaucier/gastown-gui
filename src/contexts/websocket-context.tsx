'use client';

/**
 * WebSocket Context
 * Manages WebSocket connection and real-time events
 */

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import type { WebSocketEvent } from '@/types';
import { useAppState } from './app-state-context';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketContextType {
  status: ConnectionStatus;
  send: (event: any) => void;
  addEventListener: (callback: (event: WebSocketEvent) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { dispatch } = useAppState();
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<(event: WebSocketEvent) => void>>(new Set());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);

  const connect = () => {
    if (typeof window === 'undefined') return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data);
          
          // Dispatch to app state
          dispatch({ type: 'ADD_EVENT', payload: data });

          // Handle specific event types
          if (data.type === 'status' && data.data) {
            dispatch({ type: 'SET_STATUS', payload: data.data });
          } else if (data.type === 'convoy' && data.action === 'updated' && data.data) {
            dispatch({ type: 'UPDATE_CONVOY', payload: data.data });
          } else if (data.type === 'mail' && data.action === 'created' && data.data) {
            dispatch({ type: 'ADD_MAIL', payload: data.data });
          }

          // Notify listeners
          listenersRef.current.forEach(callback => {
            try {
              callback(data);
            } catch (err) {
              console.error('[WebSocket] Listener error:', err);
            }
          });
        } catch (err) {
          console.error('[WebSocket] Parse error:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setStatus('error');
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setStatus('disconnected');
        wsRef.current = null;

        // Attempt reconnection with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current++;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[WebSocket] Attempting reconnection...');
          setStatus('connecting');
          connect();
        }, delay);
      };
    } catch (err) {
      console.error('[WebSocket] Connection error:', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const send = (event: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    } else {
      console.warn('[WebSocket] Cannot send, connection not open');
    }
  };

  const addEventListener = (callback: (event: WebSocketEvent) => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  };

  return (
    <WebSocketContext.Provider value={{ status, send, addEventListener }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}
