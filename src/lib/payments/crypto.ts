// Pure Web Crypto utility functions for Cloudflare Workers edge deployment
// Zero dependencies on Node.js 'crypto' or external npm modules.

const encoder = new TextEncoder();

/**
 * Converts a Uint8Array buffer into a hexadecimal string.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Converts a hex string back into a Uint8Array buffer.
 */
function hexToBuffer(hex: string): Uint8Array {
  const view = new Uint8Array(hex.length / 2);
  for (let i = 0; i < view.length; i++) {
    view[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return view;
}


/**
 * Simple Web Crypto JWT Signer (HS256)
 */
export async function signJwt(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  
  const secretData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    secretData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(tokenInput)
  );
  
  // Convert binary buffer to base64url string
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  return `${tokenInput}.${signatureBase64}`;
}

/**
 * Simple Web Crypto JWT Verifier (HS256)
 */
export async function verifyJwt(token: string, secret: string): Promise<any | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const [encodedHeader, encodedPayload, signature] = parts;
  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  
  try {
    const secretData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      secretData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // Convert base64url signature back to array buffer
    const sigBinary = atob(signature.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBuffer = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBuffer[i] = sigBinary.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBuffer,
      encoder.encode(tokenInput)
    );
    
    if (!isValid) return null;
    
    // Decode base64url payload
    const payloadJson = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch (e) {
    return null;
  }
}
