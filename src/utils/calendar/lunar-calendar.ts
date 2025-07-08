/**
 * 农历转换工具函数
 * Lunar Calendar Conversion Utilities
 */

import { Lunar } from 'lunar-javascript';
import { Solar } from 'solarlunar';
import type { 
  LunarDate, 
  ChineseDateTime, 
  SolarTerm, 
  ShiChen,
  CalendarConversionOptions 
} from '../../types/calendar';
import type { GanZhi, TianGan, DiZhi } from '../../types/divination';
import { 
  TIAN_GAN, 
  DI_ZHI, 
  getTianGanByIndex, 
  getDiZhiByIndex,
  getGanZhi 
} from '../constants/stems-branches';

// 时辰对应表
const SHI_CHEN_MAP: Record<DiZhi, ShiChen> = {
  '子': { name: '子时', zhi: '子', startHour: 23, endHour: 1, period: '夜' },
  '丑': { name: '丑时', zhi: '丑', startHour: 1, endHour: 3, period: '夜' },
  '寅': { name: '寅时', zhi: '寅', startHour: 3, endHour: 5, period: '晨' },
  '卯': { name: '卯时', zhi: '卯', startHour: 5, endHour: 7, period: '晨' },
  '辰': { name: '辰时', zhi: '辰', startHour: 7, endHour: 9, period: '晨' },
  '巳': { name: '巳时', zhi: '巳', startHour: 9, endHour: 11, period: '午' },
  '午': { name: '午时', zhi: '午', startHour: 11, endHour: 13, period: '午' },
  '未': { name: '未时', zhi: '未', startHour: 13, endHour: 15, period: '午' },
  '申': { name: '申时', zhi: '申', startHour: 15, endHour: 17, period: '午' },
  '酉': { name: '酉时', zhi: '酉', startHour: 17, endHour: 19, period: '晚' },
  '戌': { name: '戌时', zhi: '戌', startHour: 19, endHour: 21, period: '晚' },
  '亥': { name: '亥时', zhi: '亥', startHour: 21, endHour: 23, period: '晚' }
};

// 农历月份名称
const LUNAR_MONTH_NAMES = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
];

// 农历日期名称
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 二十四节气
const SOLAR_TERMS = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
];

/**
 * 根据小时获取时辰
 */
export function getShiChenByHour(hour: number): ShiChen {
  // 处理跨日的子时
  if (hour === 23 || hour === 0) {
    return SHI_CHEN_MAP['子'];
  }
  
  for (const [zhi, shiChen] of Object.entries(SHI_CHEN_MAP)) {
    if (hour >= shiChen.startHour && hour < shiChen.endHour) {
      return shiChen;
    }
  }
  
  // 默认返回子时
  return SHI_CHEN_MAP['子'];
}

/**
 * 根据时辰获取地支
 */
export function getZhiByHour(hour: number): DiZhi {
  const shiChen = getShiChenByHour(hour);
  return shiChen.zhi;
}

/**
 * 计算时干支
 */
export function calculateHourGanZhi(dayGan: TianGan, hour: number): GanZhi {
  const hourZhi = getZhiByHour(hour);
  const dayGanIndex = TIAN_GAN.indexOf(dayGan);
  
  // 时干计算公式：日干序号 * 2 + 时支序号 - 2
  const zhiIndex = DI_ZHI.indexOf(hourZhi);
  const ganIndex = (dayGanIndex * 2 + zhiIndex) % 10;
  
  return getGanZhi(ganIndex, zhiIndex);
}

/**
 * 公历转农历
 */
export function solarToLunar(date: Date): LunarDate {
  try {
    const lunar = Lunar.fromDate(date);
    
    return {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      isLeapMonth: lunar.isLeapMonth(),
      monthName: LUNAR_MONTH_NAMES[lunar.getMonth() - 1] || '未知月',
      dayName: LUNAR_DAY_NAMES[lunar.getDay() - 1] || '未知日'
    };
  } catch (error) {
    console.error('Solar to lunar conversion error:', error);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      isLeapMonth: false,
      monthName: '未知月',
      dayName: '未知日'
    };
  }
}

/**
 * 农历转公历
 */
export function lunarToSolar(lunarDate: LunarDate): Date {
  try {
    const lunar = Lunar.fromYmd(
      lunarDate.year, 
      lunarDate.month, 
      lunarDate.day
    );
    const solar = lunar.getSolar();
    return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
  } catch (error) {
    console.error('Lunar to solar conversion error:', error);
    return new Date();
  }
}

/**
 * 获取当前节气
 */
export function getCurrentSolarTerm(date: Date): SolarTerm {
  try {
    const lunar = Lunar.fromDate(date);
    const jieQi = lunar.getJieQi();
    const jieQiName = jieQi ? jieQi.getName() : '未知';
    
    const termIndex = SOLAR_TERMS.indexOf(jieQiName);
    const season = getSeason(termIndex);
    
    return {
      name: jieQiName,
      date: jieQi ? jieQi.getSolar().toDate() : date,
      index: termIndex >= 0 ? termIndex + 1 : 1,
      season
    };
  } catch (error) {
    console.error('Get solar term error:', error);
    return {
      name: '未知',
      date,
      index: 1,
      season: '春'
    };
  }
}

