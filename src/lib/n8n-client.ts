// n8n Webhook Client
// This client handles communication with n8n webhooks instead of Supabase

const N8N_PROXY_URL = import.meta.env.VITE_N8N_PROXY_URL;
const N8N_WEBHOOK_URL = N8N_PROXY_URL || import.meta.env.VITE_SUPABASE_URL || 'https://n8n.enlightenedmediacollective.com/webhook/8e680e60-73fa-4761-920e-ad07b213ab31';
const N8N_AUTH_HEADER_NAME = import.meta.env.VITE_N8N_AUTH_HEADER_NAME || 'Authorization';
const N8N_AUTH_HEADER_VALUE =
  import.meta.env.VITE_N8N_AUTH_HEADER_VALUE ?? import.meta.env.VITE_N8N_AUTH_TOKEN;

export class N8nClient {
  private baseUrl: string;
  private authHeaderName: string;
  private authHeaderValue: string | undefined;

  constructor() {
    this.baseUrl = N8N_WEBHOOK_URL;
    this.authHeaderName = N8N_AUTH_HEADER_NAME;
    this.authHeaderValue = N8N_AUTH_HEADER_VALUE || undefined;

    if (!this.baseUrl) {
      throw new Error('N8N webhook URL is not configured');
    }

    console.log('N8n client initialized:', {
      url: this.baseUrl,
      usingProxy: !!N8N_PROXY_URL,
      authHeaderName: this.authHeaderValue ? this.authHeaderName : 'NOT SET',
      hasAuth: !N8N_PROXY_URL && !!this.authHeaderValue
    });
  }

  private async makeRequest(endpoint: string, data: any = {}, method: string = 'GET') {
    // For GET requests, convert data to query parameters
    let url = `${this.baseUrl}${endpoint ? `/${endpoint}` : ''}`;

    if (method === 'GET' && data && Object.keys(data).length > 0) {
      const params = new URLSearchParams();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          params.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
        }
      });
      url += `?${params.toString()}`;
    }

    const headers: Record<string, string> = {};

    // Add authorization header if configured and we're not proxying
    if (!N8N_PROXY_URL && this.authHeaderValue) {
      headers[this.authHeaderName] = this.authHeaderValue;
    }

    // Only add Content-Type for POST requests
    if (method === 'POST') {
      headers['Content-Type'] = 'application/json';
    }

    console.log('Making n8n request:', {
      url,
      method,
      hasAuth: !N8N_PROXY_URL && !!this.authHeaderValue,
      authHeaderName: this.authHeaderValue ? this.authHeaderName : 'NOT SET',
      data: method === 'GET' ? 'in URL params' : data
    });

    try {
      const fetchOptions: RequestInit = {
        method,
        headers,
        mode: 'cors', // Enable CORS
      };

      // Only add body for POST requests
      if (method === 'POST' && data) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);

      console.log('n8n response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('n8n request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`n8n request failed: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('n8n request error:', error);
      throw error;
    }
  }

  // Auth methods (adapting to n8n webhook)
  async signIn(email: string, password: string) {
    return this.makeRequest('', {
      action: 'signin',
      email,
      password
    }, 'GET');
  }

  async signUp(email: string, password: string) {
    return this.makeRequest('', {
      action: 'signup',
      email,
      password
    }, 'GET');
  }

  async signOut() {
    return this.makeRequest('', {
      action: 'signout'
    }, 'GET');
  }

  async getUser() {
    return this.makeRequest('', {
      action: 'getUser'
    }, 'GET');
  }

  // Data methods
  async query(table: string, filters?: any) {
    return this.makeRequest('', {
      action: 'query',
      table,
      filters: filters ? JSON.stringify(filters) : undefined
    }, 'GET');
  }

  async insert(table: string, data: any) {
    return this.makeRequest('', {
      action: 'insert',
      table,
      data: JSON.stringify(data)
    }, 'GET');
  }

  async update(table: string, id: string, data: any) {
    return this.makeRequest('', {
      action: 'update',
      table,
      id,
      data: JSON.stringify(data)
    }, 'GET');
  }

  async delete(table: string, id: string) {
    return this.makeRequest('', {
      action: 'delete',
      table,
      id
    }, 'GET');
  }

  // Test connection
  async testConnection() {
    console.log('Testing n8n connection...');
    try {
      const response = await this.makeRequest('', {
        action: 'test',
        timestamp: new Date().toISOString()
      }, 'GET');
      console.log('n8n connection test successful:', response);
      return response;
    } catch (error) {
      console.error('n8n connection test failed:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const n8nClient = new N8nClient();