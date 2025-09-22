// n8n Webhook Client
// This client handles communication with n8n webhooks instead of Supabase

const N8N_WEBHOOK_URL = import.meta.env.VITE_SUPABASE_URL;
const N8N_AUTH_TOKEN = import.meta.env.VITE_N8N_AUTH_TOKEN;

export class N8nClient {
  private baseUrl: string;
  private authToken: string | undefined;

  constructor() {
    this.baseUrl = N8N_WEBHOOK_URL;
    this.authToken = N8N_AUTH_TOKEN;

    if (!this.baseUrl) {
      throw new Error('N8N webhook URL is not configured');
    }

    console.log('N8n client initialized:', {
      url: this.baseUrl,
      hasAuth: !!this.authToken
    });
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint ? `/${endpoint}` : ''}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token is available
    if (this.authToken) {
      headers['Authorization'] = this.authToken;
    }

    console.log('Making n8n request:', {
      url,
      method: options.method || 'GET',
      hasAuth: !!headers['Authorization']
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors', // Enable CORS
      });

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
      method: 'POST',
      body: JSON.stringify({
        action: 'signin',
        email,
        password
      })
    });
  }

  async signUp(email: string, password: string) {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        action: 'signup',
        email,
        password
      })
    });
  }

  async signOut() {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        action: 'signout'
      })
    });
  }

  async getUser() {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getUser'
      })
    });
  }

  // Data methods
  async query(table: string, filters?: any) {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        action: 'query',
        table,
        filters
      })
    });
  }

  async insert(table: string, data: any) {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        action: 'insert',
        table,
        data
      })
    });
  }

  async update(table: string, id: string, data: any) {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        table,
        id,
        data
      })
    });
  }

  async delete(table: string, id: string) {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        action: 'delete',
        table,
        id
      })
    });
  }

  // Test connection
  async testConnection() {
    console.log('Testing n8n connection...');
    try {
      const response = await this.makeRequest('', {
        method: 'POST',
        body: JSON.stringify({
          action: 'test',
          timestamp: new Date().toISOString()
        })
      });
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