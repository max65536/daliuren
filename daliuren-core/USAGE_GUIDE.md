# @max65536/daliuren 使用指南

大六壬核心计算库完整使用指南

## 📦 安装

```bash
npm install @max65536/daliuren
```

## 🚀 快速开始

### 基础导入

```typescript
// ES6 模块导入
import { 
  parseGanZhi, 
  quickCalculate, 
  calculateFromStrings,
  getGuiRenPosition,
  calculateShenJiangPositions,
  getShenJiangMeaning,
  isShenJiangAuspicious
} from '@max65536/daliuren';

// CommonJS 导入
const { 
  parseGanZhi, 
  quickCalculate 
} = require('@max65536/daliuren');
```

### 最简单的使用

```typescript
// 快速起课 - 一行代码搞定
const result = quickCalculate('甲子', '丙午', '丑', 14);
console.log(result);
```

## 📚 详细API参考

### 1. 基础干支解析

#### `parseGanZhi(ganZhiStr: string): GanZhi`

解析干支字符串为结构化对象。

**参数：**
- `ganZhiStr`: 干支字符串，必须是2个字符（如：'甲子'、'丙午'）

**返回值：**
```typescript
{
  gan: TianGan;     // 天干：'甲'到'癸'
  zhi: DiZhi;       // 地支：'子'到'亥'
  index: number;    // 在六十甲子中的位置 (1-60)
}
```

**示例：**
```typescript
const ganZhi = parseGanZhi('甲子');
console.log(ganZhi);
// 输出: { gan: '甲', zhi: '子', index: 1 }

const ganZhi2 = parseGanZhi('癸亥');
console.log(ganZhi2);
// 输出: { gan: '癸', zhi: '亥', index: 60 }
```

#### `getTianGanIndex(gan: TianGan): number`

获取天干的索引位置。

**参数：**
- `gan`: 天干字符（'甲'到'癸'）

**返回值：**
- 索引值 (0-9)

**示例：**
```typescript
const index = getTianGanIndex('甲'); // 0
const index2 = getTianGanIndex('癸'); // 9
```

#### `getDiZhiIndex(zhi: DiZhi): number`

获取地支的索引位置。

**参数：**
- `zhi`: 地支字符（'子'到'亥'）

**返回值：**
- 索引值 (0-11)

**示例：**
```typescript
const index = getDiZhiIndex('子'); // 0
const index2 = getDiZhiIndex('亥'); // 11
```

### 2. 神将位置计算

#### `getGuiRenPosition(dayGan: TianGan, isDayTime: boolean): DiZhi`

根据日干和时辰确定贵人位置。

**参数：**
- `dayGan`: 日干
- `isDayTime`: 是否白天（6:00-18:00为白天）

**返回值：**
- 贵人所在地支位置

**示例：**
```typescript
const guiRenPos = getGuiRenPosition('甲', true);  // '丑' (甲日白天贵人在丑)
const guiRenPos2 = getGuiRenPosition('甲', false); // '未' (甲日夜晚贵人在未)
```

#### `calculateShenJiangPositions(guiRenPosition: DiZhi, clockwise?: boolean): Record<DiZhi, ShenJiang>`

计算十二神将在十二地支的分布。

**参数：**
- `guiRenPosition`: 贵人位置
- `clockwise`: 是否顺时针排列（默认true）

**返回值：**
- 十二地支对应的神将分布

**示例：**
```typescript
const positions = calculateShenJiangPositions('丑');
console.log(positions);
// 输出: {
//   子: '天后', 丑: '贵人', 寅: '腾蛇', 卯: '朱雀',
//   辰: '六合', 巳: '勾陈', 午: '青龙', 未: '天空',
//   申: '白虎', 酉: '太常', 戌: '玄武', 亥: '太阴'
// }
```

#### `getShenJiangMeaning(shen: ShenJiang): string`

获取神将的含义解释。

**参数：**
- `shen`: 神将名称

**返回值：**
- 神将含义文字

**示例：**
```typescript
const meaning = getShenJiangMeaning('贵人'); // "贵人相助，事业顺利"
const meaning2 = getShenJiangMeaning('白虎'); // "疾病伤灾，需防凶险"
```

#### `isShenJiangAuspicious(shen: ShenJiang): boolean`

判断神将是否吉利。

**参数：**
- `shen`: 神将名称

**返回值：**
- 是否吉利

**示例：**
```typescript
const isGood = isShenJiangAuspicious('贵人'); // true
const isGood2 = isShenJiangAuspicious('白虎'); // false
```

### 3. 起课计算

#### `quickCalculate(dayGanZhi: string, monthGanZhi: string, yueJiang: DiZhi, hour: number): string`

快速起课计算，返回格式化的结果字符串。

**参数：**
- `dayGanZhi`: 日干支
- `monthGanZhi`: 月干支
- `yueJiang`: 月将（地支）
- `hour`: 时辰（1-24）

**返回值：**
- 格式化的起课结果

**示例：**
```typescript
const result = quickCalculate('甲子', '丙午', '丑', 14);
console.log(result);
```

