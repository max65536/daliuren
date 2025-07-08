/**
 * 天干地支常量定义
 * Heavenly Stems and Earthly Branches Constants
 */

import type { TianGan, DiZhi, GanZhi } from '../../types/divination';

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

// 天干属性
export const TIAN_GAN_ATTRIBUTES = {
  '甲': { element: '木', yinYang: '阳', number: 1 },
  '乙': { element: '木', yinYang: '阴', number: 2 },
  '丙': { element: '火', yinYang: '阳', number: 3 },
  '丁': { element: '火', yinYang: '阴', number: 4 },
  '戊': { element: '土', yinYang: '阳', number: 5 },
  '己': { element: '土', yinYang: '阴', number: 6 },
  '庚': { element: '金', yinYang: '阳', number: 7 },
  '辛': { element: '金', yinYang: '阴', number: 8 },
  '壬': { element: '水', yinYang: '阳', number: 9 },
  '癸': { element: '水', yinYang: '阴', number: 10 }
} as const;

// 地支属性
export const DI_ZHI_ATTRIBUTES = {
  '子': { element: '水', yinYang: '阳', number: 1, time: '23-01', season: '冬', direction: '北' },
  '丑': { element: '土', yinYang: '阴', number: 2, time: '01-03', season: '冬', direction: '北' },
  '寅': { element: '木', yinYang: '阳', number: 3, time: '03-05', season: '春', direction: '东' },
  '卯': { element: '木', yinYang: '阴', number: 4, time: '05-07', season: '春', direction: '东' },
  '辰': { element: '土', yinYang: '阳', number: 5, time: '07-09', season: '春', direction: '东' },
  '巳': { element: '火', yinYang: '阴', number: 6, time: '09-11', season: '夏', direction: '南' },
  '午': { element: '火', yinYang: '阳', number: 7, time: '11-13', season: '夏', direction: '南' },
  '未': { element: '土', yinYang: '阴', number: 8, time: '13-15', season: '夏', direction: '南' },
  '申': { element: '金', yinYang: '阳', number: 9, time: '15-17', season: '秋', direction: '西' },
  '酉': { element: '金', yinYang: '阴', number: 10, time: '17-19', season: '秋', direction: '西' },
  '戌': { element: '土', yinYang: '阳', number: 11, time: '19-21', season: '秋', direction: '西' },
  '亥': { element: '水', yinYang: '阴', number: 12, time: '21-23', season: '冬', direction: '北' }
} as const;

// 六十甲子 (Sixty Jiazi Cycle)
export const LIU_SHI_JIA_ZI: readonly GanZhi[] = (() => {
  const result: GanZhi[] = [];
  for (let i = 0; i < 60; i++) {
    const gan = TIAN_GAN[i % 10];
    const zhi = DI_ZHI[i % 12];
    result.push({
      gan,
      zhi,
      index: i + 1
    });
  }
  return result;
})();

