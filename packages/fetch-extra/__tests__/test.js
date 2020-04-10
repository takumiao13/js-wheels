require('whatwg-fetch');
require('../src');

const server = require('./__server.js');
const HOST = 'http://127.0.0.1';
const PORT = 3033;
const BASE_URL = `${HOST}:${PORT}`

beforeAll(() => new Promise((resolve, reject) => {
  server.listen(PORT, resolve);
}));

describe('params', () => {
  it('should support params options', () => {
    const request = new Request('/your/path', { params: { foo: 1 }});
    expect(request.params.foo).toBe(1);
  });

  it('should serialize params and append to url', () => {
    const request = new Request('/your/path', { params: { foo: 1, bar: '2' }});
    expect(request.url).toBe('/your/path?foo=1&bar=2');
  });
});

describe('timeout', () => {
  it('should support timeout options', () => {
    const request = new Request('/your/path', { timeout: 3000 });
    expect(request.timeout).toBe(3000);
  });

  it('should reject timeout error', () => {
    // relay 3000ms
    const p$ = fetch(`${BASE_URL}/timeout`, { timeout: 1000 });
    return expect(p$).rejects.toThrowError('timeout');
  });

  it('should resolve Response Object', () => {
    const p$ = fetch(`${BASE_URL}/timeout`, { timeout: 4000 });
    return expect(p$).resolves.toBeInstanceOf(Response);
  });
});

describe('validate status', () => {
  it('should reject when status code is not in [200, 300)', async () => {
    const p1 = fetch(`${BASE_URL}/notfound`);
    await expect(p1).rejects.toThrowError('Not Found');

    const p2 = fetch(`${BASE_URL}/boom`);
    await expect(p2).rejects.toThrowError('Internal Server Error');
  });
});

describe('ignore body', () => {
  it('should ignore body when method is GET or HEAD', async () => {
    const p1 = fetch(`${BASE_URL}/request`, { body: 'foo', ignoreBody: false });
    await expect(p1).rejects.toThrowError('Body not allowed for GET or HEAD requests');

    const p2 = fetch(`${BASE_URL}/request`, { body: 'foo' });
    await expect(p2).resolves.toBeInstanceOf(Response);

    const p3 = fetch(`${BASE_URL}/request`, { method: 'get', body: 'foo' });
    await expect(p3).resolves.toBeInstanceOf(Response);

    const p4 = fetch(`${BASE_URL}/request`, { method: 'HEAD', body: 'foo' });
    await expect(p4).resolves.toBeInstanceOf(Response);
  });
});

describe('auto stringify body', () => {
  it('should JSON stringify body', () => {
    const request = new Request('/your/path', { 
      method: 'post',
      body: { foo: 1, bar: 2}
    });
    expect(request._bodyInit).toBe('{"foo":1,"bar":2}');
    expect(request.headers.get('Content-Type')).toBe('application/json;charset=utf-8');
  });

  it('should not set content-type if exists', () => {
    const request = new Request('/your/path', { 
      method: 'post',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: { foo: 1, bar: 2}
    });
    expect(request._bodyInit).toBe('{"foo":1,"bar":2}');
    expect(request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
  })
})

describe('default optioins', () => {
  it('should set defaults options', () => {
    fetch.defaults.mode = 'cors'
    fetch.defaults.timeout = 5000;
    const request = new Request('/your/path');
    expect(request.mode).toBe('cors');
    expect(request.timeout).toBe(5000);
  });
});

afterAll(() => server.close());