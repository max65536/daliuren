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
 * 立四课 - 根据日干支立四课
 * 传统大六壬四课立法：
 * 第一课（干阳课）：以日干寄地盘之位，寻天盘地支
 * 第二课（干阴课）：以第一课天盘地支转到地盘，再推至天盘所得
 * 第三课（支阳课）：以日支所在地盘之位，寻天盘地支
 * 第四课（支阴课）：以第三课天盘地支转到地盘，再推至天盘所得
 */
export function calculateSiKe(
  dayGanZhi: GanZhi,
  hourGanZhi: GanZhi,
  hour: number,
  shenJiangPositions?: Record<DiZhi, ShenJiang>
): SiKe {
  const { gan: dayGan, zhi: dayZhi } = dayGanZhi;
  
  // 如果没有传入神将位置，则计算
  let positions = shenJiangPositions;
  if (!positions) {
    const isDay = isDayTime(hour);
    const guiRenPosition = getGuiRenPosition(dayGan, isDay);
    positions = calculateShenJiangPositions(guiRenPosition, true);
  }
  
  // 第一课（干阳课）：日干寄地盘之位，寻天盘地支
  const dayGanDiPanZhi = getGanCorrespondingZhi(dayGan); // 日干寄宫
  const firstTianPanZhi = getTianPanZhi(dayGanDiPanZhi, positions); // 天盘地支
  const first: KeInfo = {
    gan: dayGan,
    zhi: firstTianPanZhi,
    shen: positions[dayGanDiPanZhi], // 神将在地盘位置
    position: 1
  };
  
  // 第二课（干阴课）：第一课天盘地支转到地盘，再推至天盘所得
  const secondTianPanZhi = getTianPanZhi(firstTianPanZhi, positions);
  const second: KeInfo = {
    gan: dayGan,
    zhi: secondTianPanZhi,
    shen: positions[firstTianPanZhi], // 神将在地盘位置
    position: 2
  };
  
  // 第三课（支阳课）：日支所在地盘之位，寻天盘地支
  const thirdTianPanZhi = getTianPanZhi(dayZhi, positions);
  const third: KeInfo = {
    gan: dayGan,
    zhi: thirdTianPanZhi,
    shen: positions[dayZhi], // 神将在地盘位置
    position: 3
  };
  
  // 第四课（支阴课）：第三课天盘地支转到地盘，再推至天盘所得
  const fourthTianPanZhi = getTianPanZhi(thirdTianPanZhi, positions);
  const fourth: KeInfo = {
    gan: dayGan,
    zhi: fourthTianPanZhi,
    shen: positions[thirdTianPanZhi], // 神将在地盘位置
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
 * 获取天盘地支 - 根据地盘位置和神将位置计算天盘地支
 */
function getTianPanZhi(diPanZhi: DiZhi, shenJiangPositions: Record<DiZhi, ShenJiang>): DiZhi {
  // 在大六壬中，天盘是活动的，地盘是固定的
  // 天盘地支 = 地盘地支 + 贵人移动的偏移量
  // 这里简化处理，实际应该根据月将和贵人位置计算偏移
  
  // 找到贵人在哪个地支位置
  let guiRenDiPanPosition: DiZhi = '子';
  for (const [zhi, shen] of Object.entries(shenJiangPositions)) {
    if (shen === '贵人') {
      guiRenDiPanPosition = zhi as DiZhi;
      break;
    }
  }
  
  // 计算偏移量（贵人从子位移动到当前位置的偏移）
  const guiRenIndex = getDiZhiIndex(guiRenDiPanPosition);
  const ziIndex = getDiZhiIndex('子');
  const offset = (guiRenIndex - ziIndex + 12) % 12;
  
  // 天盘地支 = 地盘地支 + 偏移量
  const diPanIndex = getDiZhiIndex(diPanZhi);
  const tianPanIndex = (diPanIndex + offset) % 12;
  
  return getDiZhiByIndex(tianPanIndex);
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
 * 发三传 - 从四课中提取三传（九宗门法）
 */
export function calculateSanChuan(siKe: SiKe, dayGan: TianGan): SanChuan {
  // 首先检查是否为伏吟或反吟
  const fuYinResult = checkFuYin(siKe);
  if (fuYinResult) {
    return calculateFuYinSanChuan(siKe, fuYinResult);
  }
  
  const fanYinResult = checkFanYin(siKe);
  if (fanYinResult) {
    return calculateFanYinSanChuan(siKe, fanYinResult);
  }
  
  // 检查是否为八专课（日干支同位）
  const baZhuanResult = checkBaZhuan(siKe, dayGan);
  if (baZhuanResult) {
    return calculateBaZhuanSanChuan(siKe, dayGan);
  }
  
  // 检查四课中的克制关系
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const keRelations = analyzeKeRelations(keArray);
  
  // 1. 贼克法 - 有下贼上或上克下
  if (keRelations.xiaBeiShang.length > 0 || keRelations.shangKexia.length > 0) {
    return calculateZeiKeFa(siKe);
  }
  
  // 2. 遥克法 - 四课上下无克，看日干与四课的遥克关系
  const yaoKeResult = analyzeYaoKe(siKe, dayGan);
  if (yaoKeResult.hasYaoKe) {
    return calculateYaoKeFaNew(siKe, yaoKeResult);
  }
  
  // 3. 昴星法 - 四课俱全，上下无克，且无遥克
  const uniqueKe = getUniqueKe(keArray);
  if (uniqueKe.length === 4) {
    return calculateMaoXingFa(siKe, uniqueKe);
  }
  
  // 4. 别责法 - 四课缺一，只有三课
  if (uniqueKe.length === 3) {
    return calculateBieZeFa(siKe, uniqueKe);
  }
  
  // 默认使用贼克法
  return calculateZeiKeFa(siKe);
}

/**
 * 分析四课的克制关系
 */
function analyzeKeRelations(keArray: KeInfo[]): {
  xiaBeiShang: KeInfo[]; // 下贼上（地支克天盘）
  shangKexia: KeInfo[];  // 上克下（天盘克地支）
} {
  const xiaBeiShang: KeInfo[] = [];
  const shangKexia: KeInfo[] = [];
  
  for (const ke of keArray) {
    // 在四课中，ke.zhi是天盘地支，需要找到对应的地盘地支
    const diPanZhi = getDiPanZhiForKe(ke);
    
    // 检查下贼上（地盘克天盘）
    if (isWuXingKe(getZhiWuXing(diPanZhi), getZhiWuXing(ke.zhi))) {
      xiaBeiShang.push(ke);
    }
    
    // 检查上克下（天盘克地盘）
    if (isWuXingKe(getZhiWuXing(ke.zhi), getZhiWuXing(diPanZhi))) {
      shangKexia.push(ke);
    }
  }
  
  return { xiaBeiShang, shangKexia };
}

/**
 * 获取课对应的地盘地支
 */
function getDiPanZhiForKe(ke: KeInfo): DiZhi {
  // 根据课的位置确定地盘地支
  switch (ke.position) {
    case 1: // 一课：日干寄宫
      return getGanCorrespondingZhi(ke.gan);
    case 2: // 二课：第一课天盘地支
      // 这里需要从四课结构中推导，简化处理
      return ke.zhi;
    case 3: // 三课：日支
      // 需要从日支推导，简化处理
      return ke.zhi;
    case 4: // 四课：第三课天盘地支
      return ke.zhi;
    default:
      return ke.zhi;
  }
}

/**
 * 分析遥克关系
 */
function analyzeYaoKe(siKe: SiKe, dayGan: TianGan): {
  hasYaoKe: boolean;
  shangShenKeRiGan: KeInfo[];
  riGanKeShangShen: KeInfo[];
} {
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const shangShenKeRiGan: KeInfo[] = [];
  const riGanKeShangShen: KeInfo[] = [];
  
  const dayGanWuXing = getGanWuXing(dayGan);
  
  for (const ke of keArray) {
    const keWuXing = getZhiWuXing(ke.zhi);
    
    // 上神克日干
    if (isWuXingKe(keWuXing, dayGanWuXing)) {
      shangShenKeRiGan.push(ke);
    }
    
    // 日干克上神
    if (isWuXingKe(dayGanWuXing, keWuXing)) {
      riGanKeShangShen.push(ke);
    }
  }
  
  return {
    hasYaoKe: shangShenKeRiGan.length > 0 || riGanKeShangShen.length > 0,
    shangShenKeRiGan,
    riGanKeShangShen
  };
}

/**
 * 获取天干对应的五行
 */
function getGanWuXing(gan: TianGan): '金' | '木' | '水' | '火' | '土' {
  const ganWuXingMap: Record<TianGan, '金' | '木' | '水' | '火' | '土'> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  return ganWuXingMap[gan];
}

/**
 * 检查是否为八专课
 */
function checkBaZhuan(siKe: SiKe, dayGan: TianGan): { isBaZhuan: boolean; dayZhi: DiZhi } | null {
  // 八专日：甲寅、乙卯、丙午、丁未、戊戌、己亥、庚申、辛酉、壬子、癸丑
  const baZhuanPairs: Record<TianGan, DiZhi> = {
    '甲': '寅', '乙': '卯', '丙': '午', '丁': '未', '戊': '戌',
    '己': '亥', '庚': '申', '辛': '酉', '壬': '子', '癸': '丑'
  };
  
  const expectedZhi = baZhuanPairs[dayGan];
  if (expectedZhi && siKe.third.zhi === expectedZhi) {
    return { isBaZhuan: true, dayZhi: expectedZhi };
  }
  
  return null;
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
  // 首先检查是否为伏吟或反吟
  const specialType = getSpecialKeShiType(siKe);
  if (specialType) {
    return specialType;
  }
  
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

// ==================== 统一调用接口 ====================

/**
 * 四柱信息接口
 */
export interface SiZhu {
  year: GanZhi;   // 年柱
  month: GanZhi;  // 月柱
  day: GanZhi;    // 日柱
  hour: GanZhi;   // 时柱
}

/**
 * 大六壬起课统一接口
 * 输入四柱和月将，输出完整的天地盘、四课、三传字符串格式
 */
export function calculateDaLiuRenComplete(
  siZhu: SiZhu,
  yueJiang: DiZhi, // 月将（贵人位置）
  hour: number = 12 // 具体小时，用于判断昼夜贵人
): {
  tianDiPan: string;
  siKe: string;
  sanChuan: string;
  analysis: string;
  raw: {
    siKe: SiKe;
    sanChuan: SanChuan;
    shenJiangPositions: Record<DiZhi, ShenJiang>;
  };
} {
  const { day, hour: hourGanZhi } = siZhu;
  
  // 计算神将位置（使用传入的月将作为贵人位置）
  const shenJiangPositions = calculateShenJiangPositions(yueJiang, true);
  
  // 计算四课
  const siKe = calculateSiKe(day, hourGanZhi, hour);
  
  // 计算三传
  const sanChuan = calculateSanChuan(siKe, day.gan);
  
  // 生成字符串格式输出
  const tianDiPan = formatTianDiPan(siZhu, shenJiangPositions);
  const siKeStr = formatSiKe(siKe);
  const sanChuanStr = formatSanChuan(sanChuan);
  const analysis = formatAnalysis(siKe, sanChuan);
  
  return {
    tianDiPan,
    siKe: siKeStr,
    sanChuan: sanChuanStr,
    analysis,
    raw: {
      siKe,
      sanChuan,
      shenJiangPositions
    }
  };
}

/**
 * 格式化天地盘为字符串
 */
function formatTianDiPan(siZhu: SiZhu, shenJiangPositions: Record<DiZhi, ShenJiang>): string {
  const { year, month, day, hour } = siZhu;
  
  let result = '=== 大六壬天地盘 ===\n\n';
  
  // 四柱信息
  result += '【四柱】\n';
  result += `年柱：${year.gan}${year.zhi}  月柱：${month.gan}${month.zhi}  日柱：${day.gan}${day.zhi}  时柱：${hour.gan}${hour.zhi}\n\n`;
  
  // 天盘（固定天干）
  result += '【天盘】\n';
  const tianGanOrder = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as TianGan[];
  const dayGanIndex = tianGanOrder.indexOf(day.gan);
  
  result += '    巳  午  未\n';
  result += '辰            申\n';
  result += '卯            酉\n';
  result += '    寅  丑  子  戌\n\n';
  
  // 地盘（十二地支固定位置）
  result += '【地盘】\n';
  result += '    巳  午  未\n';
  result += '辰            申\n';
  result += '卯            酉\n';
  result += '    寅  丑  子  戌\n\n';
  
  // 神盘（十二神将）
  result += '【神盘】\n';
  const zhiOrder: DiZhi[] = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];
  
  // 上排：巳午未
  result += '  ';
  for (const zhi of ['巳', '午', '未'] as DiZhi[]) {
    const shen = shenJiangPositions[zhi];
    result += `${shen.slice(0, 2).padEnd(4)}`;
  }
  result += '\n';
  
  // 中排：辰和申
  const chenShen = shenJiangPositions['辰'];
  const shenShen = shenJiangPositions['申'];
  result += `${chenShen.slice(0, 2).padEnd(6)}        ${shenShen.slice(0, 2)}\n`;
  
  // 中排：卯和酉
  const maoShen = shenJiangPositions['卯'];
  const youShen = shenJiangPositions['酉'];
  result += `${maoShen.slice(0, 2).padEnd(6)}        ${youShen.slice(0, 2)}\n`;
  
  // 下排：寅丑子戌
  result += '  ';
  for (const zhi of ['寅', '丑', '子', '戌'] as DiZhi[]) {
    const shen = shenJiangPositions[zhi];
    result += `${shen.slice(0, 2).padEnd(4)}`;
  }
  result += '\n\n';
  
  return result;
}

/**
 * 格式化四课为字符串
 */
function formatSiKe(siKe: SiKe): string {
  let result = '=== 四课 ===\n\n';
  
  const keArray = [
    { name: '一课', ke: siKe.first },
    { name: '二课', ke: siKe.second },
    { name: '三课', ke: siKe.third },
    { name: '四课', ke: siKe.fourth }
  ];
  
  for (const { name, ke } of keArray) {
    result += `${name}：${ke.gan}${ke.zhi} - ${ke.shen}\n`;
  }
  
  result += `\n课式：${getTraditionalKeShiName(siKe)}\n\n`;
  
  return result;
}

/**
 * 格式化三传为字符串
 */
function formatSanChuan(sanChuan: SanChuan): string {
  let result = '=== 三传 ===\n\n';
  
  result += `初传：${sanChuan.chu.zhi} - ${sanChuan.chu.shen}\n`;
  result += `中传：${sanChuan.zhong.zhi} - ${sanChuan.zhong.shen}\n`;
  result += `末传：${sanChuan.mo.zhi} - ${sanChuan.mo.shen}\n\n`;
  
  result += '【传意】\n';
  result += `初传：${sanChuan.chu.meaning}\n`;
  result += `中传：${sanChuan.zhong.meaning}\n`;
  result += `末传：${sanChuan.mo.meaning}\n\n`;
  
  return result;
}

/**
 * 格式化分析为字符串
 */
function formatAnalysis(siKe: SiKe, sanChuan: SanChuan): string {
  const report = generateKeAnalysisReport(siKe, sanChuan);
  const fuYinFanYinAnalysis = analyzeFuYinFanYin(siKe);
  
  let result = '=== 分析解读 ===\n\n';
  
  result += `【总体判断】\n${report.summary}\n\n`;
  
  // 伏吟反吟特殊分析
  if (fuYinFanYinAnalysis.isSpecial) {
    result += `【特殊课式】\n`;
    result += `课式类型：${fuYinFanYinAnalysis.type}\n`;
    result += `${fuYinFanYinAnalysis.description}\n\n`;
    
    result += '【特殊含义】\n';
    fuYinFanYinAnalysis.implications.forEach(implication => {
      result += `• ${implication}\n`;
    });
    result += '\n';
    
    result += '【特殊建议】\n';
    fuYinFanYinAnalysis.suggestions.forEach(suggestion => {
      result += `• ${suggestion}\n`;
    });
    result += '\n';
  }
  
  result += '【四课分析】\n';
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  keArray.forEach((ke, index) => {
    const analysis = report.keAnalysis[index];
    result += `${['一', '二', '三', '四'][index]}课：${ke.shen}(${analysis.wuXing}${analysis.yinYang}) - ${analysis.nature === '吉' ? '吉神' : '凶神'}\n`;
  });
  
  result += `\n【三传流向】\n${report.chuanFlow.description}\n\n`;
  
  if (report.recommendations.length > 0) {
    result += '【建议】\n';
    report.recommendations.forEach(rec => {
      result += `• ${rec}\n`;
    });
    result += '\n';
  }
  
  if (report.validation.warnings.length > 0) {
    result += '【注意】\n';
    report.validation.warnings.forEach(warning => {
      result += `• ${warning}\n`;
    });
    result += '\n';
  }
  
  return result;
}

/**
 * 简化版调用接口 - 只需要日柱、时柱和月将
 */
export function quickCalculate(
  dayGanZhi: GanZhi,
  hourGanZhi: GanZhi,
  yueJiang: DiZhi,
  hour: number = 12
): string {
  // 构造简化的四柱（年月柱使用日柱代替）
  const siZhu: SiZhu = {
    year: dayGanZhi,
    month: dayGanZhi,
    day: dayGanZhi,
    hour: hourGanZhi
  };
  
  const result = calculateDaLiuRenComplete(siZhu, yueJiang, hour);
  
  return `${result.tianDiPan}${result.siKe}${result.sanChuan}${result.analysis}`;
}

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
  const ganIndex = TIAN_GAN.indexOf(gan);
  const zhiIndex = DI_ZHI.indexOf(zhi);
  
  let index = 1;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === ganIndex && i % 12 === zhiIndex) {
      index = i + 1;
      break;
    }
  }
  
  return { gan, zhi, index };
}

