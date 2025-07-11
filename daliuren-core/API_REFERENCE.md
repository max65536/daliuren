# @max65536/daliuren API 参考手册

## 目录

- [安装](#安装)
- [导入方式](#导入方式)
- [基础函数](#基础函数)
- [神将函数](#神将函数)
- [起课函数](#起课函数)
- [类型定义](#类型定义)
- [常量定义](#常量定义)
- [错误处理](#错误处理)

## 安装

```bash
npm install @max65536/daliuren
```

## 导入方式

### ES6 模块

```typescript
import { 
  parseGanZhi, 
  quickCalculate,
  calculateFromStrings,
  getGuiRenPosition,
  calculateShenJiangPositions,
  getShenJiangMeaning,
  isShenJiangAuspicious,
  getTianGanIndex,
  getDiZhiIndex
} from '@max65536/daliuren';
```

### CommonJS

```javascript
const { 
  parseGanZhi, 
  quickCalculate 
} = require('@max65536/daliuren');
```

### 浏览器直接引用

```html
<script src="./node_modules/@max65536/daliuren/dist/index.umd.js"></script>
<script>
  const { parseGanZhi, quickCalculate } = window.DaLiuRen;
</script>
```

## 基础函数

### parseGanZhi

解析干支字符串为结构化对象。

```typescript
function parseGanZhi(ganZhiStr: string): GanZhi
```

**参数：**
- `ganZhiStr` (string): 干支字符串，必须是2个字符

**返回值：**
- `GanZhi`: 包含天干、地支和索引的对象

**异常：**
- 当输入格式错误时抛出 `Error`

**示例：**
```typescript
const ganZhi = parseGanZhi('甲子');
// 返回: { gan: '甲', zhi: '子', index: 1 }

const ganZhi2 = parseGanZhi('癸亥');
// 返回: { gan: '癸', zhi: '亥', index: 60 }
```

### getTianGanIndex

获取天干的索引位置。

```typescript
function getTianGanIndex(gan: TianGan): number
```

**参数：**
- `gan` (TianGan): 天干字符

**返回值：**
- `number`: 索引值 (0-9)

**示例：**
```typescript
const index = getTianGanIndex('甲'); // 0
const index2 = getTianGanIndex('癸'); // 9
```

### getDiZhiIndex

获取地支的索引位置。

```typescript
function getDiZhiIndex(zhi: DiZhi): number
```

**参数：**
- `zhi` (DiZhi): 地支字符

**返回值：**
- `number`: 索引值 (0-11)

**示例：**
```typescript
const index = getDiZhiIndex('子'); // 0
const index2 = getDiZhiIndex('亥'); // 11
```

## 神将函数

### getGuiRenPosition

根据日干和时辰确定贵人位置。

```typescript
function getGuiRenPosition(dayGan: TianGan, isDayTime: boolean): DiZhi
```

**参数：**
- `dayGan` (TianGan): 日干
- `isDayTime` (boolean): 是否白天

**返回值：**
- `DiZhi`: 贵人所在地支位置

**示例：**
```typescript
const guiRenPos = getGuiRenPosition('甲', true);  // '丑'
const guiRenPos2 = getGuiRenPosition('甲', false); // '未'
```

### calculateShenJiangPositions

计算十二神将在十二地支的分布。

```typescript
function calculateShenJiangPositions(
  guiRenPosition: DiZhi, 
  clockwise?: boolean
): Record<DiZhi, ShenJiang>
```

**参数：**
- `guiRenPosition` (DiZhi): 贵人位置
- `clockwise` (boolean, 可选): 是否顺时针排列，默认 true

**返回值：**
- `Record<DiZhi, ShenJiang>`: 十二地支对应的神将分布

**示例：**
```typescript
const positions = calculateShenJiangPositions('丑');
// 返回: {
//   子: '天后', 丑: '贵人', 寅: '腾蛇', 卯: '朱雀',
//   辰: '六合', 巳: '勾陈', 午: '青龙', 未: '天空',
//   申: '白虎', 酉: '太常', 戌: '玄武', 亥: '太阴'
// }
```

### getShenJiangMeaning

获取神将的含义解释。

```typescript
function getShenJiangMeaning(shen: ShenJiang): string
```

**参数：**
- `shen` (ShenJiang): 神将名称

**返回值：**
- `string`: 神将含义文字

**示例：**
```typescript
const meaning = getShenJiangMeaning('贵人'); // "贵人相助，事业顺利"
const meaning2 = getShenJiangMeaning('白虎'); // "疾病伤灾，需防凶险"
```

### isShenJiangAuspicious

判断神将是否吉利。

```typescript
function isShenJiangAuspicious(shen: ShenJiang): boolean
```

**参数：**
- `shen` (ShenJiang): 神将名称

**返回值：**
- `boolean`: 是否吉利

**示例：**
```typescript
const isGood = isShenJiangAuspicious('贵人'); // true
const isGood2 = isShenJiangAuspicious('白虎'); // false
```

### isDayTime

判断是否为白天时间。

```typescript
function isDayTime(hour: number): boolean
```

**参数：**
- `hour` (number): 小时数 (1-24)

**返回值：**
- `boolean`: 是否白天 (6:00-18:00为白天)

**示例：**
```typescript
const isDay = isDayTime(14); // true (下午2点)
const isNight = isDayTime(22); // false (晚上10点)
```

## 起课函数

### quickCalculate

快速起课计算，返回格式化的结果字符串。

```typescript
function quickCalculate(
  dayGanZhi: string, 
  monthGanZhi: string, 
  yueJiang: DiZhi, 
  hour: number
): string
```

**参数：**
- `dayGanZhi` (string): 日干支
- `monthGanZhi` (string): 月干支
- `yueJiang` (DiZhi): 月将
- `hour` (number): 时辰 (1-24)

**返回值：**
- `string`: 格式化的起课结果

**异常：**
- 当输入无效时返回错误信息字符串

**示例：**
```typescript
const result = quickCalculate('甲子', '丙午', '丑', 14);
console.log(result);
// 输出完整的起课结果
```

### calculateFromStrings

详细的结构化计算，返回四课和神将位置的结构化数据。

```typescript
function calculateFromStrings(
  dayGanZhi: string, 
  hourGanZhi: string, 
  hour: number
): {
  siKe: SiKe;
  shenJiangPositions: Record<DiZhi, ShenJiang>;
}
```

**参数：**
- `dayGanZhi` (string): 日干支
- `hourGanZhi` (string): 时干支
- `hour` (number): 时辰数字

**返回值：**
- 对象包含：
  - `siKe` (SiKe): 四课结构
  - `shenJiangPositions` (Record<DiZhi, ShenJiang>): 神将位置分布

**示例：**
```typescript
const { siKe, shenJiangPositions } = calculateFromStrings('甲子', '丙午', 14);
console.log('四课:', siKe);
console.log('神将位置:', shenJiangPositions);
```

## 类型定义

### 基础类型

```typescript
// 天干类型
type TianGan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

// 地支类型
type DiZhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

// 神将类型
type ShenJiang = "贵人" | "腾蛇" | "朱雀" | "六合" | "勾陈" | "青龙" | 
                 "天空" | "白虎" | "太常" | "玄武" | "太阴" | "天后";
```

### 接口定义

#### GanZhi

干支对象接口。

```typescript
interface GanZhi {
  gan: TianGan;     // 天干
  zhi: DiZhi;       // 地支
  index: number;    // 在六十甲子中的位置 (1-60)
}
```

#### KeInfo

课信息接口。

```typescript
interface KeInfo {
  gan: TianGan;     // 天干
  zhi: DiZhi;       // 地支
  shen: ShenJiang;  // 神将
  position: number; // 课的位置 (1-4)
}
```

#### SiKe

四课接口。

```typescript
interface SiKe {
  first: KeInfo;    // 一课（干阳课）
  second: KeInfo;   // 二课（干阴课）
  third: KeInfo;    // 三课（支阳课）
  fourth: KeInfo;   // 四课（支阴课）
}
```

#### ShenJiangInfo

神将信息接口。

```typescript
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

#### DivinationInput

起课输入接口。

```typescript
interface DivinationInput {
  year: number;      // 年份
  month: number;     // 月份
  day: number;       // 日期
  hour: number;      // 小时
  minute?: number;   // 分钟（可选）
  isLunar?: boolean; // 是否农历（可选）
}
```

#### ChuanInfo

传信息接口。

```typescript
interface ChuanInfo {
  zhi: DiZhi;        // 地支
  shen: ShenJiang;   // 神将
  meaning: string;   // 含义
}
```

#### SanChuan

三传接口。

```typescript
interface SanChuan {
  chu: ChuanInfo;    // 初传
  zhong: ChuanInfo;  // 中传
  mo: ChuanInfo;     // 末传
}
```

## 常量定义

### 天干常量

```typescript
const TIAN_GAN: readonly TianGan[] = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'
];
```

### 地支常量

```typescript
const DI_ZHI: readonly DiZhi[] = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'
];
```

### 神将常量

```typescript
const SHEN_JIANG: readonly ShenJiang[] = [
  '贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙',
  '天空', '白虎', '太常', '玄武', '太阴', '天后'
];
```

### 贵人位置表

```typescript
const GUI_REN_POSITIONS: Record<TianGan, { day: DiZhi; night: DiZhi }> = {
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
```

### 神将属性信息

```typescript
const SHEN_JIANG_INFO: Record<ShenJiang, ShenJiangInfo> = {
  '贵人': {
    name: '贵人',
    position: '子',
    attributes: { element: '土', nature: '吉', direction: '中' }
  },
  '腾蛇': {
    name: '腾蛇',
    position: '丑',
    attributes: { element: '火', nature: '凶', direction: '南' }
  },
  // ... 其他神将信息
};
```

## 错误处理

### DivinationError

自定义错误类，用于处理起课计算中的错误。

```typescript
class DivinationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "DivinationError";
  }
}
```

**属性：**
- `message` (string): 错误信息
- `code` (string, 可选): 错误代码
- `name` (string): 错误名称，固定为 "DivinationError"

**示例：**
```typescript
import { parseGanZhi, DivinationError } from '@max65536/daliuren';

try {
  const result = parseGanZhi('甲'); // 格式错误
} catch (error) {
  if (error instanceof DivinationError) {
    console.log('错误类型:', error.name);
    console.log('错误信息:', error.message);
    console.log('错误代码:', error.code);
  }
}
```

### 常见错误情况

1. **干支格式错误**
   - 输入长度不是2个字符
   - 包含无效的天干或地支字符

2. **参数类型错误**
   - 传入了错误的数据类型
   - 时辰超出有效范围

3. **计算错误**
   - 内部计算逻辑异常

### 错误处理最佳实践

```typescript
import { quickCalculate, DivinationError } from '@max65536/daliuren';

function safeQuickCalculate(
  dayGanZhi: string, 
  monthGanZhi: string, 
  yueJiang: string, 
  hour: number
): string | null {
  try {
    return quickCalculate(dayGanZhi, monthGanZhi, yueJiang as DiZhi, hour);
  } catch (error) {
    if (error instanceof DivinationError) {
      console.error('起课计算错误:', error.message);
      return null;
    }
    console.error('未知错误:', error);
    return null;
  }
}

// 使用
const result = safeQuickCalculate('甲子', '丙午', '丑', 14);
if (result) {
  console.log(result);
} else {
  console.log('计算失败');
}
```

## 版本信息

- **当前版本**: 1.0.0
- **Node.js 支持**: >= 14.0.0
- **TypeScript 支持**: >= 4.0.0
- **浏览器支持**: 现代浏览器 (ES2020+)

## 许可证

MIT License

---

*本API参考手册基于 @max65536/daliuren v1.0.0 编写*
