/**
 * 十二神将常量定义
 * Twelve Spirits Constants
 */

import type { ShenJiang, TianGan, DiZhi, ShenJiangInfo } from '../types';

// 十二神将顺序
export const SHEN_JIANG: readonly ShenJiang[] = [
  '贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙',
  '天空', '白虎', '太常', '玄武', '太阴', '天后'
] as const;

// 贵人位置表（日干对应的贵人位置）
export const GUI_REN_POSITIONS: Record<TianGan, { day: DiZhi; night: DiZhi }> = {
  '甲': { day: '丑', night: '未' },
  '乙': { day: '子', night: '申' },
  '丙': { day: '亥', night: '酉' },
  '丁': { day: '亥', night: '酉' },
  '戊': { day: '丑', night: '未' },
  '己': { day: '子', night: '申' },
  '庚': { day: '丑', night: '未' },
  '辛': { day: '午', night: '寅' },
  '壬': { day: '巳', night: '卯' },
  '癸': { day: '巳', night: '卯' }
};

// 神将属性信息
export const SHEN_JIANG_INFO: Record<ShenJiang, ShenJiangInfo> = {
  '贵人': {
    name: '贵人',
    position: '子', // 默认位置，实际使用时会动态计算
    attributes: {
      element: '土',
      nature: '吉',
      direction: '中'
    }
  },
  '腾蛇': {
    name: '腾蛇',
    position: '丑',
    attributes: {
      element: '火',
      nature: '凶',
      direction: '南'
    }
  },
  '朱雀': {
    name: '朱雀',
    position: '寅',
    attributes: {
      element: '火',
      nature: '中',
      direction: '南'
    }
  },
  '六合': {
    name: '六合',
    position: '卯',
    attributes: {
      element: '木',
      nature: '吉',
      direction: '东'
    }
  },
  '勾陈': {
    name: '勾陈',
    position: '辰',
    attributes: {
      element: '土',
      nature: '凶',
      direction: '中'
    }
  },
  '青龙': {
    name: '青龙',
    position: '巳',
    attributes: {
      element: '木',
      nature: '吉',
      direction: '东'
    }
  },
  '天空': {
    name: '天空',
    position: '午',
    attributes: {
      element: '火',
      nature: '凶',
      direction: '南'
    }
  },
  '白虎': {
    name: '白虎',
    position: '未',
    attributes: {
      element: '金',
      nature: '凶',
      direction: '西'
    }
  },
  '太常': {
    name: '太常',
    position: '申',
    attributes: {
      element: '土',
      nature: '吉',
      direction: '中'
    }
  },
  '玄武': {
    name: '玄武',
    position: '酉',
    attributes: {
      element: '水',
      nature: '凶',
      direction: '北'
    }
  },
  '太阴': {
    name: '太阴',
    position: '戌',
    attributes: {
      element: '金',
      nature: '中',
      direction: '西'
    }
  },
  '天后': {
    name: '天后',
    position: '亥',
    attributes: {
      element: '水',
      nature: '吉',
      direction: '北'
    }
  }
};

/**
 * 获取贵人位置
 */
export function getGuiRenPosition(dayGan: TianGan, isDayTime: boolean): DiZhi {
  const positions = GUI_REN_POSITIONS[dayGan];
  return isDayTime ? positions.day : positions.night;
}

/**
 * 计算神将位置
 */
export function calculateShenJiangPositions(
  guiRenPosition: DiZhi,
  clockwise: boolean = true
): Record<DiZhi, ShenJiang> {
  const positions: Record<DiZhi, ShenJiang> = {} as Record<DiZhi, ShenJiang>;
  const diZhiOrder: DiZhi[] = [
    '子', '丑', '寅', '卯', '辰', '巳',
    '午', '未', '申', '酉', '戌', '亥'
  ];
  
  const guiRenIndex = diZhiOrder.indexOf(guiRenPosition);
  
  for (let i = 0; i < 12; i++) {
    const shenJiang = SHEN_JIANG[i];
    let zhiIndex: number;
    
    if (clockwise) {
      zhiIndex = (guiRenIndex + i) % 12;
    } else {
      zhiIndex = (guiRenIndex - i + 12) % 12;
    }
    
    const zhi = diZhiOrder[zhiIndex];
    positions[zhi] = shenJiang;
  }
  
  return positions;
}

/**
 * 判断是否为白天时间
 */
export function isDayTime(hour: number): boolean {
  return hour >= 6 && hour < 18;
}

/**
 * 获取神将含义
 */
export function getShenJiangMeaning(shen: ShenJiang): string {
  const meanings: Record<ShenJiang, string> = {
    '贵人': '贵人相助，事业顺利',
    '腾蛇': '变化无常，需防虚惊',
    '朱雀': '口舌是非，文书信息',
    '六合': '和合美满，合作顺利',
    '勾陈': '纠纷束缚，田土之事',
    '青龙': '喜庆财运，生机勃勃',
    '天空': '空虚不实，防范欺骗',
    '白虎': '疾病伤灾，需防凶险',
    '太常': '平常稳定，衣食无忧',
    '玄武': '盗贼暗昧，阴私之事',
    '太阴': '阴柔隐秘，女性相关',
    '天后': '慈爱包容，母性滋养'
  };
  return meanings[shen] || '含义待解';
}

/**
 * 判断神将吉凶
 */
export function isShenJiangAuspicious(shen: ShenJiang): boolean {
  return SHEN_JIANG_INFO[shen].attributes.nature === '吉';
}
