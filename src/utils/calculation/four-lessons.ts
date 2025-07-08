/**
 * 四课起法算法
 * Four Lessons Calculation Algorithm
 */

import type { 
  SiKe, 
  KeInfo, 
  SanChuan, 
  ChuanInfo, 
  TianGan, 
  DiZhi, 
  ShenJiang,
  GanZhi 
} from '../../types/divination';
import { 
  TIAN_GAN, 
  DI_ZHI, 
  getDiZhiIndex, 
  getTianGanIndex,
  getDiZhiByIndex,
  getTianGanByIndex
} from '../constants/stems-branches';
import { 
  calculateShenJiangPositions, 
  getGuiRenPosition 
} from '../constants/spirits';
import { isDayTime } from '../calendar/lunar-calendar';

/**
 * 立四课 - 根据日干支和时辰立四课
 * 传统大六壬四课立法：
 * 一课：日干加临的地支上的神将
 * 二课：日支上的神将  
 * 三课：时干加临的地支上的神将
 * 四课：时支上的神将
 */
export function calculateSiKe(
  dayGanZhi: GanZhi,
  hourGanZhi: GanZhi,
  hour: number
): SiKe {
  const { gan: dayGan, zhi: dayZhi } = dayGanZhi;
  const { gan: hourGan, zhi: hourZhi } = hourGanZhi;
  
  // 获取贵人位置
  const isDay = isDayTime(hour);
  const guiRenPosition = getGuiRenPosition(dayGan, isDay);
  
  // 计算神将位置
  const shenJiangPositions = calculateShenJiangPositions(guiRenPosition, true);
  
  // 一课：日干加临的地支上的神将
  const dayGanZhi_target = getGanCorrespondingZhi(dayGan);
  const first: KeInfo = {
    gan: dayGan,
    zhi: dayGanZhi_target,
    shen: shenJiangPositions[dayGanZhi_target],
    position: 1
  };
  
  // 二课：日支上的神将
  const second: KeInfo = {
    gan: dayGan, // 课的天干仍为日干
    zhi: dayZhi,
    shen: shenJiangPositions[dayZhi],
    position: 2
  };
  
  // 三课：时干加临的地支上的神将
  const hourGanZhi_target = getGanCorrespondingZhi(hourGan);
  const third: KeInfo = {
    gan: hourGan,
    zhi: hourGanZhi_target,
    shen: shenJiangPositions[hourGanZhi_target],
    position: 3
  };
  
  // 四课：时支上的神将
  const fourth: KeInfo = {
    gan: hourGan, // 课的天干仍为时干
    zhi: hourZhi,
    shen: shenJiangPositions[hourZhi],
    position: 4
  };
  
  return {
    first,
    second,
    third,
    fourth
  };
}

/**
 * 计算单个课的信息
 */
function calculateKeInfo(
  gan: TianGan,
  zhi: DiZhi,
  shenJiangPositions: Record<DiZhi, ShenJiang>,
  position: number
): KeInfo {
  // 根据课的位置确定地支
  let targetZhi: DiZhi;
  
  switch (position) {
    case 1: // 一课：日干对应的地支
      targetZhi = getGanCorrespondingZhi(gan);
      break;
    case 2: // 二课：日支
      targetZhi = zhi;
      break;
    case 3: // 三课：时干对应的地支
      targetZhi = getGanCorrespondingZhi(gan);
      break;
    case 4: // 四课：时支
      targetZhi = zhi;
      break;
    default:
      targetZhi = zhi;
  }
  
  const shen = shenJiangPositions[targetZhi];
  
  return {
    gan,
    zhi: targetZhi,
    shen,
    position
  };
}

/**
 * 获取天干对应的地支位置
 */