/**
 * 便捷调用接口 - 使用字符串参数
 */
export function calculateFromStrings(
  dayGanZhi: string,
  hourGanZhi: string,
  yueJiang: string,
  hour: number = 12
): string {
  try {
    const day = parseGanZhi(dayGanZhi);
    const hourGZ = parseGanZhi(hourGanZhi);
    const yueJiangZhi = yueJiang as DiZhi;
    
    if (!DI_ZHI.includes(yueJiangZhi)) {
      throw new Error(`无效的月将：${yueJiang}`);
    }
    
    return quickCalculate(day, hourGZ, yueJiangZhi, hour);
  } catch (error) {
    return `错误：${error instanceof Error ? error.message : '未知错误'}`;
  }
}

// ==================== 伏吟反吟算法 ====================

/**
 * 伏吟结果类型
 */
interface FuYinResult {
  type: '伏吟';
  description: string;
  baseZhi: DiZhi;
}

/**
 * 反吟结果类型
 */
interface FanYinResult {
  type: '反吟';
  description: string;
  baseZhi: DiZhi;
  oppositeZhi: DiZhi;
}

/**
 * 检查是否为伏吟
 * 伏吟：四课中有相同的地支和神将组合
 */
function checkFuYin(siKe: SiKe): FuYinResult | null {
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  
  // 检查是否有完全相同的课（地支和神将都相同）
  for (let i = 0; i < keArray.length; i++) {
    for (let j = i + 1; j < keArray.length; j++) {
      const ke1 = keArray[i];
      const ke2 = keArray[j];
      
      if (ke1.zhi === ke2.zhi && ke1.shen === ke2.shen) {
        return {
          type: '伏吟',
          description: `${ke1.zhi}位上${ke1.shen}重复出现，形成伏吟`,
          baseZhi: ke1.zhi
        };
      }
    }
  }
  
  // 检查日支和时支是否相同（另一种伏吟情况）
  if (siKe.second.zhi === siKe.fourth.zhi) {
    return {
      type: '伏吟',
      description: `日支${siKe.second.zhi}与时支${siKe.fourth.zhi}相同，形成伏吟`,
      baseZhi: siKe.second.zhi
    };
  }
  
  return null;
}

