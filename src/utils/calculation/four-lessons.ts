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
 */
export function calculateSiKe(
  dayGanZhi: GanZhi,
  hourGanZhi: GanZhi,
  hour: number
): SiKe {
  const { gan: dayGan, zhi: dayZhi } = dayGanZhi;
  const { zhi: hourZhi } = hourGanZhi;
  
  // 获取贵人位置
  const isDay = isDayTime(hour);
  const guiRenPosition = getGuiRenPosition(dayGan, isDay);
  
  // 计算神将位置
  const shenJiangPositions = calculateShenJiangPositions(guiRenPosition, true);
  
  // 一课：日上神
  const first = calculateKeInfo(dayGan, dayZhi, shenJiangPositions, 1);
  
  // 二课：辰上神 (日支上神)
  const second = calculateKeInfo(dayGan, dayZhi, shenJiangPositions, 2);
  
  // 三课：时上神
  const third = calculateKeInfo(hourGanZhi.gan, hourZhi, shenJiangPositions, 3);
  
  // 四课：时支上神
  const fourth = calculateKeInfo(hourGanZhi.gan, hourZhi, shenJiangPositions, 4);
  
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
 */
function calculateZeiKeFa(siKe: SiKe): SanChuan {
  // 找出相克关系最强的三个课作为三传
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  
  // 简化处理：按顺序取前三个作为三传
  const chu = createChuanInfo(keArray[0]);
  const zhong = createChuanInfo(keArray[1]);
  const mo = createChuanInfo(keArray[2]);
  
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
