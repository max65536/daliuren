/**
 * 大六壬占卜相关类型定义
 * Da Liu Ren Divination Type Definitions
 */

// 天干 (Heavenly Stems)
export type TianGan = 
  | '甲' | '乙' | '丙' | '丁' | '戊' 
  | '己' | '庚' | '辛' | '壬' | '癸';

// 地支 (Earthly Branches)
export type DiZhi = 
  | '子' | '丑' | '寅' | '卯' | '辰' | '巳'
  | '午' | '未' | '申' | '酉' | '戌' | '亥';

// 干支组合 (Stem-Branch Combination)
export interface GanZhi {
  gan: TianGan;
  zhi: DiZhi;
  index: number; // 1-60 (六十甲子)
}

// 十二神将 (Twelve Spirits/Deities)
export type ShenJiang = 
  | '贵人' | '腾蛇' | '朱雀' | '六合' | '勾陈' | '青龙'
  | '天空' | '白虎' | '太常' | '玄武' | '太阴' | '天后';

// 神将信息
export interface ShenJiangInfo {
  name: ShenJiang;
  position: DiZhi; // 当前所在地支位置
  attributes: {
    element: '金' | '木' | '水' | '火' | '土'; // 五行属性
    nature: '吉' | '凶' | '中'; // 吉凶性质
    direction: '东' | '南' | '西' | '北' | '中'; // 方位
  };
}

// 四课 (Four Lessons)
export interface SiKe {
  first: KeInfo;   // 一课
  second: KeInfo;  // 二课
  third: KeInfo;   // 三课
  fourth: KeInfo;  // 四课
}

// 课信息
export interface KeInfo {
  gan: TianGan;    // 天干
  zhi: DiZhi;      // 地支
  shen: ShenJiang; // 神将
  position: number; // 位置 (1-12)
}

// 三传 (Three Transmissions)
export interface SanChuan {
  chu: ChuanInfo;  // 初传
  zhong: ChuanInfo; // 中传
  mo: ChuanInfo;   // 末传
}

// 传信息
export interface ChuanInfo {
  zhi: DiZhi;
  shen: ShenJiang;
  meaning: string; // 含义解释
}

// 天盘 (Heaven Plate)
export interface TianPan {
  positions: Record<DiZhi, TianGan>; // 十二地支位置对应的天干
}

// 地盘 (Earth Plate)
export interface DiPan {
  positions: Record<DiZhi, DiZhi>; // 地支的当前排列
  rotation: number; // 旋转角度
}

// 人盘 (Human Plate) - 四课
export interface RenPan {
  siKe: SiKe;
  sanChuan: SanChuan;
}

// 神盘 (Spirit Plate)
export interface ShenPan {
  spirits: Record<DiZhi, ShenJiangInfo>; // 十二地支位置对应的神将
  guiRenPosition: DiZhi; // 贵人位置
}

// 完整的大六壬盘面
export interface DaLiuRenPan {
  tianPan: TianPan;
  diPan: DiPan;
  renPan: RenPan;
  shenPan: ShenPan;
  metadata: {
    date: Date;
    ganZhi: {
      year: GanZhi;
      month: GanZhi;
      day: GanZhi;
      hour: GanZhi;
    };
    solarTerm: string; // 节气
    lunarDate: string; // 农历日期
  };
}

// 占卜结果
export interface DivinationResult {
  pan: DaLiuRenPan;
  interpretation: {
    general: string;      // 总体解释
    detailed: string[];   // 详细分析
    suggestions: string[]; // 建议
    warnings: string[];   // 注意事项
  };
  confidence: number; // 可信度 (0-1)
}

// 占卜请求参数
export interface DivinationRequest {
  datetime: Date;
  question?: string; // 占问内容
  category?: '事业' | '财运' | '感情' | '健康' | '学业' | '其他';
}

// 历史记录
export interface DivinationHistory {
  id: string;
  timestamp: Date;
  request: DivinationRequest;
  result: DivinationResult;
  notes?: string; // 用户备注
}
