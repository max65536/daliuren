/**
 * 传统中国色彩常量定义
 * Traditional Chinese Colors Constants
 */

// 传统中国色彩调色板
export const TRADITIONAL_COLORS = {
  // 主色调 - 朱红系
  primary: {
    zhuHong: '#DC143C',      // 朱红
    yanZhiHong: '#C93756',   // 胭脂红
    yinHong: '#F05654',      // 银红
    tuoHong: '#EEA2A4',     // 妥红
    fenHong: '#FFB3BA'       // 粉红
  },
  
  // 次色调 - 墨黑系
  secondary: {
    moHei: '#2F2F2F',        // 墨黑
    xuanHei: '#0C0C0C',      // 玄黑
    tanHei: '#1C1C1C',       // 炭黑
    wuHei: '#000000',        // 乌黑
    huiHei: '#36454F'        // 灰黑
  },
  
  // 强调色 - 金黄系
  accent: {
    jinHuang: '#FFD700',     // 金黄
    tuHuang: '#FFA500',      // 土黄
    eHuang: '#FFFF00',       // 鹅黄
    xiongHuang: '#FFC649',   // 雄黄
    liuHuang: '#CCCC00'      // 硫黄
  },
  
  // 青色系
  cyan: {
    qing: '#20B2AA',         // 青
    biLv: '#1BA784',         // 碧绿
    cuiLv: '#00A86B',        // 翠绿
    songLv: '#057748',       // 松绿
    zhuLv: '#00A693'         // 竹绿
  },
  
  // 蓝色系
  blue: {
    tianLan: '#4169E1',      // 天蓝
    shenLan: '#003472',      // 深蓝
    qunQing: '#465298',      // 群青
    dianLan: '#003371',      // 靛蓝
    baoLan: '#4B0082'        // 宝蓝
  },
  
  // 紫色系
  purple: {
    zi: '#8B00FF',           // 紫
    qianZi: '#8B008B',       // 茜紫
    jiangZi: '#8B0000',      // 绛紫
    daiZi: '#574266',        // 黛紫
    xuanZi: '#622A1D'        // 玄紫
  },
  
  // 白色系
  white: {
    bai: '#FFFFFF',          // 白
    xiangYa: '#FFFBF0',      // 象牙
    ruBai: '#F7F7F7',        // 乳白
    yinBai: '#E6E6FA',       // 银白
    shuangBai: '#F0F8FF'     // 霜白
  },
  
  // 灰色系
  gray: {
    hui: '#808080',          // 灰
    yinHui: '#C0C0C0',       // 银灰
    yanHui: '#696969',       // 烟灰
    cangHui: '#2F4F4F',      // 苍灰
    wuHui: '#708090'         // 雾灰
  },
  
  // 棕色系
  brown: {
    zong: '#8B4513',         // 棕
    heZong: '#654321',       // 赫棕
    liZong: '#D2691E',       // 栗棕
    tuZong: '#A0522D',       // 土棕
    kaZong: '#8B7355'        // 咖棕
  }
} as const;

// 五行对应色彩
export const WU_XING_COLORS = {
  '金': {
    primary: TRADITIONAL_COLORS.white.bai,
    secondary: TRADITIONAL_COLORS.gray.yinHui,
    accent: TRADITIONAL_COLORS.accent.jinHuang
  },
  '木': {
    primary: TRADITIONAL_COLORS.cyan.qing,
    secondary: TRADITIONAL_COLORS.cyan.cuiLv,
    accent: TRADITIONAL_COLORS.cyan.songLv
  },
  '水': {
    primary: TRADITIONAL_COLORS.blue.tianLan,
    secondary: TRADITIONAL_COLORS.blue.shenLan,
    accent: TRADITIONAL_COLORS.blue.qunQing
  },
  '火': {
    primary: TRADITIONAL_COLORS.primary.zhuHong,
    secondary: TRADITIONAL_COLORS.primary.yanZhiHong,
    accent: TRADITIONAL_COLORS.primary.yinHong
  },
  '土': {
    primary: TRADITIONAL_COLORS.accent.tuHuang,
    secondary: TRADITIONAL_COLORS.brown.zong,
    accent: TRADITIONAL_COLORS.brown.tuZong
  }
} as const;

// 季节对应色彩
export const SEASON_COLORS = {
  '春': {
    primary: TRADITIONAL_COLORS.cyan.qing,
    background: '#F0FFF0',
    text: TRADITIONAL_COLORS.secondary.moHei
  },
  '夏': {
    primary: TRADITIONAL_COLORS.primary.zhuHong,
    background: '#FFF8DC',
    text: TRADITIONAL_COLORS.secondary.moHei
  },
  '秋': {
    primary: TRADITIONAL_COLORS.accent.jinHuang,
    background: '#FDF5E6',
    text: TRADITIONAL_COLORS.secondary.moHei
  },
  '冬': {
    primary: TRADITIONAL_COLORS.blue.shenLan,
    background: '#F8F8FF',
    text: TRADITIONAL_COLORS.secondary.moHei
  }
} as const;

// 方位对应色彩
export const DIRECTION_COLORS = {
  '东': WU_XING_COLORS['木'],
  '南': WU_XING_COLORS['火'],
  '西': WU_XING_COLORS['金'],
  '北': WU_XING_COLORS['水'],
  '中': WU_XING_COLORS['土']
} as const;