/**
 * 检查是否为反吟
 * 反吟：四课中有相冲的地支组合
 */
function checkFanYin(siKe: SiKe): FanYinResult | null {
  const keArray = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  
  // 地支相冲关系
  const chongRelations: Record<DiZhi, DiZhi> = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉',
    '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
    '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
  };
  
  // 检查四课中是否有相冲的地支
  for (let i = 0; i < keArray.length; i++) {
    for (let j = i + 1; j < keArray.length; j++) {
      const ke1 = keArray[i];
      const ke2 = keArray[j];
      
      if (chongRelations[ke1.zhi] === ke2.zhi) {
        return {
          type: '反吟',
          description: `${ke1.zhi}与${ke2.zhi}相冲，形成反吟`,
          baseZhi: ke1.zhi,
          oppositeZhi: ke2.zhi
        };
      }
    }
  }
  
  // 检查日支和时支是否相冲
  if (chongRelations[siKe.second.zhi] === siKe.fourth.zhi) {
    return {
      type: '反吟',
      description: `日支${siKe.second.zhi}与时支${siKe.fourth.zhi}相冲，形成反吟`,
      baseZhi: siKe.second.zhi,
      oppositeZhi: siKe.fourth.zhi
    };
  }
  
  return null;
}

/**
 * 计算伏吟三传
 * 伏吟时的三传计算方法
 */
