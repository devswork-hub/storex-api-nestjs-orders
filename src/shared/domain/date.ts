export class DateUtils {
  static getDate(date: string | Date) {
    return !(date instanceof Date) ? new Date(date) : date;
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static formatDateTime(date: Date): string {
    return date.toISOString();
  }

  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  static isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
  }
}