**输出示例：**
```
=== 大六壬起课结果 ===

日干支: 甲子
月干支: 丙午
月将: 丑

四课:
一课: 甲 - 寅 (贵人)
二课: 甲 - 卯 (腾蛇)
三课: 甲 - 子 (天后)
四课: 甲 - 丑 (贵人)

神将位置:
子: 天后
丑: 贵人
寅: 腾蛇
卯: 朱雀
辰: 六合
巳: 勾陈
午: 青龙
未: 天空
申: 白虎
酉: 太常
戌: 玄武
亥: 太阴
```

#### `calculateFromStrings(dayGanZhi: string, hourGanZhi: string, hour: number): { siKe: SiKe; shenJiangPositions: Record<DiZhi, ShenJiang> }`

详细的结构化计算，返回四课和神将位置的结构化数据。

**参数：**
- `dayGanZhi`: 日干支
- `hourGanZhi`: 时干支
- `hour`: 时辰数字

**返回值：**
- `siKe`: 四课结构
- `shenJiangPositions`: 神将位置分布

**示例：**
```typescript
const { siKe, shenJiangPositions } = calculateFromStrings('甲子', '丙午', 14);

console.log('四课:', siKe);
// 输出: {
//   first: { gan: '甲', zhi: '寅', shen: '贵人', position: 1 },
//   second: { gan: '甲', zhi: '卯', shen: '腾蛇', position: 2 },
//   third: { gan: '甲', zhi: '子', shen: '天后', position: 3 },
//   fourth: { gan: '甲', zhi: '丑', shen: '贵人', position: 4 }
// }

console.log('神将位置:', shenJiangPositions);
```

## 🎯 数据类型定义

### 基础类型

```typescript
// 天干
type TianGan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

// 地支
type DiZhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

// 十二神将
type ShenJiang = "贵人" | "腾蛇" | "朱雀" | "六合" | "勾陈" | "青龙" | 
                 "天空" | "白虎" | "太常" | "玄武" | "太阴" | "天后";
```

### 复合类型

```typescript
// 干支对象
interface GanZhi {
  gan: TianGan;     // 天干
  zhi: DiZhi;       // 地支
  index: number;    // 在六十甲子中的位置
}

// 课信息
interface KeInfo {
  gan: TianGan;     // 天干
  zhi: DiZhi;       // 地支
  shen: ShenJiang;  // 神将
  position: number; // 课的位置 (1-4)
}

// 四课
interface SiKe {
  first: KeInfo;    // 一课（干阳课）
  second: KeInfo;   // 二课（干阴课）
  third: KeInfo;    // 三课（支阳课）
  fourth: KeInfo;   // 四课（支阴课）
}

// 神将信息
interface ShenJiangInfo {
  name: ShenJiang;
  position: DiZhi;
  attributes: {
    element: "金" | "木" | "水" | "火" | "土";  // 五行属性
    nature: "吉" | "凶" | "中";                // 吉凶性质
    direction: "东" | "南" | "西" | "北" | "中"; // 方位
  };
}
```

## 📋 贵人位置对照表

根据传统大六壬理论，不同日干的贵人位置：

| 日干 | 白天贵人 | 夜晚贵人 | 口诀 |
|------|----------|----------|------|
| 甲   | 丑       | 未       | 甲戊庚牛羊 |
| 乙   | 子       | 申       | 乙己鼠猴乡 |
| 丙   | 亥       | 酉       | 丙丁猪鸡位 |
| 丁   | 亥       | 酉       | 丙丁猪鸡位 |
| 戊   | 丑       | 未       | 甲戊庚牛羊 |
| 己   | 子       | 申       | 乙己鼠猴乡 |
| 庚   | 丑       | 未       | 甲戊庚牛羊 |
| 辛   | 午       | 寅       | 辛壬蛇马藏 |
| 壬   | 巳       | 卯       | 辛壬蛇马藏 |
| 癸   | 巳       | 卯       | 癸逢兔蛇藏 |

**时辰判断：**
- 白天：6:00-18:00 (6-17点)
- 夜晚：18:00-6:00 (18-5点)

## 🔮 十二神将属性表

| 神将 | 五行 | 吉凶 | 方位 | 含义 |
|------|------|------|------|------|
| 贵人 | 土   | 吉   | 中   | 贵人相助，事业顺利 |
| 腾蛇 | 火   | 凶   | 南   | 变化无常，需防虚惊 |
| 朱雀 | 火   | 中   | 南   | 口舌是非，文书信息 |
| 六合 | 木   | 吉   | 东   | 和合美满，合作顺利 |
| 勾陈 | 土   | 凶   | 中   | 纠纷束缚，田土之事 |
| 青龙 | 木   | 吉   | 东   | 喜庆财运，生机勃勃 |
| 天空 | 火   | 凶   | 南   | 空虚不实，防范欺骗 |
| 白虎 | 金   | 凶   | 西   | 疾病伤灾，需防凶险 |
| 太常 | 土   | 吉   | 中   | 平常稳定，衣食无忧 |
| 玄武 | 水   | 凶   | 北   | 盗贼暗昧，阴私之事 |
| 太阴 | 金   | 中   | 西   | 阴柔隐秘，女性相关 |
| 天后 | 水   | 吉   | 北   | 慈爱包容，母性滋养 |

