/**
 * 大六壬起课主接口
 * Da Liu Ren Divination Main Interface
 */

import type { 
  DivinationInput, 
  GanZhi, 
  SiKe, 
  SanChuan, 
  TianGan, 
  DiZhi, 
  ShenJiang 
} from '../types';
import { 
  TIAN_GAN, 
  DI_ZHI, 
  getTianGanIndex, 
  getDiZhiIndex 
} from '../constants/stems-branches';
import { 
  getGuiRenPosition, 
  calculateShenJiangPositions, 
  isDayTime 
} from '../constants/spirits';

/**
 * 从字符串解析干支
 */
export function parseGanZhi(ganZhiStr: string): GanZhi {
  if (ganZhiStr.length !== 2) {
    throw new Error('干支字符串格式错误，应为两个字符');
  }
  
  const gan = ganZhiStr[0] as TianGan;
  const zhi = ganZhiStr[1] as DiZhi;
  
  if (!TIAN_GAN.includes(gan)) {
    throw new Error(`无效的天干：${gan}`);
  }
  
  if (!DI_ZHI.includes(zhi)) {
    throw new Error(`无效的地支：${zhi}`);
  }
  
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
 * 快速计算接口
 */
export function quickCalculate(
  dayGanZhi: string,
  monthGanZhi: string,
  yueJiang: DiZhi,
  hour: number
): string {
  try {
    const dayGZ = parseGanZhi(dayGanZhi);
    const monthGZ = parseGanZhi(monthGanZhi);
    
    // 计算神将位置
    const isDay = isDayTime(hour);
    const guiRenPosition = getGuiRenPosition(dayGZ.gan, isDay);
    const shenJiangPositions = calculateShenJiangPositions(guiRenPosition, true);
    
    // 简化的四课计算
    const siKe = calculateSimpleSiKe(dayGZ, shenJiangPositions);
    
    // 格式化输出
    return formatQuickResult(dayGZ, monthGZ, yueJiang, siKe, shenJiangPositions);
  } catch (error) {
    return `计算错误: ${error instanceof Error ? error.message : '未知错误'}`;
  }
}

/**
 * 从字符串计算
 */
export function calculateFromStrings(
  dayGanZhi: string,
  hourGanZhi: string,
  hour: number
): {
  siKe: SiKe;
  shenJiangPositions: Record<DiZhi, ShenJiang>;
} {
  const dayGZ = parseGanZhi(dayGanZhi);
  const hourGZ = parseGanZhi(hourGanZhi);
  
  const isDay = isDayTime(hour);
  const guiRenPosition = getGuiRenPosition(dayGZ.gan, isDay);
  const shenJiangPositions = calculateShenJiangPositions(guiRenPosition, true);
  
  const siKe = calculateSimpleSiKe(dayGZ, shenJiangPositions);
  
  return { siKe, shenJiangPositions };
}

/**
 * 简化的四课计算
 */
function calculateSimpleSiKe(
  dayGanZhi: GanZhi,
  shenJiangPositions: Record<DiZhi, ShenJiang>
): SiKe {
  const { gan: dayGan, zhi: dayZhi } = dayGanZhi;
  
  // 获取天干对应的地支位置
  const ganZhiMap: Record<TianGan, DiZhi> = {
    '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳',
    '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
  };
  
  const ganCorrespondingZhi = ganZhiMap[dayGan];
  
  // 第一课（干阳课）
  const firstZhi = getTianPanZhi(ganCorrespondingZhi, shenJiangPositions);
  const first = {
    gan: dayGan,
    zhi: firstZhi,
    shen: shenJiangPositions[ganCorrespondingZhi],
    position: 1
  };
  
  // 第二课（干阴课）
  const secondZhi = getTianPanZhi(firstZhi, shenJiangPositions);
  const second = {
    gan: dayGan,
    zhi: secondZhi,
    shen: shenJiangPositions[firstZhi],
    position: 2
  };
  
  // 第三课（支阳课）
  const thirdZhi = getTianPanZhi(dayZhi, shenJiangPositions);
  const third = {
    gan: dayGan,
    zhi: thirdZhi,
    shen: shenJiangPositions[dayZhi],
    position: 3
  };
  
  // 第四课（支阴课）
  const fourthZhi = getTianPanZhi(thirdZhi, shenJiangPositions);
  const fourth = {
    gan: dayGan,
    zhi: fourthZhi,
    shen: shenJiangPositions[thirdZhi],
    position: 4
  };
  
  return { first, second, third, fourth };
}

/**
 * 获取天盘地支（简化版本）
 */
function getTianPanZhi(
  diPanZhi: DiZhi,
  shenJiangPositions: Record<DiZhi, ShenJiang>
): DiZhi {
  // 找到贵人在地盘的位置
  let guiRenDiPanPosition: DiZhi = '子';
  for (const [zhi, shen] of Object.entries(shenJiangPositions)) {
    if (shen === '贵人') {
      guiRenDiPanPosition = zhi as DiZhi;
      break;
    }
  }
  
  const guiRenIndex = getDiZhiIndex(guiRenDiPanPosition);
  const ziIndex = getDiZhiIndex('子');
  const offset = (guiRenIndex - ziIndex + 12) % 12;
  
  const diPanIndex = getDiZhiIndex(diPanZhi);
  const tianPanIndex = (diPanIndex + offset) % 12;
  
  return DI_ZHI[tianPanIndex];
}

/**
 * 格式化快速计算结果
 */
function formatQuickResult(
  dayGZ: GanZhi,
  monthGZ: GanZhi,
  yueJiang: DiZhi,
  siKe: SiKe,
  shenJiangPositions: Record<DiZhi, ShenJiang>
): string {
  let result = `=== 大六壬起课结果 ===\n\n`;
  result += `日干支: ${dayGZ.gan}${dayGZ.zhi}\n`;
  result += `月干支: ${monthGZ.gan}${monthGZ.zhi}\n`;
  result += `月将: ${yueJiang}\n\n`;
  
  result += `四课:\n`;
  result += `一课: ${siKe.first.gan} - ${siKe.first.zhi} (${siKe.first.shen})\n`;
  result += `二课: ${siKe.second.gan} - ${siKe.second.zhi} (${siKe.second.shen})\n`;
  result += `三课: ${siKe.third.gan} - ${siKe.third.zhi} (${siKe.third.shen})\n`;
  result += `四课: ${siKe.fourth.gan} - ${siKe.fourth.zhi} (${siKe.fourth.shen})\n\n`;
  
  result += `神将位置:\n`;
  for (const zhi of DI_ZHI) {
    result += `${zhi}: ${shenJiangPositions[zhi]}\n`;
  }
  
  return result;
}
