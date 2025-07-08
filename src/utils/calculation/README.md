# 大六壬起课算法接口说明

本模块提供了完整的大六壬起课算法实现，包括四课立法、三传发法以及详细的分析功能。

## 主要功能

### 1. 核心算法
- **立四课**：根据日干支和时辰立四课
- **发三传**：从四课中提取三传（贼克法、涉害法、遥克法、昴星法）
- **神将排布**：十二神将在地支位置的分布计算
- **五行分析**：五行相克关系和强弱判断

### 2. 统一调用接口
提供多种便捷的调用方式，满足不同使用场景的需求。

## 使用方法

### 方法一：字符串参数接口（最简单）

```typescript
import { calculateFromStrings } from './four-lessons';

// 输入：日柱、时柱、月将、小时
const result = calculateFromStrings('甲子', '丙寅', '丑', 10);
console.log(result);
```

**参数说明：**
- `dayGanZhi`: 日柱干支，如 '甲子'
- `hourGanZhi`: 时柱干支，如 '丙寅'  
- `yueJiang`: 月将位置（地支），如 '丑'
- `hour`: 具体小时（0-23），用于判断昼夜贵人

### 方法二：干支对象接口

```typescript
import { quickCalculate, parseGanZhi } from './four-lessons';

const dayGanZhi = parseGanZhi('乙丑');
const hourGanZhi = parseGanZhi('戊午');
const result = quickCalculate(dayGanZhi, hourGanZhi, '寅', 14);
console.log(result);
```

### 方法三：完整四柱接口

```typescript
import { calculateDaLiuRenComplete, parseGanZhi, type SiZhu } from './four-lessons';

const siZhu: SiZhu = {
  year: parseGanZhi('癸卯'),   // 年柱
  month: parseGanZhi('甲子'),  // 月柱
  day: parseGanZhi('丙申'),    // 日柱
  hour: parseGanZhi('庚寅')    // 时柱
};

const result = calculateDaLiuRenComplete(siZhu, '亥', 16);

// 获取各部分结果
console.log(result.tianDiPan);  // 天地盘
console.log(result.siKe);       // 四课
console.log(result.sanChuan);   // 三传
console.log(result.analysis);   // 分析解读

// 获取原始数据
console.log(result.raw.siKe);                    // 四课原始数据
console.log(result.raw.sanChuan);                // 三传原始数据
console.log(result.raw.shenJiangPositions);      // 神将位置
```

## 输出格式

所有接口都会返回格式化的字符串，包含以下内容：

### 1. 天地盘
```
=== 大六壬天地盘 ===

【四柱】
年柱：癸卯  月柱：甲子  日柱：丙申  时柱：庚寅

【天盘】
    巳  午  未
辰            申
卯            酉
    寅  丑  子  戌

【地盘】
    巳  午  未
辰            申
卯            酉
    寅  丑  子  戌

【神盘】
  腾蛇  朱雀  六合
勾陈              青龙
天空              白虎
  太常  玄武  太阴  天后
```

### 2. 四课
```
=== 四课 ===

一课：丙巳 - 腾蛇
二课：丙申 - 青龙
三课：庚寅 - 太常
四课：庚寅 - 太常

课式：一重一空（涉害法）
```

### 3. 三传
```
=== 三传 ===

初传：巳 - 腾蛇
中传：申 - 青龙
末传：寅 - 太常

【传意】
初传：变化无常，需防虚惊
中传：喜庆财运，生机勃勃
末传：平常稳定，衣食无忧
```

### 4. 分析解读
```
=== 分析解读 ===

【总体判断】
课式类型：一重一空（涉害法），整体趋势：偏吉，三传混合，事情发展复杂多变

【四课分析】
一课：腾蛇(火阳) - 凶神
二课：青龙(金阳) - 吉神
三课：太常(木阳) - 吉神
四课：太常(木阳) - 吉神

【三传流向】
三传混合，事情发展复杂多变

【建议】
• 三传混合，需耐心等待时机
```

## 辅助功能

### 1. 干支解析
```typescript
import { parseGanZhi } from './four-lessons';

const ganZhi = parseGanZhi('甲子');
console.log(ganZhi); // { gan: '甲', zhi: '子', index: 1 }
```

### 2. 课式分析
```typescript
import { analyzeKe, getKeShiType } from './four-lessons';

// 分析单个课
const keAnalysis = analyzeKe(keInfo);
console.log(keAnalysis); // { wuXing: '水', yinYang: '阳', strength: 70, nature: '吉' }

// 获取课式类型
const keShiType = getKeShiType(siKe);
console.log(keShiType); // '四课无重'
```

### 3. 三传流向分析
```typescript
import { analyzeSanChuanFlow } from './four-lessons';

const flow = analyzeSanChuanFlow(sanChuan);
console.log(flow); 
// { 
//   flowType: '顺', 
//   strength: 70, 
//   description: '三传顺行，事情发展顺利' 
// }
```

## 示例代码

详细的使用示例请参考 `example-usage.ts` 文件，包含：

1. **基础用法示例**：最简单的字符串参数调用
2. **对象接口示例**：使用解析后的干支对象
3. **完整功能示例**：使用完整四柱信息
4. **批量计算示例**：计算不同时辰的起课结果

## 注意事项

1. **月将设置**：月将参数决定了贵人的位置，影响整个神将排布
2. **时间准确性**：小时参数用于判断昼夜贵人，影响计算结果
3. **干支格式**：干支字符串必须是两个字符，如 '甲子'、'乙丑'
4. **错误处理**：所有接口都包含错误处理，会返回错误信息而不是抛出异常

## 传统理论依据

本实现严格遵循传统大六壬理论：

- **四课立法**：日干时干各自加临对应地支
- **三传发法**：根据四课重复情况选择相应传法
- **神将系统**：十二神将的传统排布和含义
- **五行理论**：五行相克关系的准确应用

## 扩展功能

如需更多功能，可以直接使用底层函数：

- `calculateSiKe()`: 计算四课
- `calculateSanChuan()`: 计算三传
- `generateKeAnalysisReport()`: 生成详细分析报告
- `validateSiKe()`: 验证四课计算结果

这些函数提供了更细粒度的控制和更丰富的返回数据。
