# @max65536/daliuren

大六壬核心计算库 - Da Liu Ren Divination Core Library

一个基于传统大六壬理论的JavaScript/TypeScript计算库，提供完整的起课、神将计算和分析功能。

## 特性

- 🎯 **传统准确**：基于正统大六壬理论实现
- 📦 **TypeScript支持**：完整的类型定义
- 🚀 **多环境支持**：Node.js、浏览器、小程序
- 🔧 **易于集成**：简洁的API设计
- 📱 **轻量级**：压缩后仅2.5KB

## 安装

```bash
npm install @max65536/daliuren
```

## 快速开始

### 基础用法

```typescript
import { parseGanZhi, quickCalculate } from '@max65536/daliuren';

// 解析干支
const ganZhi = parseGanZhi('甲子');
console.log(ganZhi); // { gan: '甲', zhi: '子', index: 1 }

// 快速起课
const result = quickCalculate('甲子', '丙午', '丑', 14);
console.log(result);
```

### 神将计算

```typescript
import { 
  getGuiRenPosition, 
  calculateShenJiangPositions,
  getShenJiangMeaning,
  isShenJiangAuspicious 
} from '@max65536/daliuren';

// 获取贵人位置
const guiRenPos = getGuiRenPosition('甲', true); // 白天贵人位置

// 计算神将位置
const positions = calculateShenJiangPositions(guiRenPos);

// 神将分析
const meaning = getShenJiangMeaning('贵人'); // "贵人相助，事业顺利"
const isGood = isShenJiangAuspicious('贵人'); // true
```

### 详细计算

```typescript
import { calculateFromStrings } from '@max65536/daliuren';

const { siKe, shenJiangPositions } = calculateFromStrings('甲子', '丙午', 14);
console.log('四课:', siKe);
console.log('神将位置:', shenJiangPositions);
```

## API 文档

### 基础功能

- `parseGanZhi(ganZhiStr: string): GanZhi` - 解析干支字符串
- `getTianGanIndex(gan: TianGan): number` - 获取天干索引
- `getDiZhiIndex(zhi: DiZhi): number` - 获取地支索引

### 神将功能

- `getGuiRenPosition(dayGan: TianGan, isDayTime: boolean): DiZhi` - 获取贵人位置
- `calculateShenJiangPositions(guiRenPosition: DiZhi): Record<DiZhi, ShenJiang>` - 计算神将位置
- `getShenJiangMeaning(shen: ShenJiang): string` - 获取神将含义
- `isShenJiangAuspicious(shen: ShenJiang): boolean` - 判断神将吉凶

### 起课功能

- `quickCalculate(dayGanZhi: string, monthGanZhi: string, yueJiang: DiZhi, hour: number): string` - 快速起课
- `calculateFromStrings(dayGanZhi: string, hourGanZhi: string, hour: number)` - 从字符串计算

## 类型定义

```typescript
type TianGan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
type DiZhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
type ShenJiang = "贵人" | "腾蛇" | "朱雀" | "六合" | "勾陈" | "青龙" | "天空" | "白虎" | "太常" | "玄武" | "太阴" | "天后";

interface GanZhi {
  gan: TianGan;
  zhi: DiZhi;
  index: number;
}

interface SiKe {
  first: KeInfo;
  second: KeInfo;
  third: KeInfo;
  fourth: KeInfo;
}
```

## 使用场景

- **Web应用**：React、Vue、Angular等前端项目
- **Node.js服务**：后端API服务、微服务
- **小程序**：微信、支付宝、字节跳动小程序
- **桌面应用**：Electron桌面应用
- **移动应用**：React Native、Ionic等

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request到 [GitHub仓库](https://github.com/max65536/daliuren)！

## 更新日志

### 1.0.0
- 初始版本发布
- 支持基础干支解析
- 支持神将位置计算
- 支持四课立法
- 完整的TypeScript类型支持

## 相关项目

这个库是从 [大六壬起课应用](https://github.com/max65536/daliuren) 项目中提取的核心计算模块。
