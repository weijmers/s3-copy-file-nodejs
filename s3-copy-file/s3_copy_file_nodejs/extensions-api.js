import { basename } from "path";
import * as url from 'url';

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function register() {
  const res = await fetch(`${baseUrl}/register`, {
    method: 'post',
    body: JSON.stringify({
      'events': [
        'INVOKE',
        'SHUTDOWN'
      ],
    }),
    headers: {
      'Content-Type': 'application/json',
      'Lambda-Extension-Name': basename(__dirname),
    }
  });

  if (!res.ok) {
    console.error('register failed', await res.text());
  }

  return res.headers.get('lambda-extension-identifier');
}

export async function next(extensionId) {
  const res = await fetch(`${baseUrl}/event/next`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Lambda-Extension-Identifier': extensionId,
    }
  });

  if (!res.ok) {
    console.error('next failed', await res.text());
    return null;
  }

  return await res.json();
}