function getGanCorrespondingZhi(gan: TianGan): DiZhi {
  // 天干对应地支的传统对应关系
  const ganZhiMap: Record<TianGan, DiZhi> = {
    '甲': '寅',
    '乙': '卯',
    '丙': '巳',
    '丁': '午',
    '戊': '巳',
    '己': '午',
    '庚': '申',
    '辛': '酉',
    '壬': '亥',
    '癸': '子'
  };
  
  return ganZhiMap[gan];
}

/**
 * 发三传 - 从四课中提取三传
 */
export function calculateSanChuan(siKe: SiKe): SanChuan {
  // 检查四课中的重复情况
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const uniqueKe = getUniqueKe(keArray);
  
  if (uniqueKe.length === 4) {
    // 四课无重复，用贼克法
    return calculateZeiKeFa(siKe);
  } else if (uniqueKe.length === 3) {
    // 一重一空，用涉害法
    return calculateSheHaiFa(siKe, uniqueKe);
  } else if (uniqueKe.length === 2) {
    // 二重二空，用遥克法
    return calculateYaoKeFa(siKe, uniqueKe);
  } else {
    // 三重一空或四重，用昴星法
    return calculateMaoXingFa(siKe, uniqueKe);
  }
}

/**
 * 获取四课中不重复的课
 */
