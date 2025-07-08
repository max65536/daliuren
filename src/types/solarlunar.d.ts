/**
 * Type declarations for solarlunar library
 */

declare module 'solarlunar' {
  export class Solar {
    constructor(year: number, month: number, day: number);
    
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    toLunar(): Lunar;
  }
  
  export class Lunar {
    constructor(year: number, month: number, day: number, isLeapMonth?: boolean);
    
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    isLeapMonth(): boolean;
    toSolar(): Solar;
  }
  
  export function solar2lunar(year: number, month: number, day: number): any;
  export function lunar2solar(year: number, month: number, day: number, isLeapMonth?: boolean): any;
}
