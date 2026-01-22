/**
 * API Client Library
 * Frontend API client for communicating with Next.js API routes
 */

import type {
  StatusResponse,
  HealthCheckResponse,
  Convoy,
  WorkItem,
  BeadCreateRequest,
  SlingRequest,
  Rig,
  RigCreateRequest,
  RigDeleteRequest,
  PolecatControlRequest,
  AgentPeekResponse,
  AgentTranscriptResponse,
  GitHubPR,
  GitHubIssue,
  MailMessage,
  MailSendRequest,
  Crew,
  CrewCreateRequest,
  Formula,
  FormulaCreateRequest,
  FormulaUseRequest,
  APIError,
  APISuccessResponse,
} from '@/types';

const API_BASE = typeof window !== 'undefined' ? window.location.origin : '';

class APIClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData: APIError = await response.json().catch(() => ({ 
        error: response.statusText 
      }));
      const error = new Error(errorData.error || 'Request failed');
      Object.assign(error, { errorType: errorData.errorType, errorData });
      throw error;
    }

    return response.json();
  }

  private get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  private post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  private delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // === Status & Health ===
  
  async getStatus(): Promise<StatusResponse> {
    return this.get<StatusResponse>('/api/status');
  }

  async getHealth(): Promise<HealthCheckResponse> {
    return this.get<HealthCheckResponse>('/api/health');
  }

  async runDoctor(): Promise<HealthCheckResponse> {
    return this.get<HealthCheckResponse>('/api/doctor');
  }

  // === Convoys ===
  
  async getConvoys(params?: { status?: string }): Promise<Convoy[]> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    return this.get<Convoy[]>(`/api/convoys${query}`);
  }

  async getConvoy(id: string): Promise<Convoy> {
    return this.get<Convoy>(`/api/convoy/${encodeURIComponent(id)}`);
  }

  async createConvoy(name: string, issues: string[] = [], notify?: string): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/convoys', { name, issues, notify });
  }

  async addIssuesToConvoy(convoyId: string, issues: string[]): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>(`/api/convoys/${encodeURIComponent(convoyId)}/add`, { issues });
  }

  // === Work/Beads ===
  
  async getWork(params?: { status?: string; rig?: string }): Promise<WorkItem[]> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    return this.get<WorkItem[]>(`/api/work${query}`);
  }

  async createBead(bead: BeadCreateRequest): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/work', bead);
  }

  async sling(request: SlingRequest): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/sling', request);
  }

  // === Rigs ===
  
  async getRigs(): Promise<Rig[]> {
    return this.get<Rig[]>('/api/rigs');
  }

  async createRig(rig: RigCreateRequest): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/rigs', rig);
  }

  async deleteRig(name: string): Promise<APISuccessResponse> {
    return this.delete<APISuccessResponse>(`/api/rig/${encodeURIComponent(name)}`);
  }

  // === Polecat Control ===
  
  async polecatSpawn(rig: string, name: string): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>(`/api/polecat/${encodeURIComponent(rig)}/${encodeURIComponent(name)}/spawn`);
  }

  async polecatStop(rig: string, name: string): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>(`/api/polecat/${encodeURIComponent(rig)}/${encodeURIComponent(name)}/stop`);
  }

  async polecatRestart(rig: string, name: string): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>(`/api/polecat/${encodeURIComponent(rig)}/${encodeURIComponent(name)}/restart`);
  }

  async polecatPeek(rig: string, name: string): Promise<AgentPeekResponse> {
    return this.get<AgentPeekResponse>(`/api/polecat/${encodeURIComponent(rig)}/${encodeURIComponent(name)}/peek`);
  }

  async polecatTranscript(rig: string, name: string): Promise<AgentTranscriptResponse> {
    return this.get<AgentTranscriptResponse>(`/api/polecat/${encodeURIComponent(rig)}/${encodeURIComponent(name)}/transcript`);
  }

  // === Crews ===
  
  async getCrews(): Promise<Crew[]> {
    return this.get<Crew[]>('/api/crews');
  }

  async createCrew(crew: CrewCreateRequest): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/crews', crew);
  }

  // === Formulas ===
  
  async getFormulas(): Promise<Formula[]> {
    return this.get<Formula[]>('/api/formulas');
  }

  async createFormula(formula: FormulaCreateRequest): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/formulas', formula);
  }

  async useFormula(request: FormulaUseRequest): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/formulas/use', request);
  }

  // === GitHub Integration ===
  
  async getGitHubPRs(params?: { state?: string; repo?: string }): Promise<GitHubPR[]> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    return this.get<GitHubPR[]>(`/api/github/prs${query}`);
  }

  async getGitHubIssues(params?: { state?: string; repo?: string }): Promise<GitHubIssue[]> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    return this.get<GitHubIssue[]>(`/api/github/issues${query}`);
  }

  async getGitHubRepos(): Promise<any[]> {
    return this.get<any[]>('/api/github/repos');
  }

  // === Mail ===
  
  async getMail(params?: { filter?: string }): Promise<MailMessage[]> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    return this.get<MailMessage[]>(`/api/mail${query}`);
  }

  async sendMail(mail: MailSendRequest): Promise<APISuccessResponse> {
    return this.post<APISuccessResponse>('/api/mail/send', mail);
  }

  async getMailFeed(): Promise<any[]> {
    return this.get<any[]>('/api/mail/feed');
  }
}

export const api = new APIClient();
