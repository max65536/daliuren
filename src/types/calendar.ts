/**
 * 历法相关类型定义
 * Calendar Type Definitions
 */

import type { TianGan, DiZhi, GanZhi } from './divination';

// 农历日期
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean; // 是否闰月
  monthName: string;    // 月份名称 (如 "正月", "二月")
  dayName: string;      // 日期名称 (如 "初一", "十五")
}

// 节气信息
export interface SolarTerm {
  name: string;         // 节气名称
  date: Date;          // 节气日期
  index: number;       // 节气序号 (1-24)
  season: '春' | '夏' | '秋' | '冬'; // 季节
}

// 时辰信息
export interface ShiChen {
  name: string;        // 时辰名称 (如 "子时", "丑时")
  zhi: DiZhi;         // 对应地支
  startHour: number;   // 开始小时 (24小时制)
  endHour: number;     // 结束小时
  period: '夜' | '晨' | '午' | '晚'; // 时段
}

// 完整的时间信息
export interface ChineseDateTime {
  gregorian: Date;     // 公历日期
  lunar: LunarDate;    // 农历日期
  ganZhi: {
    year: GanZhi;      // 年干支
    month: GanZhi;     // 月干支
    day: GanZhi;       // 日干支
    hour: GanZhi;      // 时干支
  };
  solarTerm: SolarTerm; // 当前节气
  shiChen: ShiChen;    // 时辰信息
}

// 历法转换选项
export interface CalendarConversionOptions {
  timezone?: string;   // 时区
  location?: {         // 地理位置 (用于精确计算)
    latitude: number;
    longitude: number;
  };
}

// 节气计算结果
export interface SolarTermCalculation {
  current: SolarTerm;  // 当前节气
  next: SolarTerm;     // 下一个节气
  previous: SolarTerm; // 上一个节气
  progress: number;    // 当前节气进度 (0-1)
}

// 月相信息
export interface MoonPhase {
  name: '新月' | '峨眉月' | '上弦月' | '盈凸月' | '满月' | '亏凸月' | '下弦月' | '残月';
  illumination: number; // 月亮照明度 (0-1)
  age: number;         // 月龄 (天)
}

// 五行信息
export interface WuXing {
  element: '金' | '木' | '水' | '火' | '土';
  phase: '生' | '旺' | '死' | '囚' | '休'; // 五行状态
  strength: number; // 强度 (0-1)
}

// 纳音信息
export interface NaYin {
  name: string;        // 纳音名称 (如 "海中金", "炉中火")
  element: '金' | '木' | '水' | '火' | '土';
  description: string; // 描述
}

// 扩展的干支信息
export interface ExtendedGanZhi extends GanZhi {
  naYin: NaYin;       // 纳音
  wuXing: WuXing;     // 五行
  yinYang: '阴' | '阳'; // 阴阳
}
