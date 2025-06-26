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

export class DateUtil {
  /**
   *
   * @param dateA Date
   * @param dateB Date
   * @example
   * isSameDate(new Date('2020-10-20'), new Date('2020-10-20')); // true
   */
  static isSameDate(dateA: Date, dateB: Date): boolean {
    return dateA.toISOString() === dateB.toISOString();
  }

  /**
   * @example
   * isBeforeDate(new Date('2020-10-20'), new Date('2020-10-21')); // true
   */
  static isBeforeDate(dateA: Date, dateB: Date): boolean {
    return dateA < dateB;
  }

  /**
   * @example
   * isAfterDate(new Date('2020-10-21'), new Date('2020-10-20')); // true
   */
  static isAfterDate(dateA: Date, dateB: Date): boolean {
    return dateA > dateB;
  }

  /**
   * @example
   * isBetweenDates(
  new Date('2020-10-20'),
  new Date('2020-10-30'),
  new Date('2020-10-19')
); // false
isBetweenDates(
  new Date('2020-10-20'),
  new Date('2020-10-30'),
  new Date('2020-10-25')
); // true
   */
  static isBetweenDates(dateStart: Date, dateEnd: Date, date: Date): boolean {
    return date > dateStart && date < dateEnd;
  }
}
