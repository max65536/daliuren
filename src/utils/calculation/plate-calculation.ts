/**
 * 盘面计算核心算法
 * Plate Calculation Core Algorithm
 */

import type { 
  DaLiuRenPan,
  TianPan,
  DiPan,
  RenPan,
  ShenPan,
  DivinationRequest,
  DivinationResult,
  ShenJiangInfo
} from '../../types/divination';
import type { ChineseDateTime } from '../../types/calendar';
import { 
  calculateShenJiangPositions, 
  getGuiRenPosition,
  getShenJiangInfo 
} from '../constants/spirits';
import { 
  TIAN_GAN, 
  DI_ZHI, 
  getDiZhiIndex,
  getTianGanByIndex,
  getDiZhiByIndex
} from '../constants/stems-branches';
import { calculateSiKe, calculateSanChuan } from './four-lessons';
import { getChineseDateTime, isDayTime } from '../calendar/lunar-calendar';

/**
 * 计算完整的大六壬盘面
 */
export function calculateDaLiuRenPan(request: DivinationRequest): DaLiuRenPan {
  const chineseDateTime = getChineseDateTime(request.datetime);
  const { ganZhi } = chineseDateTime;
  
  // 计算天盘
  const tianPan = calculateTianPan(ganZhi.day);
  
  // 计算地盘
  const diPan = calculateDiPan(ganZhi.day, ganZhi.hour);
  
  // 计算人盘（四课三传）
  const renPan = calculateRenPan(ganZhi.day, ganZhi.hour, request.datetime.getHours());
  
  // 计算神盘
  const shenPan = calculateShenPan(ganZhi.day, request.datetime.getHours());
  
  return {
    tianPan,
    diPan,
    renPan,
    shenPan,
    metadata: {
      date: request.datetime,
      ganZhi,
      solarTerm: chineseDateTime.solarTerm.name,
      lunarDate: `${chineseDateTime.lunar.year}年${chineseDateTime.lunar.monthName}${chineseDateTime.lunar.dayName}`
    }
  };
}

/**
 * 计算天盘 - 天干在地支位置的分布
 */
function calculateTianPan(dayGanZhi: any): TianPan {
  const positions: Record<string, string> = {};
  
  // 天盘是固定的，天干按顺序分布在地支位置上
  // 从日干开始，按天干顺序分布
  const dayGanIndex = TIAN_GAN.indexOf(dayGanZhi.gan);
  
  for (let i = 0; i < 12; i++) {
    const zhi = DI_ZHI[i];
    const ganIndex = (dayGanIndex + i) % 10;
    const gan = TIAN_GAN[ganIndex];
    positions[zhi] = gan;
  }
  
  return { positions } as TianPan;
}

/**
 * 计算地盘 - 地支的当前排列
 */
function calculateDiPan(dayGanZhi: any, hourGanZhi: any): DiPan {
  const positions: Record<string, string> = {};
  
  // 地盘根据时辰旋转
  const hourZhiIndex = DI_ZHI.indexOf(hourGanZhi.zhi);
  
  for (let i = 0; i < 12; i++) {
    const fixedZhi = DI_ZHI[i];
    const rotatedIndex = (i + hourZhiIndex) % 12;
    const rotatedZhi = DI_ZHI[rotatedIndex];
    positions[fixedZhi] = rotatedZhi;
  }
  
  return {
    positions: positions as Record<any, any>,
    rotation: hourZhiIndex * 30 // 每个地支30度
  };
}

/**
 * 计算人盘 - 四课三传
 */
function calculateRenPan(dayGanZhi: any, hourGanZhi: any, hour: number): RenPan {
  const siKe = calculateSiKe(dayGanZhi, hourGanZhi, hour);
  const sanChuan = calculateSanChuan(siKe);
  
  return {
    siKe,
    sanChuan
  };
}

/**
 * 计算神盘 - 十二神将的位置
 */
function calculateShenPan(dayGanZhi: any, hour: number): ShenPan {
  const isDay = isDayTime(hour);
  const guiRenPosition = getGuiRenPosition(dayGanZhi.gan, isDay);
  const shenJiangPositions = calculateShenJiangPositions(guiRenPosition, true);
  
  const spirits: Record<string, ShenJiangInfo> = {};
  
  for (const [zhi, shenJiang] of Object.entries(shenJiangPositions)) {
    spirits[zhi] = getShenJiangInfo(shenJiang, zhi as any);
  }
  
  return {
    spirits: spirits as Record<any, ShenJiangInfo>,
    guiRenPosition
  };
}

