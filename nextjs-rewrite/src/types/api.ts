/**
 * API Response Type Definitions
 */

import { Agent, Rig } from './agent';
import { Convoy } from './convoy';
import { WorkItem, Formula } from './work';

export interface StatusResponse {
  town_name?: string;
  gt_root: string;
  rigs: Rig[];
  agents: Agent[];
  hook?: {
    agent: string;
    work: string;
  };
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'warning' | 'error';
  checks: HealthCheck[];
  timestamp: string;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: string;
}

export interface GitHubPR {
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  created_at: string;
  updated_at: string;
  url: string;
  repo?: string;
  labels?: string[];
  draft?: boolean;
}

export interface GitHubIssue {
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: string;
  created_at: string;
  updated_at: string;
  url: string;
  repo?: string;
  labels?: string[];
}

export interface MailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  read?: boolean;
}

export interface MailSendRequest {
  to: string;
  subject: string;
  message: string;
}

export interface Crew {
  name: string;
  members: string[];
  rig?: string;
  created?: string;
}

export interface CrewCreateRequest {
  name: string;
  members: string[];
  rig?: string;
}

export interface RigCreateRequest {
  name: string;
  url: string;
  path?: string;
}

export interface RigDeleteRequest {
  name: string;
  confirm?: boolean;
}

export interface PolecatControlRequest {
  rig: string;
  name: string;
  action: 'spawn' | 'stop' | 'restart';
}

export interface AgentPeekResponse {
  agent: string;
  output: string;
  status: string;
  timestamp: string;
}

export interface AgentTranscriptResponse {
  agent: string;
  transcript: string;
  timestamp: string;
}

export interface WebSocketEvent {
  type: 'status' | 'convoy' | 'work' | 'agent' | 'mail' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'started' | 'stopped' | 'completed';
  data: any;
  timestamp: string;
  message?: string;
}

export interface APIError {
  error: string;
  errorType?: string;
  details?: string;
}

export interface APISuccessResponse {
  success: boolean;
  message?: string;
  data?: any;
}