function getUniqueKe(keArray: KeInfo[]): KeInfo[] {
  const unique: KeInfo[] = [];
  const seen = new Set<string>();
  
  for (const ke of keArray) {
    const key = `${ke.zhi}-${ke.shen}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(ke);
    }
  }
  
  return unique;
}

/**
 * 贼克法 - 四课无重复时使用
 * 传统贼克法：找出上下相克的课，以被克者为初传，克者为中传，中传所克为末传
 */
function calculateZeiKeFa(siKe: SiKe): SanChuan {
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  
  // 寻找上下相克的课
  for (let i = 0; i < keArray.length; i++) {
    const currentKe = keArray[i];
    
    // 检查是否有其他课克制当前课
    for (let j = 0; j < keArray.length; j++) {
      if (i !== j) {
        const otherKe = keArray[j];
        
        // 检查五行相克关系
        if (isWuXingKe(getZhiWuXing(otherKe.zhi), getZhiWuXing(currentKe.zhi))) {
          // 找到相克关系：otherKe克currentKe
          const chu = createChuanInfo(currentKe); // 被克者为初传
          const zhong = createChuanInfo(otherKe); // 克者为中传
          
          // 中传所克为末传
          const moZhi = findKeTarget(otherKe.zhi);
          const mo: ChuanInfo = {
            zhi: moZhi,
            shen: getShenByZhi(moZhi, siKe),
            meaning: '贼克末传'
          };
          
          return { chu, zhong, mo };
        }
      }
    }
  }
  
  // 如果没有找到明显的相克关系，按传统顺序取课
  const chu = createChuanInfo(siKe.first);
  const zhong = createChuanInfo(siKe.second);
  const mo = createChuanInfo(siKe.third);
  
  return { chu, zhong, mo };
}

/**
 * 涉害法 - 一重一空时使用
 */
function calculateSheHaiFa(siKe: SiKe, uniqueKe: KeInfo[]): SanChuan {
  // 取不重复的三个课作为三传
  const chu = createChuanInfo(uniqueKe[0]);
  const zhong = createChuanInfo(uniqueKe[1]);
  const mo = createChuanInfo(uniqueKe[2]);
  
  return { chu, zhong, mo };
}

/**
 * 遥克法 - 二重二空时使用
 */
function calculateYaoKeFa(siKe: SiKe, uniqueKe: KeInfo[]): SanChuan {
  // 取不重复的两个课，再找一个相关的课
  const chu = createChuanInfo(uniqueKe[0]);
  const zhong = createChuanInfo(uniqueKe[1]);
  
  // 找第三传，通常是与前两传有关联的地支
  const moZhi = findRelatedZhi(uniqueKe[0].zhi, uniqueKe[1].zhi);
  const mo: ChuanInfo = {
    zhi: moZhi,
    shen: '贵人', // 简化处理
    meaning: '遥克所得'
  };
  
  return { chu, zhong, mo };
}

/**
 * 昴星法 - 三重一空或四重时使用
 */
function calculateMaoXingFa(siKe: SiKe, uniqueKe: KeInfo[]): SanChuan {
  // 昴星法的复杂计算，这里简化处理
  const baseKe = uniqueKe[0] || siKe.first;
  
  const chu = createChuanInfo(baseKe);
  const zhong: ChuanInfo = {
    zhi: getNextZhi(baseKe.zhi),
    shen: '腾蛇',
    meaning: '昴星中传'
  };
  const mo: ChuanInfo = {
    zhi: getNextZhi(zhong.zhi),
    shen: '朱雀',
    meaning: '昴星末传'
  };
  
  return { chu, zhong, mo };
}

/**
 * 创建传信息
 */
function createChuanInfo(ke: KeInfo): ChuanInfo {
  return {
    zhi: ke.zhi,
    shen: ke.shen,
    meaning: getChuanMeaning(ke.shen)
  };
}

/**
 * 获取传的含义
 */
function getChuanMeaning(shen: ShenJiang): string {
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
 * 获取下一个地支
 */
function getNextZhi(zhi: DiZhi): DiZhi {
  const index = getDiZhiIndex(zhi);
  return getDiZhiByIndex((index + 1) % 12);
}

/**
 * 找到与两个地支相关的第三个地支
 */
function findRelatedZhi(zhi1: DiZhi, zhi2: DiZhi): DiZhi {
  // 简化处理：返回两个地支中间的地支
  const index1 = getDiZhiIndex(zhi1);
  const index2 = getDiZhiIndex(zhi2);
  const middleIndex = Math.floor((index1 + index2) / 2) % 12;
  
  return getDiZhiByIndex(middleIndex);
}

/**
 * 判断地支五行相克关系
 */
export function isZhiKe(from: DiZhi, to: DiZhi): boolean {
  // 地支五行相克关系表
  const keRelations: Record<DiZhi, DiZhi[]> = {
    '子': ['午', '巳'], // 水克火
    '丑': ['卯', '寅'], // 土克木
    '寅': ['申', '酉'], // 木克土
    '卯': ['酉', '戌'], // 木克土
    '辰': ['子', '亥'], // 土克水
    '巳': ['亥', '子'], // 火克金
    '午': ['子', '亥'], // 火克水
    '未': ['丑', '辰'], // 土克水
    '申': ['寅', '卯'], // 金克木
    '酉': ['卯', '寅'], // 金克木
    '戌': ['辰', '丑'], // 土克水
    '亥': ['巳', '午']  // 水克火
  };
  
  return keRelations[from]?.includes(to) || false;
}

/**
 * 获取地支对应的五行
 */
function getZhiWuXing(zhi: DiZhi): '金' | '木' | '水' | '火' | '土' {
  const wuXingMap: Record<DiZhi, '金' | '木' | '水' | '火' | '土'> = {
    '子': '水', '亥': '水',
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '申': '金', '酉': '金',
    '丑': '土', '辰': '土', '未': '土', '戌': '土'
  };
  return wuXingMap[zhi];
}

/**
 * 判断五行相克关系
 */
function isWuXingKe(from: '金' | '木' | '水' | '火' | '土', to: '金' | '木' | '水' | '火' | '土'): boolean {
  const keRelations: Record<string, string[]> = {
    '金': ['木'],     // 金克木
    '木': ['土'],     // 木克土
    '水': ['火'],     // 水克火
    '火': ['金'],     // 火克金
    '土': ['水']      // 土克水
  };
  
  return keRelations[from]?.includes(to) || false;
}

/**
 * 找到被克的目标地支
 */
function findKeTarget(zhi: DiZhi): DiZhi {
  const wuXing = getZhiWuXing(zhi);
  
  // 根据五行相克关系找到被克的地支
  const targetWuXing = getKeTarget(wuXing);
  
  // 找到对应五行的地支（简化处理，取第一个）
  const zhiByWuXing: Record<string, DiZhi[]> = {
    '金': ['申', '酉'],
    '木': ['寅', '卯'],
    '水': ['子', '亥'],
    '火': ['巳', '午'],
    '土': ['丑', '辰', '未', '戌']
  };
  
  const candidates = zhiByWuXing[targetWuXing];
  return candidates ? candidates[0] : '子';
}

/**
 * 获取五行克制的目标
 */
function getKeTarget(wuXing: '金' | '木' | '水' | '火' | '土'): '金' | '木' | '水' | '火' | '土' {
  const keMap: Record<string, '金' | '木' | '水' | '火' | '土'> = {
    '金': '木',
    '木': '土',
    '水': '火',
    '火': '金',
    '土': '水'
  };
  
  return keMap[wuXing] || '木';
}

/**
 * 根据地支获取对应的神将
 */
function getShenByZhi(zhi: DiZhi, siKe: SiKe): ShenJiang {
  // 从四课中查找对应地支的神将
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  
  for (const ke of keArray) {
    if (ke.zhi === zhi) {
      return ke.shen;
    }
  }
  
  // 如果没找到，返回默认神将
  return '贵人';
}

/**
 * 计算课的强弱
 */
export function calculateKeStrength(ke: KeInfo): number {
  // 根据神将的吉凶和五行关系计算强弱
  let strength = 50; // 基础强度
  
  // 根据神将吉凶调整
  const auspiciousSpirits: ShenJiang[] = ['贵人', '六合', '青龙', '太常', '天后'];
  const inauspiciousSpirits: ShenJiang[] = ['腾蛇', '朱雀', '勾陈', '天空', '白虎', '玄武'];
  
  if (auspiciousSpirits.includes(ke.shen)) {
    strength += 20;
  } else if (inauspiciousSpirits.includes(ke.shen)) {
    strength -= 20;
  }
  
  return Math.max(0, Math.min(100, strength));
}

/**
 * 判断课式类型
 */
export function getKeShiType(siKe: SiKe): string {
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const uniqueKe = getUniqueKe(keArray);
  
  switch (uniqueKe.length) {
    case 4:
      return '四课无重';
    case 3:
      return '一重一空';
    case 2:
      return '二重二空';
    case 1:
      return '四重';
    default:
      return '未知课式';
  }
}

/**
 * 获取课的详细分析
 */
export function analyzeKe(ke: KeInfo): {
  wuXing: string;
  yinYang: string;
  strength: number;
  nature: string;
} {
  const wuXing = getZhiWuXing(ke.zhi);
  const strength = calculateKeStrength(ke);
  
  // 简化的阴阳判断
  const yangZhi: DiZhi[] = ['子', '寅', '辰', '午', '申', '戌'];
  const yinYang = yangZhi.includes(ke.zhi) ? '阳' : '阴';
  
  // 神将性质
  const auspiciousSpirits: ShenJiang[] = ['贵人', '六合', '青龙', '太常', '天后'];
  const nature = auspiciousSpirits.includes(ke.shen) ? '吉' : '凶';
  
  return {
    wuXing,
    yinYang,
    strength,
    nature
  };
}

/**
 * 完整的四课起法验证
 */
export function validateSiKe(siKe: SiKe): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 检查四课是否完整
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  
  for (let i = 0; i < keArray.length; i++) {
    const ke = keArray[i];
    if (!ke.gan || !ke.zhi || !ke.shen) {
      errors.push(`第${i + 1}课信息不完整`);
    }
    
    if (ke.position !== i + 1) {
      warnings.push(`第${i + 1}课位置标记不正确`);
    }
  }
  
  // 检查神将是否合理
  const shenSet = new Set(keArray.map(ke => ke.shen));
  if (shenSet.size < 2) {
    warnings.push('四课神将过于单一，可能存在计算错误');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 获取传统课式名称
 */
export function getTraditionalKeShiName(siKe: SiKe): string {
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const uniqueKe = getUniqueKe(keArray);
  
  // 根据重复情况和具体组合判断课式名称
  switch (uniqueKe.length) {
    case 4:
      return '四课无重（贼克法）';
    case 3:
      return '一重一空（涉害法）';
    case 2:
      return '二重二空（遥克法）';
    case 1:
      return '四重（昴星法）';
    default:
      return '未知课式';
  }
}

/**
 * 计算三传的连贯性
 */
export function analyzeSanChuanFlow(sanChuan: SanChuan): {
  flowType: '顺' | '逆' | '混合';
  strength: number;
  description: string;
} {
  const { chu, zhong, mo } = sanChuan;
  
  // 检查地支的顺序关系
  const chuIndex = getDiZhiIndex(chu.zhi);
  const zhongIndex = getDiZhiIndex(zhong.zhi);
  const moIndex = getDiZhiIndex(mo.zhi);
  
  const isSequential = (zhongIndex - chuIndex + 12) % 12 <= 6 && 
                      (moIndex - zhongIndex + 12) % 12 <= 6;
  
  const isReverse = (chuIndex - zhongIndex + 12) % 12 <= 6 && 
                   (zhongIndex - moIndex + 12) % 12 <= 6;
  
  let flowType: '顺' | '逆' | '混合';
  let strength = 50;
  let description = '';
  
  if (isSequential) {
    flowType = '顺';
    strength += 20;
    description = '三传顺行，事情发展顺利';
  } else if (isReverse) {
    flowType = '逆';
    strength -= 10;
    description = '三传逆行，事情可能有阻碍';
  } else {
    flowType = '混合';
    description = '三传混合，事情发展复杂多变';
  }
  
  return {
    flowType,
    strength: Math.max(0, Math.min(100, strength)),
    description
  };
}

/**
 * 获取完整的起课分析报告
 */
export function generateKeAnalysisReport(
  siKe: SiKe, 
  sanChuan: SanChuan
): {
  keShiType: string;
  keShiName: string;
  validation: ReturnType<typeof validateSiKe>;
  keAnalysis: Array<ReturnType<typeof analyzeKe>>;
  chuanFlow: ReturnType<typeof analyzeSanChuanFlow>;
  summary: string;
  recommendations: string[];
} {
  const keShiType = getKeShiType(siKe);
  const keShiName = getTraditionalKeShiName(siKe);
  const validation = validateSiKe(siKe);
  
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const keAnalysis = keArray.map(ke => analyzeKe(ke));
  
  const chuanFlow = analyzeSanChuanFlow(sanChuan);
  
  // 生成总结
  const auspiciousCount = keAnalysis.filter(analysis => analysis.nature === '吉').length;
  const overallNature = auspiciousCount >= 2 ? '偏吉' : '偏凶';
  
  const summary = `课式类型：${keShiName}，整体趋势：${overallNature}，${chuanFlow.description}`;
  
  // 生成建议
  const recommendations: string[] = [];
  
  if (auspiciousCount >= 3) {
    recommendations.push('吉神众多，宜积极行动');
  } else if (auspiciousCount <= 1) {
    recommendations.push('凶神较多，宜谨慎行事');
  }
  
  if (chuanFlow.flowType === '顺') {
    recommendations.push('三传顺行，可顺势而为');
  } else if (chuanFlow.flowType === '逆') {
    recommendations.push('三传逆行，需耐心等待时机');
  }
  
  if (validation.warnings.length > 0) {
    recommendations.push('起课过程中有异常，建议重新核对时间');
  }
  
  return {
    keShiType,
    keShiName,
    validation,
    keAnalysis,
    chuanFlow,
    summary,
    recommendations
  };
}
