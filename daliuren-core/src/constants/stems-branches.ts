/**
 * 天干地支常量定义
 * Heavenly Stems and Earthly Branches Constants
 */

import type { TianGan, DiZhi } from '../types';

// 十天干 (Ten Heavenly Stems)
export const TIAN_GAN: readonly TianGan[] = [
  '甲', '乙', '丙', '丁', '戊', 
  '己', '庚', '辛', '壬', '癸'
] as const;

// 十二地支 (Twelve Earthly Branches)
export const DI_ZHI: readonly DiZhi[] = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥'
] as const;

// 天干五行属性
export const TIAN_GAN_WU_XING: Record<TianGan, '金' | '木' | '水' | '火' | '土'> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火', 
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支五行属性
export const DI_ZHI_WU_XING: Record<DiZhi, '金' | '木' | '水' | '火' | '土'> = {
  '子': '水', '亥': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '申': '金', '酉': '金',
  '丑': '土', '辰': '土', '未': '土', '戌': '土'
};

/**
 * 获取天干索引
 */
export function getTianGanIndex(gan: TianGan): number {
  return TIAN_GAN.indexOf(gan);
}

/**
 * 获取地支索引
 */
export function getDiZhiIndex(zhi: DiZhi): number {
  return DI_ZHI.indexOf(zhi);
}

/**
 * 根据索引获取天干
 */
export function getTianGanByIndex(index: number): TianGan {
  return TIAN_GAN[index % 10];
}

/**
 * 根据索引获取地支
 */
export function getDiZhiByIndex(index: number): DiZhi {
  return DI_ZHI[index % 12];
}
