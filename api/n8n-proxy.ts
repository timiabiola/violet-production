const resolveEnv = (key: string): string | undefined => {
  if (key in process.env && process.env[key]) {
    return process.env[key];
  }
  const viteKey = `VITE_${key}`;
  return process.env[viteKey];
};

const TARGET_URL = resolveEnv('N8N_WEBHOOK_URL') || resolveEnv('SUPABASE_URL');
const HEADER_NAME = resolveEnv('N8N_AUTH_HEADER_NAME') || 'Authorization';
const HEADER_VALUE =
  resolveEnv('N8N_AUTH_HEADER_VALUE') ||
  resolveEnv('N8N_AUTH_TOKEN');

const ALLOWED_METHODS = ['GET', 'POST'];

export default async function handler(request: any, response: any) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.status(204).end();
    return;
  }

  if (!TARGET_URL) {
    response.status(500).json({ error: 'N8N webhook URL is not configured' });
    return;
  }

  const method = (request.method || 'GET').toUpperCase();
  if (!ALLOWED_METHODS.includes(method)) {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!HEADER_VALUE) {
    response.status(500).json({ error: 'N8N authorization value is missing' });
    return;
  }

  try {
    const url = new URL(TARGET_URL);

    Object.entries(request.query).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined) {
            url.searchParams.append(key, String(item));
          }
        });
      } else {
        url.searchParams.append(key, String(value));
      }
    });

    const headers: Record<string, string> = {
      [HEADER_NAME]: HEADER_VALUE,
    };

    let body: string | undefined;
    if (method === 'POST') {
      if (request.headers['content-type']?.includes('application/json') && typeof request.body !== 'string') {
        body = JSON.stringify(request.body);
      } else if (typeof request.body === 'string') {
        body = request.body;
      }
      headers['Content-Type'] = request.headers['content-type'] || 'application/json';
    }

    const upstreamResponse = await fetch(url.toString(), {
      method,
      headers,
      body,
    });

    const text = await upstreamResponse.text();

    response.status(upstreamResponse.status);
    response.setHeader('Access-Control-Allow-Origin', '*');

    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) {
      response.setHeader('Content-Type', contentType);
    }

    response.send(text);
  } catch (error) {
    console.error('n8n proxy error:', error);
    response.status(500).json({ error: (error as Error).message });
  }
}