function calculateFuYinSanChuan(siKe: SiKe, fuYinResult: FuYinResult): SanChuan {
  const { baseZhi } = fuYinResult;
  
  // 伏吟三传：以伏吟的地支为初传，顺行三位
  const baseIndex = getDiZhiIndex(baseZhi);
  
  const chuZhi = baseZhi;
  const zhongZhi = getDiZhiByIndex((baseIndex + 1) % 12);
  const moZhi = getDiZhiByIndex((baseIndex + 2) % 12);
  
  // 从四课中找对应的神将，如果找不到则使用默认神将
  const chuShen = getShenByZhi(chuZhi, siKe);
  const zhongShen = getShenByZhi(zhongZhi, siKe);
  const moShen = getShenByZhi(moZhi, siKe);
  
  return {
    chu: {
      zhi: chuZhi,
      shen: chuShen,
      meaning: `伏吟初传：${getChuanMeaning(chuShen)}，事情停滞不前`
    },
    zhong: {
      zhi: zhongZhi,
      shen: zhongShen,
      meaning: `伏吟中传：${getChuanMeaning(zhongShen)}，需要耐心等待`
    },
    mo: {
      zhi: moZhi,
      shen: moShen,
      meaning: `伏吟末传：${getChuanMeaning(moShen)}，最终会有转机`
    }
  };
}