// 纳音表 (Nayin Table)
export const NA_YIN_TABLE = {
  '甲子': { name: '海中金', element: '金' },
  '乙丑': { name: '海中金', element: '金' },
  '丙寅': { name: '炉中火', element: '火' },
  '丁卯': { name: '炉中火', element: '火' },
  '戊辰': { name: '大林木', element: '木' },
  '己巳': { name: '大林木', element: '木' },
  '庚午': { name: '路旁土', element: '土' },
  '辛未': { name: '路旁土', element: '土' },
  '壬申': { name: '剑锋金', element: '金' },
  '癸酉': { name: '剑锋金', element: '金' },
  '甲戌': { name: '山头火', element: '火' },
  '乙亥': { name: '山头火', element: '火' },
  '丙子': { name: '涧下水', element: '水' },
  '丁丑': { name: '涧下水', element: '水' },
  '戊寅': { name: '城头土', element: '土' },
  '己卯': { name: '城头土', element: '土' },
  '庚辰': { name: '白蜡金', element: '金' },
  '辛巳': { name: '白蜡金', element: '金' },
  '壬午': { name: '杨柳木', element: '木' },
  '癸未': { name: '杨柳木', element: '木' },
  '甲申': { name: '泉中水', element: '水' },
  '乙酉': { name: '泉中水', element: '水' },
  '丙戌': { name: '屋上土', element: '土' },
  '丁亥': { name: '屋上土', element: '土' },
  '戊子': { name: '霹雳火', element: '火' },
  '己丑': { name: '霹雳火', element: '火' },
  '庚寅': { name: '松柏木', element: '木' },
  '辛卯': { name: '松柏木', element: '木' },
  '壬辰': { name: '长流水', element: '水' },
  '癸巳': { name: '长流水', element: '水' },
  '甲午': { name: '砂中金', element: '金' },
  '乙未': { name: '砂中金', element: '金' },
  '丙申': { name: '山下火', element: '火' },
  '丁酉': { name: '山下火', element: '火' },
  '戊戌': { name: '平地木', element: '木' },
  '己亥': { name: '平地木', element: '木' },
  '庚子': { name: '壁上土', element: '土' },
  '辛丑': { name: '壁上土', element: '土' },
  '壬寅': { name: '金箔金', element: '金' },
  '癸卯': { name: '金箔金', element: '金' },
  '甲辰': { name: '覆灯火', element: '火' },
  '乙巳': { name: '覆灯火', element: '火' },
  '丙午': { name: '天河水', element: '水' },
  '丁未': { name: '天河水', element: '水' },
  '戊申': { name: '大驿土', element: '土' },
  '己酉': { name: '大驿土', element: '土' },
  '庚戌': { name: '钗钏金', element: '金' },
  '辛亥': { name: '钗钏金', element: '金' },
  '壬子': { name: '桑柘木', element: '木' },
  '癸丑': { name: '桑柘木', element: '木' },
  '甲寅': { name: '大溪水', element: '水' },
  '乙卯': { name: '大溪水', element: '水' },
  '丙辰': { name: '沙中土', element: '土' },
  '丁巳': { name: '沙中土', element: '土' },
  '戊午': { name: '天上火', element: '火' },
  '己未': { name: '天上火', element: '火' },
  '庚申': { name: '石榴木', element: '木' },
  '辛酉': { name: '石榴木', element: '木' },
  '壬戌': { name: '大海水', element: '水' },
  '癸亥': { name: '大海水', element: '水' }
} as const;

// 工具函数

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

/**
 * 获取干支组合
 */
export function getGanZhi(ganIndex: number, zhiIndex: number): GanZhi {
  const gan = getTianGanByIndex(ganIndex);
  const zhi = getDiZhiByIndex(zhiIndex);
  
  // 计算在六十甲子中的位置
  let index = 1;
  for (let i = 0; i < 60; i++) {
    if (TIAN_GAN[i % 10] === gan && DI_ZHI[i % 12] === zhi) {
      index = i + 1;
      break;
    }
  }
  
  return { gan, zhi, index };
}

/**
 * 获取纳音
 */
export function getNaYin(ganZhi: GanZhi): { name: string; element: string } {
  const key = `${ganZhi.gan}${ganZhi.zhi}` as keyof typeof NA_YIN_TABLE;
  return NA_YIN_TABLE[key] || { name: '未知', element: '未知' };
}

/**
 * 计算两个地支之间的距离
 */
export function getZhiDistance(from: DiZhi, to: DiZhi): number {
  const fromIndex = getDiZhiIndex(from);
  const toIndex = getDiZhiIndex(to);
  return (toIndex - fromIndex + 12) % 12;
}

/**
 * 地支相冲表
 */
export const ZHI_CHONG = {
  '子': '午', '丑': '未', '寅': '申', '卯': '酉',
  '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
  '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
} as const;

/**
 * 地支相合表
 */
export const ZHI_HE = {
  '子': '丑', '寅': '亥', '卯': '戌', '辰': '酉',
  '巳': '申', '午': '未', '丑': '子', '亥': '寅',
  '戌': '卯', '酉': '辰', '申': '巳', '未': '午'
} as const;

/**
 * 地支三合表
 */
export const ZHI_SAN_HE = {
  '申子辰': '水局',
  '亥卯未': '木局',
  '寅午戌': '火局',
  '巳酉丑': '金局'
} as const;
