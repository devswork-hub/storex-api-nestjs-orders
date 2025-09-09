import { RequestUtil } from './request.utils';

describe('RequestUtil', () => {
  // Teste para a função getIp
  it('getIp should return the request IP', () => {
    const mockRequest = { ip: '192.168.1.1' };
    expect(RequestUtil.getIp(mockRequest as any)).toBe('192.168.1.1');
  });

  // Teste para a função getUrl
  it('getUrl should return the original URL', () => {
    const mockRequest = { originalUrl: '/api/users?id=1' };
    expect(RequestUtil.getUrl(mockRequest as any)).toBe('/api/users?id=1');
  });

  // Teste para a função getPath
  it('getPath should return the URL path without query parameters', () => {
    const mockRequest = { originalUrl: '/api/users?id=1' };
    expect(RequestUtil.getPath(mockRequest as any)).toBe('/api/users');
  });

  // Teste para a função getAction
  it('getAction should return the last part of the URL path', () => {
    const mockRequest = { originalUrl: '/api/users/profile' };
    expect(RequestUtil.getAction(mockRequest as any)).toBe('profile');
  });

  // Teste para a função getMethod
  it('getMethod should return the HTTP method', () => {
    const mockRequest = { method: 'POST' };
    expect(RequestUtil.getMethod(mockRequest as any)).toBe('POST');
  });

  // Teste para a função getUserAgent
  it('getUserAgent should return the user-agent header', () => {
    const mockRequest = {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0)',
      },
    };
    expect(RequestUtil.getUserAgent(mockRequest as any)).toBe(
      'Mozilla/5.0 (Windows NT 10.0)',
    );
  });
});
