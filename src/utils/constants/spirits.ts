/**
 * 十二神将常量定义
 * Twelve Spirits Constants
 */

import type { ShenJiang, ShenJiangInfo, DiZhi } from '../../types/divination';

// 十二神将 (Twelve Spirits)
export const SHEN_JIANG: readonly ShenJiang[] = [
  '贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙',
  '天空', '白虎', '太常', '玄武', '太阴', '天后'
] as const;

// 神将属性详细信息
export const SHEN_JIANG_ATTRIBUTES: Record<ShenJiang, {
  element: '金' | '木' | '水' | '火' | '土';
  nature: '吉' | '凶' | '中';
  direction: '东' | '南' | '西' | '北' | '中';
  description: string;
  meanings: string[];
  colors: string[];
}> = {
  '贵人': {
    element: '土',
    nature: '吉',
    direction: '中',
    description: '天乙贵人，最为尊贵，主贵人相助、地位提升',
    meanings: ['贵人相助', '地位提升', '权威', '尊贵', '官运'],
    colors: ['#FFD700', '#FFA500'] // 金黄色
  },
  '腾蛇': {
    element: '火',
    nature: '凶',
    direction: '南',
    description: '主虚惊、怪异、变化无常',
    meanings: ['虚惊', '怪异', '变化', '不安', '惊恐'],
    colors: ['#FF4500', '#DC143C'] // 橙红色
  },
  '朱雀': {
    element: '火',
    nature: '凶',
    direction: '南',
    description: '主口舌是非、文书、信息',
    meanings: ['口舌', '是非', '文书', '信息', '争执'],
    colors: ['#DC143C', '#B22222'] // 朱红色
  },
  '六合': {
    element: '木',
    nature: '吉',
    direction: '东',
    description: '主和合、婚姻、合作',
    meanings: ['和合', '婚姻', '合作', '团结', '协调'],
    colors: ['#32CD32', '#228B22'] // 绿色
  },
  '勾陈': {
    element: '土',
    nature: '凶',
    direction: '中',
    description: '主田土、牢狱、纠纷',
    meanings: ['田土', '牢狱', '纠纷', '束缚', '困扰'],
    colors: ['#8B4513', '#A0522D'] // 土黄色
  },
  '青龙': {
    element: '木',
    nature: '吉',
    direction: '东',
    description: '主喜庆、财运、生机',
    meanings: ['喜庆', '财运', '生机', '活力', '成长'],
    colors: ['#20B2AA', '#008B8B'] // 青色
  },
  '天空': {
    element: '土',
    nature: '凶',
    direction: '中',
    description: '主空虚、失落、不实',
    meanings: ['空虚', '失落', '不实', '虚无', '欺骗'],
    colors: ['#708090', '#2F4F4F'] // 灰色
  },
  '白虎': {
    element: '金',
    nature: '凶',
    direction: '西',
    description: '主疾病、伤灾、孝服',
    meanings: ['疾病', '伤灾', '孝服', '死亡', '凶险'],
    colors: ['#F5F5F5', '#DCDCDC'] // 白色
  },
  '太常': {
    element: '土',
    nature: '吉',
    direction: '中',
    description: '主衣食、平常、稳定',
    meanings: ['衣食', '平常', '稳定', '日常', '生活'],
    colors: ['#DEB887', '#D2B48C'] // 米色
  },
  '玄武': {
    element: '水',
    nature: '凶',
    direction: '北',
    description: '主盗贼、暗昧、阴私',
    meanings: ['盗贼', '暗昧', '阴私', '隐秘', '欺诈'],
    colors: ['#2F2F2F', '#000000'] // 黑色
  },
  '太阴': {
    element: '金',
    nature: '中',
    direction: '西',
    description: '主阴私、女人、暗中',
    meanings: ['阴私', '女人', '暗中', '隐藏', '柔和'],
    colors: ['#C0C0C0', '#B0C4DE'] // 银色
  },
  '天后': {
    element: '水',
    nature: '吉',
    direction: '北',
    description: '主后土、母亲、滋养',
    meanings: ['后土', '母亲', '滋养', '包容', '慈爱'],
    colors: ['#4169E1', '#1E90FF'] // 蓝色
  }
};