## 💡 实际应用示例

### 示例1：完整的起课流程

```typescript
import { 
  parseGanZhi, 
  getGuiRenPosition, 
  calculateShenJiangPositions,
  quickCalculate 
} from '@max65536/daliuren';

// 假设要为2025年1月11日下午2点起课
const dayGanZhi = '甲子';    // 日干支
const monthGanZhi = '丙午';  // 月干支
const yueJiang = '丑';       // 月将
const hour = 14;             // 下午2点

// 方法1：快速起课
console.log('=== 快速起课 ===');
const quickResult = quickCalculate(dayGanZhi, monthGanZhi, yueJiang, hour);
console.log(quickResult);

// 方法2：分步详细计算
console.log('\n=== 详细计算 ===');
const dayGZ = parseGanZhi(dayGanZhi);
console.log('日干支解析:', dayGZ);

const isDay = hour >= 6 && hour < 18;
const guiRenPos = getGuiRenPosition(dayGZ.gan, isDay);
console.log('贵人位置:', guiRenPos);

const shenJiangPos = calculateShenJiangPositions(guiRenPos);
console.log('神将分布:', shenJiangPos);
```

### 示例2：批量处理多个时间

```typescript
import { quickCalculate } from '@max65536/daliuren';

const timePoints = [
  { day: '甲子', month: '丙午', yueJiang: '丑', hour: 8 },
  { day: '乙丑', month: '丁未', yueJiang: '寅', hour: 14 },
  { day: '丙寅', month: '戊申', yueJiang: '卯', hour: 20 }
];

timePoints.forEach((point, index) => {
  console.log(`\n=== 第${index + 1}个时间点 ===`);
  const result = quickCalculate(point.day, point.month, point.yueJiang, point.hour);
  console.log(result);
});
```

### 示例3：神将分析

```typescript
import { 
  calculateShenJiangPositions,
  getShenJiangMeaning,
  isShenJiangAuspicious 
} from '@max65536/daliuren';

const positions = calculateShenJiangPositions('丑');

console.log('=== 神将分析 ===');
Object.entries(positions).forEach(([zhi, shen]) => {
  const meaning = getShenJiangMeaning(shen);
  const isGood = isShenJiangAuspicious(shen);
  const nature = isGood ? '吉' : '凶';
  
  console.log(`${zhi}: ${shen} (${nature}) - ${meaning}`);
});
```

## ⚠️ 错误处理

### 常见错误类型

```typescript
import { parseGanZhi, DivinationError } from '@max65536/daliuren';

try {
  // 错误的干支格式
  const result = parseGanZhi('甲'); // 长度不对
} catch (error) {
  if (error instanceof DivinationError) {
    console.log('起课错误:', error.message);
    console.log('错误代码:', error.code);
  }
}

try {
  // 无效的干支字符
  const result = parseGanZhi('甲X'); // 无效地支
} catch (error) {
  console.log('解析错误:', error.message);
}
```

### 推荐的错误处理方式

```typescript
function safeCalculate(dayGanZhi: string, monthGanZhi: string, yueJiang: string, hour: number) {
  try {
    return quickCalculate(dayGanZhi, monthGanZhi, yueJiang as DiZhi, hour);
  } catch (error) {
    if (error instanceof DivinationError) {
      return `计算失败: ${error.message}`;
    }
    return '未知错误';
  }
}

// 使用
const result = safeCalculate('甲子', '丙午', '丑', 14);
console.log(result);
```

## 🎯 最佳实践

### 1. 输入验证

```typescript
function validateGanZhi(ganZhi: string): boolean {
  if (ganZhi.length !== 2) return false;
  
  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  return tianGan.includes(ganZhi[0]) && diZhi.includes(ganZhi[1]);
}

// 使用前验证
if (validateGanZhi('甲子')) {
  const result = parseGanZhi('甲子');
}
```

### 2. 时辰处理

```typescript
function normalizeHour(hour: number): number {
  // 确保时辰在1-24范围内
  return Math.max(1, Math.min(24, Math.floor(hour)));
}

function isDayTime(hour: number): boolean {
  const normalizedHour = normalizeHour(hour);
  return normalizedHour >= 6 && normalizedHour < 18;
}
```

### 3. 结果缓存

```typescript
const cache = new Map<string, string>();

function cachedQuickCalculate(dayGanZhi: string, monthGanZhi: string, yueJiang: DiZhi, hour: number): string {
  const key = `${dayGanZhi}-${monthGanZhi}-${yueJiang}-${hour}`;
  
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  
  const result = quickCalculate(dayGanZhi, monthGanZhi, yueJiang, hour);
  cache.set(key, result);
  return result;
}
```

## 🔗 相关资源

- **GitHub仓库**: https://github.com/max65536/daliuren
- **npm包**: https://www.npmjs.com/package/@max65536/daliuren
- **Issues反馈**: https://github.com/max65536/daliuren/issues

## 📄 许可证

MIT License

---

*本库基于传统大六壬理论开发，仅供学习和研究使用。*