/**
 * 计算反吟三传
 * 反吟时的三传计算方法
 */
function calculateFanYinSanChuan(siKe: SiKe, fanYinResult: FanYinResult): SanChuan {
  const { baseZhi, oppositeZhi } = fanYinResult;
  
  // 反吟三传：以相冲的两个地支为初传和中传，再找第三传
  const baseIndex = getDiZhiIndex(baseZhi);
  const oppositeIndex = getDiZhiIndex(oppositeZhi);
  
  // 第三传通常是两个相冲地支的中间位置
  const moIndex = (baseIndex + 6) % 12; // 相冲地支相差6位
  const moZhi = getDiZhiByIndex(moIndex);
  
  const chuShen = getShenByZhi(baseZhi, siKe);
  const zhongShen = getShenByZhi(oppositeZhi, siKe);
  const moShen = getShenByZhi(moZhi, siKe);
  
  return {
    chu: {
      zhi: baseZhi,
      shen: chuShen,
      meaning: `反吟初传：${getChuanMeaning(chuShen)}，事情变化激烈`
    },
    zhong: {
      zhi: oppositeZhi,
      shen: zhongShen,
      meaning: `反吟中传：${getChuanMeaning(zhongShen)}，冲突对立明显`
    },
    mo: {
      zhi: moZhi,
      shen: moShen,
      meaning: `反吟末传：${getChuanMeaning(moShen)}，需要调和化解`
    }
  };
}

