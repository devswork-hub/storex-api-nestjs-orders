export class CacheUtils {
  // Gera hash para objetos complexos
  static hashObject(obj: Record<string, any>): string {
    const crypto = require('crypto');
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('md5').update(str).digest('hex').substring(0, 8);
  }

  // TTL padrões por tipo de operação
  static readonly TTL = {
    SHORT: 5 * 60, // 5 minutos
    MEDIUM: 30 * 60, // 30 minutos
    LONG: 2 * 60 * 60, // 2 horas
    VERY_LONG: 24 * 60 * 60, // 24 horas
  } as const;
}
