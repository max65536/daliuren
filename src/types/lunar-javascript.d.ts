/**
 * Type declarations for lunar-javascript library
 */

declare module 'lunar-javascript' {
  export class Lunar {
    static fromDate(date: Date): Lunar;
    static fromYmd(year: number, month: number, day: number): Lunar;
    
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    isLeapMonth(): boolean;
    getDayInGanZhi(): string;
    getJieQi(): JieQi | null;
    getSolar(): Solar;
  }
  
  export class Solar {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    toDate(): Date;
  }
  
  export class JieQi {
    getName(): string;
    getSolar(): Solar;
  }
}