/**
 * 生成占卜结果
 */
export function generateDivinationResult(request: DivinationRequest): DivinationResult {
  const pan = calculateDaLiuRenPan(request);
  const interpretation = interpretDivination(pan, request);
  const confidence = calculateConfidence(pan);
  
  return {
    pan,
    interpretation,
    confidence
  };
}

/**
 * 解释占卜结果
 */
function interpretDivination(pan: DaLiuRenPan, request: DivinationRequest): {
  general: string;
  detailed: string[];
  suggestions: string[];
  warnings: string[];
} {
  const { renPan, shenPan } = pan;
  const { siKe, sanChuan } = renPan;
  
  // 总体解释
  const general = generateGeneralInterpretation(sanChuan, request.category);
  
  // 详细分析
  const detailed = generateDetailedAnalysis(siKe, sanChuan, shenPan);
  
  // 建议
  const suggestions = generateSuggestions(sanChuan, request.category);
  
  // 警告
  const warnings = generateWarnings(siKe, sanChuan);
  
  return {
    general,
    detailed,
    suggestions,
    warnings
  };
}

/**
 * 生成总体解释
 */
function generateGeneralInterpretation(sanChuan: any, category?: string): string {
  const { chu, zhong, mo } = sanChuan;
  
  let interpretation = `根据三传分析：初传${chu.shen}，中传${zhong.shen}，末传${mo.shen}。`;
  
  // 根据类别调整解释
  switch (category) {
    case '事业':
      interpretation += '在事业方面，';
      break;
    case '财运':
      interpretation += '在财运方面，';
      break;
    case '感情':
      interpretation += '在感情方面，';
      break;
    case '健康':
      interpretation += '在健康方面，';
      break;
    case '学业':
      interpretation += '在学业方面，';
      break;
    default:
      interpretation += '综合来看，';
  }
  
  // 根据初传神将给出主要判断
  if (chu.shen === '贵人') {
    interpretation += '有贵人相助，事情发展顺利。';
  } else if (chu.shen === '青龙') {
    interpretation += '喜庆之事将至，财运亨通。';
  } else if (chu.shen === '白虎') {
    interpretation += '需防意外之事，宜谨慎行事。';
  } else if (chu.shen === '朱雀') {
    interpretation += '可能有口舌是非，需注意沟通方式。';
  } else {
    interpretation += chu.meaning;
  }
  
  return interpretation;
}

/**
 * 生成详细分析
 */
function generateDetailedAnalysis(siKe: any, sanChuan: any, shenPan: ShenPan): string[] {
  const analysis: string[] = [];
  
  // 四课分析
  analysis.push(`一课：${siKe.first.shen}在${siKe.first.zhi}位，${getShenAnalysis(siKe.first.shen)}`);
  analysis.push(`二课：${siKe.second.shen}在${siKe.second.zhi}位，${getShenAnalysis(siKe.second.shen)}`);
  analysis.push(`三课：${siKe.third.shen}在${siKe.third.zhi}位，${getShenAnalysis(siKe.third.shen)}`);
  analysis.push(`四课：${siKe.fourth.shen}在${siKe.fourth.zhi}位，${getShenAnalysis(siKe.fourth.shen)}`);
  
  // 三传分析
  analysis.push(`初传${sanChuan.chu.shen}：${sanChuan.chu.meaning}`);
  analysis.push(`中传${sanChuan.zhong.shen}：${sanChuan.zhong.meaning}`);
  analysis.push(`末传${sanChuan.mo.shen}：${sanChuan.mo.meaning}`);
  
  // 贵人位置分析
  analysis.push(`贵人在${shenPan.guiRenPosition}位，主导整体运势走向`);
  
  return analysis;
}

/**
 * 获取神将分析
 */