/**
 * 判断是否为伏吟或反吟课式
 */
export function getSpecialKeShiType(siKe: SiKe): string | null {
  const fuYinResult = checkFuYin(siKe);
  if (fuYinResult) {
    return `伏吟（${fuYinResult.description}）`;
  }
  
  const fanYinResult = checkFanYin(siKe);
  if (fanYinResult) {
    return `反吟（${fanYinResult.description}）`;
  }
  
  return null;
}

/**
 * 获取伏吟反吟的详细分析
 */
export function analyzeFuYinFanYin(siKe: SiKe): {
  isSpecial: boolean;
  type: '伏吟' | '反吟' | null;
  description: string;
  implications: string[];
  suggestions: string[];
} {
  const fuYinResult = checkFuYin(siKe);
  if (fuYinResult) {
    return {
      isSpecial: true,
      type: '伏吟',
      description: fuYinResult.description,
      implications: [
        '事情发展缓慢，容易停滞不前',
        '重复性强，可能会遇到相似的情况',
        '需要耐心等待，不宜急躁行事',
        '适合巩固现状，不宜大的变动'
      ],
      suggestions: [
        '保持耐心，等待时机成熟',
        '专注于完善细节，提升质量',
        '避免重复性的错误',
        '可以考虑从不同角度重新审视问题'
      ]
    };
  }
  
  const fanYinResult = checkFanYin(siKe);
  if (fanYinResult) {
    return {
      isSpecial: true,
      type: '反吟',
      description: fanYinResult.description,
      implications: [
        '事情变化激烈，容易出现反复',
        '可能面临冲突和对立',
        '需要灵活应对，随机应变',
        '变化中蕴含机遇，也存在风险'
      ],
      suggestions: [
        '保持冷静，避免冲动行事',
        '寻求调和的方法，化解冲突',
        '准备多个备选方案',
        '关注变化中的机会'
      ]
    };
  }
  
  return {
    isSpecial: false,
    type: null,
    description: '普通课式，无伏吟反吟',
    implications: [],
    suggestions: []
  };
}