// 贵人定位表 (根据日干确定贵人位置)
export const GUI_REN_POSITION: Record<string, { day: DiZhi; night: DiZhi }> = {
  '甲': { day: '丑', night: '未' },
  '乙': { day: '子', night: '申' },
  '丙': { day: '亥', night: '酉' },
  '丁': { day: '亥', night: '酉' },
  '戊': { day: '丑', night: '未' },
  '己': { day: '子', night: '申' },
  '庚': { day: '丑', night: '未' },
  '辛': { day: '午', night: '寅' },
  '壬': { day: '卯', night: '巳' },
  '癸': { day: '卯', night: '巳' }
};

// 神将顺序 (从贵人开始顺时针排列)
export const SHEN_JIANG_ORDER: readonly ShenJiang[] = [
  '贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙',
  '天空', '白虎', '太常', '玄武', '太阴', '天后'
] as const;

// 神将逆序 (从贵人开始逆时针排列)
export const SHEN_JIANG_REVERSE_ORDER: readonly ShenJiang[] = [
  '贵人', '天后', '太阴', '玄武', '太常', '白虎',
  '天空', '青龙', '勾陈', '六合', '朱雀', '腾蛇'
] as const;

// 工具函数

/**
 * 获取神将索引
 */
export function getShenJiangIndex(shen: ShenJiang): number {
  return SHEN_JIANG.indexOf(shen);
}

/**
 * 根据索引获取神将
 */
export function getShenJiangByIndex(index: number): ShenJiang {
  return SHEN_JIANG[index % 12];
}

/**
 * 获取贵人位置
 */
export function getGuiRenPosition(dayGan: string, isDay: boolean = true): DiZhi {
  const positions = GUI_REN_POSITION[dayGan];
  if (!positions) {
    throw new Error(`Invalid day gan: ${dayGan}`);
  }
  return isDay ? positions.day : positions.night;
}

/**
 * 计算神将在指定位置的排列
 */
export function calculateShenJiangPositions(
  guiRenPosition: DiZhi,
  clockwise: boolean = true
): Record<DiZhi, ShenJiang> {
  const result: Record<DiZhi, ShenJiang> = {} as Record<DiZhi, ShenJiang>;
  const zhiOrder: DiZhi[] = [
    '子', '丑', '寅', '卯', '辰', '巳',
    '午', '未', '申', '酉', '戌', '亥'
  ];
  
  const guiRenIndex = zhiOrder.indexOf(guiRenPosition);
  const shenOrder = clockwise ? SHEN_JIANG_ORDER : SHEN_JIANG_REVERSE_ORDER;
  
  for (let i = 0; i < 12; i++) {
    const zhiIndex = clockwise 
      ? (guiRenIndex + i) % 12 
      : (guiRenIndex - i + 12) % 12;
    const zhi = zhiOrder[zhiIndex];
    result[zhi] = shenOrder[i];
  }
  
  return result;
}

/**
 * 获取神将详细信息
 */
export function getShenJiangInfo(shen: ShenJiang, position: DiZhi): ShenJiangInfo {
  const attributes = SHEN_JIANG_ATTRIBUTES[shen];
  return {
    name: shen,
    position,
    attributes: {
      element: attributes.element,
      nature: attributes.nature,
      direction: attributes.direction
    }
  };
}

/**
 * 判断神将吉凶
 */
export function isShenJiangAuspicious(shen: ShenJiang): boolean {
  return SHEN_JIANG_ATTRIBUTES[shen].nature === '吉';
}

/**
 * 获取神将颜色
 */
export function getShenJiangColors(shen: ShenJiang): string[] {
  return SHEN_JIANG_ATTRIBUTES[shen].colors;
}

/**
 * 获取神将含义
 */
export function getShenJiangMeanings(shen: ShenJiang): string[] {
  return SHEN_JIANG_ATTRIBUTES[shen].meanings;
}

/**
 * 神将相克关系
 */
export const SHEN_JIANG_KE = {
  '贵人': ['腾蛇', '朱雀'], // 贵人克制凶神
  '青龙': ['白虎'],         // 青龙克白虎
  '六合': ['勾陈'],         // 六合化解勾陈
  '天后': ['玄武'],         // 天后制玄武
  '太常': ['天空']          // 太常实天空
} as const;

/**
 * 神将相生关系
 */
export const SHEN_JIANG_SHENG = {
  '贵人': ['太常', '勾陈'], // 贵人生土神
  '青龙': ['六合'],         // 木神相生
  '朱雀': ['腾蛇'],         // 火神相生
  '白虎': ['太阴'],         // 金神相生
  '玄武': ['天后']          // 水神相生
} as const;