function getShenAnalysis(shen: string): string {
  const analyses: Record<string, string> = {
    '贵人': '主贵人扶持，地位提升',
    '腾蛇': '主变化惊扰，需防虚惊',
    '朱雀': '主文书信息，或有口舌',
    '六合': '主和合协调，利于合作',
    '勾陈': '主纠纷束缚，田土之事',
    '青龙': '主喜庆财运，生机勃发',
    '天空': '主空虚不实，防范欺骗',
    '白虎': '主疾病伤灾，需防凶险',
    '太常': '主平常稳定，衣食充足',
    '玄武': '主盗贼暗昧，阴私之事',
    '太阴': '主阴柔隐秘，女性之事',
    '天后': '主慈爱滋养，母性关怀'
  };
  
  return analyses[shen] || '含义待解';
}

/**
 * 生成建议
 */
function generateSuggestions(sanChuan: any, category?: string): string[] {
  const suggestions: string[] = [];
  
  // 根据初传给建议
  if (sanChuan.chu.shen === '贵人') {
    suggestions.push('宜主动寻求贵人帮助，把握机遇');
    suggestions.push('保持谦逊态度，广结善缘');
  } else if (sanChuan.chu.shen === '青龙') {
    suggestions.push('适合投资理财，把握财运');
    suggestions.push('可考虑拓展业务，发展新项目');
  } else if (sanChuan.chu.shen === '六合') {
    suggestions.push('利于合作洽谈，签订合同');
    suggestions.push('感情方面有利，可考虑重要决定');
  }
  
  // 根据类别给出针对性建议
  if (category === '事业') {
    suggestions.push('工作中保持积极态度，主动承担责任');
  } else if (category === '财运') {
    suggestions.push('理财需谨慎，避免高风险投资');
  } else if (category === '感情') {
    suggestions.push('多沟通理解，避免误会产生');
  }
  
  return suggestions;
}

/**
 * 生成警告
 */
function generateWarnings(siKe: any, sanChuan: any): string[] {
  const warnings: string[] = [];
  
  // 检查凶神
  const dangerousSpirits = ['白虎', '腾蛇', '朱雀', '玄武', '天空'];
  
  if (dangerousSpirits.includes(sanChuan.chu.shen)) {
    warnings.push(`初传遇${sanChuan.chu.shen}，需特别注意相关事项`);
  }
  
  if (sanChuan.chu.shen === '白虎') {
    warnings.push('注意身体健康，避免意外伤害');
  } else if (sanChuan.chu.shen === '朱雀') {
    warnings.push('谨慎言辞，避免口舌是非');
  } else if (sanChuan.chu.shen === '玄武') {
    warnings.push('防范小人暗算，保护财物安全');
  } else if (sanChuan.chu.shen === '天空') {
    warnings.push('避免虚假信息，谨防上当受骗');
  }
  
  return warnings;
}

/**
 * 计算可信度
 */
function calculateConfidence(pan: DaLiuRenPan): number {
  let confidence = 0.7; // 基础可信度
  
  const { renPan, shenPan } = pan;
  const { siKe } = renPan;
  
  // 根据四课的一致性调整可信度
  const spirits = [siKe.first.shen, siKe.second.shen, siKe.third.shen, siKe.fourth.shen];
  const uniqueSpirits = new Set(spirits);
  
  if (uniqueSpirits.size === 4) {
    confidence += 0.2; // 四课不重复，可信度高
  } else if (uniqueSpirits.size === 1) {
    confidence += 0.1; // 四课相同，也有一定可信度
  }
  
  // 根据贵人位置调整
  if (shenPan.guiRenPosition) {
    confidence += 0.1;
  }
  
  return Math.min(1.0, confidence);
}

/**
 * 获取盘面摘要信息
 */
export function getPanSummary(pan: DaLiuRenPan): {
  dayGanZhi: string;
  hourGanZhi: string;
  guiRenPosition: string;
  mainSpirits: string[];
  solarTerm: string;
} {
  const { metadata, renPan, shenPan } = pan;
  const { ganZhi } = metadata;
  
  return {
    dayGanZhi: `${ganZhi.day.gan}${ganZhi.day.zhi}`,
    hourGanZhi: `${ganZhi.hour.gan}${ganZhi.hour.zhi}`,
    guiRenPosition: shenPan.guiRenPosition,
    mainSpirits: [
      renPan.sanChuan.chu.shen,
      renPan.sanChuan.zhong.shen,
      renPan.sanChuan.mo.shen
    ],
    solarTerm: metadata.solarTerm
  };
}