/**
 * 根据节气索引获取季节
 */
function getSeason(termIndex: number): '春' | '夏' | '秋' | '冬' {
  if (termIndex >= 0 && termIndex < 6) return '春';
  if (termIndex >= 6 && termIndex < 12) return '夏';
  if (termIndex >= 12 && termIndex < 18) return '秋';
  return '冬';
}

/**
 * 计算年干支
 */
export function calculateYearGanZhi(year: number): GanZhi {
  // 以1984年甲子为基准
  const baseYear = 1984;
  const offset = (year - baseYear) % 60;
  const adjustedOffset = offset < 0 ? offset + 60 : offset;
  
  const ganIndex = adjustedOffset % 10;
  const zhiIndex = adjustedOffset % 12;
  
  return getGanZhi(ganIndex, zhiIndex);
}

/**
 * 计算月干支
 */
export function calculateMonthGanZhi(year: number, month: number): GanZhi {
  const yearGanZhi = calculateYearGanZhi(year);
  const yearGanIndex = TIAN_GAN.indexOf(yearGanZhi.gan);
  
  // 月干计算公式：(年干序号 * 2 + 月份) % 10
  const ganIndex = (yearGanIndex * 2 + month) % 10;
  const zhiIndex = (month + 1) % 12; // 寅月为正月
  
  return getGanZhi(ganIndex, zhiIndex);
}

/**
 * 计算日干支
 */
export function calculateDayGanZhi(date: Date): GanZhi {
  try {
    const lunar = Lunar.fromDate(date);
    const dayGanZhi = lunar.getDayInGanZhi();
    
    const ganIndex = TIAN_GAN.indexOf(dayGanZhi.charAt(0) as TianGan);
    const zhiIndex = DI_ZHI.indexOf(dayGanZhi.charAt(1) as DiZhi);
    
    return getGanZhi(ganIndex, zhiIndex);
  } catch (error) {
    console.error('Calculate day ganzhi error:', error);
    // 备用计算方法
    const baseDate = new Date(1900, 0, 31); // 1900年1月31日为庚辰日
    const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
    const offset = (daysDiff + 16) % 60; // 庚辰为第17个干支
    
    const ganIndex = offset % 10;
    const zhiIndex = offset % 12;
    
    return getGanZhi(ganIndex, zhiIndex);
  }
}

/**
 * 获取完整的中国传统时间信息
 */
export function getChineseDateTime(
  date: Date, 
  options?: CalendarConversionOptions
): ChineseDateTime {
  const lunar = solarToLunar(date);
  const solarTerm = getCurrentSolarTerm(date);
  const shiChen = getShiChenByHour(date.getHours());
  
  const yearGanZhi = calculateYearGanZhi(date.getFullYear());
  const monthGanZhi = calculateMonthGanZhi(date.getFullYear(), date.getMonth() + 1);
  const dayGanZhi = calculateDayGanZhi(date);
  const hourGanZhi = calculateHourGanZhi(dayGanZhi.gan, date.getHours());
  
  return {
    gregorian: date,
    lunar,
    ganZhi: {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      hour: hourGanZhi
    },
    solarTerm,
    shiChen
  };
}

/**
 * 格式化农历日期显示
 */
export function formatLunarDate(lunarDate: LunarDate): string {
  const leapPrefix = lunarDate.isLeapMonth ? '闰' : '';
  return `${lunarDate.year}年${leapPrefix}${lunarDate.monthName}${lunarDate.dayName}`;
}

/**
 * 格式化干支显示
 */
export function formatGanZhi(ganZhi: GanZhi): string {
  return `${ganZhi.gan}${ganZhi.zhi}`;
}

/**
 * 格式化完整的中国传统时间显示
 */
export function formatChineseDateTime(chineseDateTime: ChineseDateTime): string {
  const { lunar, ganZhi, solarTerm, shiChen } = chineseDateTime;
  
  const lunarStr = formatLunarDate(lunar);
  const ganZhiStr = `${formatGanZhi(ganZhi.year)}年 ${formatGanZhi(ganZhi.month)}月 ${formatGanZhi(ganZhi.day)}日 ${formatGanZhi(ganZhi.hour)}时`;
  const termStr = `节气：${solarTerm.name}`;
  const timeStr = `时辰：${shiChen.name}`;
  
  return `${lunarStr}\n${ganZhiStr}\n${termStr}\n${timeStr}`;
}

/**
 * 判断是否为白天
 */
export function isDayTime(hour: number): boolean {
  return hour >= 6 && hour < 18;
}

/**
 * 获取当前时间的中国传统时间信息
 */
export function getCurrentChineseDateTime(options?: CalendarConversionOptions): ChineseDateTime {
  return getChineseDateTime(new Date(), options);
}
