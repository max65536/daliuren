export type TianGan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type DiZhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
export type ShenJiang = "贵人" | "腾蛇" | "朱雀" | "六合" | "勾陈" | "青龙" | "天空" | "白虎" | "太常" | "玄武" | "太阴" | "天后";

export interface GanZhi {
  gan: TianGan;
  zhi: DiZhi;
  index: number;
}

export interface KeInfo {
  gan: TianGan;
  zhi: DiZhi;
  shen: ShenJiang;
  position: number;
}

export interface SiKe {
  first: KeInfo;
  second: KeInfo;
  third: KeInfo;
  fourth: KeInfo;
}

export interface ChuanInfo {
  zhi: DiZhi;
  shen: ShenJiang;
  meaning: string;
}

export interface SanChuan {
  chu: ChuanInfo;
  zhong: ChuanInfo;
  mo: ChuanInfo;
}

export interface DivinationInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  isLunar?: boolean;
}

export interface ShenJiangInfo {
  name: ShenJiang;
  position: DiZhi;
  attributes: {
    element: "金" | "木" | "水" | "火" | "土";
    nature: "吉" | "凶" | "中";
    direction: "东" | "南" | "西" | "北" | "中";
  };
}

export class DivinationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "DivinationError";
  }
}