// ==================== 缺失的函数实现 ====================

/**
 * 计算八专三传
 */
function calculateBaZhuanSanChuan(siKe: SiKe, dayGan: TianGan): SanChuan {
  // 八专课的三传计算
  const isYangGan = ['甲', '丙', '戊', '庚', '壬'].includes(dayGan);
  
  if (isYangGan) {
    // 阳日以干上神顺数三位为初传
    const ganShangShen = siKe.first.zhi;
    const ganShangShenIndex = getDiZhiIndex(ganShangShen);
    
    const chuZhi = getDiZhiByIndex((ganShangShenIndex + 2) % 12); // 顺数三位
    const zhongZhi = siKe.first.zhi; // 干上神为中传
    const moZhi = siKe.first.zhi; // 干上神为末传
    
    return {
      chu: {
        zhi: chuZhi,
        shen: getShenByZhi(chuZhi, siKe),
        meaning: '八专初传'
      },
      zhong: {
        zhi: zhongZhi,
        shen: siKe.first.shen,
        meaning: '八专中传'
      },
      mo: {
        zhi: moZhi,
        shen: siKe.first.shen,
        meaning: '八专末传'
      }
    };
  } else {
    // 阴日以第四课的上神逆数三位为初传
    const zhiShangShen = siKe.fourth.zhi;
    const zhiShangShenIndex = getDiZhiIndex(zhiShangShen);
    
    const chuZhi = getDiZhiByIndex((zhiShangShenIndex - 2 + 12) % 12); // 逆数三位
    const zhongZhi = siKe.first.zhi; // 干上神为中传
    const moZhi = siKe.first.zhi; // 干上神为末传
    
    return {
      chu: {
        zhi: chuZhi,
        shen: getShenByZhi(chuZhi, siKe),
        meaning: '八专初传'
      },
      zhong: {
        zhi: zhongZhi,
        shen: siKe.first.shen,
        meaning: '八专中传'
      },
      mo: {
        zhi: moZhi,
        shen: siKe.first.shen,
        meaning: '八专末传'
      }
    };
  }
}

/**
 * 新的遥克法实现
 */
function calculateYaoKeFaNew(siKe: SiKe, yaoKeResult: ReturnType<typeof analyzeYaoKe>): SanChuan {
  // 优先选择上神克日干的课
  if (yaoKeResult.shangShenKeRiGan.length > 0) {
    const chu = createChuanInfo(yaoKeResult.shangShenKeRiGan[0]);
    
    // 中传和末传按传统方法计算
    const zhongZhi = getNextZhi(chu.zhi);
    const moZhi = getNextZhi(zhongZhi);
    
    return {
      chu,
      zhong: {
        zhi: zhongZhi,
        shen: getShenByZhi(zhongZhi, siKe),
        meaning: '遥克中传'
      },
      mo: {
        zhi: moZhi,
        shen: getShenByZhi(moZhi, siKe),
        meaning: '遥克末传'
      }
    };
  }
  
  // 其次选择日干克上神的课
  if (yaoKeResult.riGanKeShangShen.length > 0) {
    const chu = createChuanInfo(yaoKeResult.riGanKeShangShen[0]);
    
    const zhongZhi = getNextZhi(chu.zhi);
    const moZhi = getNextZhi(zhongZhi);
    
    return {
      chu,
      zhong: {
        zhi: zhongZhi,
        shen: getShenByZhi(zhongZhi, siKe),
        meaning: '遥克中传'
      },
      mo: {
        zhi: moZhi,
        shen: getShenByZhi(moZhi, siKe),
        meaning: '遥克末传'
      }
    };
  }
  
  // 默认情况
  return calculateZeiKeFa(siKe);
}

/**
 * 别责法实现
 */
function calculateBieZeFa(siKe: SiKe, uniqueKe: KeInfo[]): SanChuan {
  // 别责法：四课缺一，只有三课时使用
  const chu = createChuanInfo(uniqueKe[0]);
  const zhong = createChuanInfo(uniqueKe[1]);
  const mo = createChuanInfo(uniqueKe[2]);
  
  return { chu, zhong, mo };
}