// 阴阳对应色彩
export const YIN_YANG_COLORS = {
  '阳': {
    primary: TRADITIONAL_COLORS.white.bai,
    secondary: TRADITIONAL_COLORS.accent.jinHuang,
    background: '#FFFEF7'
  },
  '阴': {
    primary: TRADITIONAL_COLORS.secondary.moHei,
    secondary: TRADITIONAL_COLORS.gray.hui,
    background: '#F5F5F5'
  }
} as const;

// 应用主题色彩
export const APP_THEME = {
  // 主要颜色
  primary: TRADITIONAL_COLORS.primary.zhuHong,
  secondary: TRADITIONAL_COLORS.secondary.moHei,
  accent: TRADITIONAL_COLORS.accent.jinHuang,
  
  // 背景色
  background: {
    primary: '#FFFEF7',      // 主背景 - 米白
    secondary: '#F8F8F8',    // 次背景 - 浅灰
    surface: '#FFFFFF',      // 表面 - 纯白
    overlay: 'rgba(47, 47, 47, 0.8)' // 遮罩 - 半透明黑
  },
  
  // 文字颜色
  text: {
    primary: TRADITIONAL_COLORS.secondary.moHei,
    secondary: TRADITIONAL_COLORS.gray.hui,
    accent: TRADITIONAL_COLORS.primary.zhuHong,
    inverse: TRADITIONAL_COLORS.white.bai,
    disabled: TRADITIONAL_COLORS.gray.wuHui
  },
  
  // 边框颜色
  border: {
    primary: TRADITIONAL_COLORS.gray.hui,
    secondary: TRADITIONAL_COLORS.gray.yinHui,
    accent: TRADITIONAL_COLORS.primary.zhuHong,
    focus: TRADITIONAL_COLORS.accent.jinHuang
  },
  
  // 状态颜色
  status: {
    success: TRADITIONAL_COLORS.cyan.qing,
    warning: TRADITIONAL_COLORS.accent.tuHuang,
    error: TRADITIONAL_COLORS.primary.zhuHong,
    info: TRADITIONAL_COLORS.blue.tianLan
  },
  
  // 阴影颜色
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    heavy: 'rgba(0, 0, 0, 0.3)'
  }
} as const;

// 盘面专用色彩
export const PLATE_COLORS = {
  // 天盘色彩
  tianPan: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: TRADITIONAL_COLORS.accent.jinHuang,
    text: TRADITIONAL_COLORS.secondary.moHei
  },
  
  // 地盘色彩
  diPan: {
    background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    border: TRADITIONAL_COLORS.brown.zong,
    text: TRADITIONAL_COLORS.white.bai
  },
  
  // 人盘色彩
  renPan: {
    background: 'linear-gradient(135deg, #DC143C 0%, #B22222 100%)',
    border: TRADITIONAL_COLORS.primary.zhuHong,
    text: TRADITIONAL_COLORS.white.bai
  },
  
  // 神盘色彩
  shenPan: {
    background: 'linear-gradient(135deg, #20B2AA 0%, #008B8B 100%)',
    border: TRADITIONAL_COLORS.cyan.qing,
    text: TRADITIONAL_COLORS.white.bai
  }
} as const;

// 工具函数

/**
 * 根据五行获取对应色彩
 */
export function getWuXingColor(element: '金' | '木' | '水' | '火' | '土'): {
  primary: string;
  secondary: string;
  accent: string;
} {
  return WU_XING_COLORS[element];
}

/**
 * 根据季节获取对应色彩
 */
export function getSeasonColor(season: '春' | '夏' | '秋' | '冬'): {
  primary: string;
  background: string;
  text: string;
} {
  return SEASON_COLORS[season];
}

/**
 * 根据方位获取对应色彩
 */
export function getDirectionColor(direction: '东' | '南' | '西' | '北' | '中'): {
  primary: string;
  secondary: string;
  accent: string;
} {
  return DIRECTION_COLORS[direction];
}

/**
 * 根据阴阳获取对应色彩
 */
export function getYinYangColor(yinYang: '阴' | '阳'): {
  primary: string;
  secondary: string;
  background: string;
} {
  return YIN_YANG_COLORS[yinYang];
}

/**
 * 生成渐变色
 */
export function createGradient(
  color1: string,
  color2: string,
  direction: number = 135
): string {
  return `linear-gradient(${direction}deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * 调整颜色透明度
 */
export function adjustOpacity(color: string, opacity: number): string {
  // 简单的透明度调整，实际项目中可能需要更复杂的颜色处理
  if (color.startsWith('#')) {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return color + alpha;
  }
  return color;
}

/**
 * 获取对比色
 */
export function getContrastColor(backgroundColor: string): string {
  // 简化的对比色计算，实际项目中需要更精确的算法
  const darkColors: string[] = [
    TRADITIONAL_COLORS.secondary.moHei,
    TRADITIONAL_COLORS.blue.shenLan,
    TRADITIONAL_COLORS.purple.zi
  ];
  
  return darkColors.includes(backgroundColor) 
    ? TRADITIONAL_COLORS.white.bai 
    : TRADITIONAL_COLORS.secondary.moHei;
}
