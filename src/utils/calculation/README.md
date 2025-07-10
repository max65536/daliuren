# 大六壬四课算法使用指南

本文档介绍如何使用修正后的大六壬四课起法算法。

## 快速开始

### 基本用法

```typescript
import { calculateFromStrings } from './four-lessons';

// 使用字符串参数进行起课
const result = calculateFromStrings('丁未', '戊申', '未', 16);
console.log(result);
```

### 高级用法

```typescript
import { 
  quickCalculate, 
  parseGanZhi, 
  calculateDaLiuRenComplete 
} from './four-lessons';

// 使用对象接口
const dayGanZhi = parseGanZhi('甲寅');
const hourGanZhi = parseGanZhi('甲子');
const result = quickCalculate(dayGanZhi, hourGanZhi, '子', 0);

// 完整的四柱起课
const siZhu = {
  year: parseGanZhi('乙巳'),
  month: parseGanZhi('戊子'),
  day: parseGanZhi('丁未'),
  hour: parseGanZhi('戊申')
};
const completeResult = calculateDaLiuRenComplete(siZhu, '未', 16);
```

## 算法特性

### 传统四课立法
- **第一课（干阳课）**：以日干寄地盘之位，寻天盘地支
- **第二课（干阴课）**：以第一课天盘地支转到地盘，再推至天盘所得
- **第三课（支阳课）**：以日支所在地盘之位，寻天盘地支
- **第四课（支阴课）**：以第三课天盘地支转到地盘，再推至天盘所得

### 九宗门三传算法
1. **贼克法** - 四课中有上下相克关系时使用
2. **比用法** - 多个下贼上或上克下时，选择与日干俱比者
3. **涉害法** - 一重一空时使用
4. **遥克法** - 四课上下无克，看日干与四课的遥克关系
5. **昴星法** - 四课俱全，上下无克，且无遥克时使用
6. **别责法** - 四课缺一，只有三课时使用
7. **八专法** - 日干支同位时使用
8. **反吟法** - 月将与占时相冲时使用
9. **伏吟法** - 月将与占时相同时使用

### 特殊课式处理
- **伏吟课**：四课中有相同的地支和神将组合
- **反吟课**：四课中有相冲的地支组合
- **八专课**：甲寅、乙卯、丙午、丁未、戊戌、己亥、庚申、辛酉、壬子、癸丑

## 输出格式

算法输出传统的文字排盘格式，包括：

1. **天地盘信息**：时间、四柱、神将分布
2. **四课排列**：传统格式的四课显示
3. **三传信息**：初传、中传、末传及其含义
4. **分析解读**：课式类型、神将分析、建议等

## 示例输出

```
大六壬排盘

2025年7月10日 16:03
丁未年 丁未月 丁未日 戊申时

            白虎  巳  天空
            丁  巳  丁
            太常  午  白虎
            丁  午  丁

课体：一重一空，伏吟（巳位上白虎重复出现，形成伏吟）

            白虎  太常  贵人
            巳  午  未

初传：白虎主疾病凶险
中传：太常主平稳安康
末传：贵人主贵人扶助

=== 分析解读 ===

【总体判断】
课式类型：伏吟（巳位上白虎重复出现，形成伏吟），整体趋势：偏凶，三传顺行，事情发展顺利
```

## API 参考

### calculateFromStrings(dayGanZhi, hourGanZhi, yueJiang, hour?)
- `dayGanZhi`: 日干支字符串，如 "丁未"
- `hourGanZhi`: 时干支字符串，如 "戊申"
- `yueJiang`: 月将地支，如 "未"
- `hour`: 具体小时（可选），默认12

### quickCalculate(dayGanZhi, hourGanZhi, yueJiang, hour?)
- `dayGanZhi`: 日干支对象
- `hourGanZhi`: 时干支对象
- `yueJiang`: 月将地支
- `hour`: 具体小时（可选）

### parseGanZhi(ganZhiStr)
- `ganZhiStr`: 干支字符串，返回干支对象

## 注意事项

1. **文化准确性**：算法严格按照传统大六壬理论实现
2. **输入验证**：会自动验证干支和月将的有效性
3. **错误处理**：提供详细的错误信息和建议
4. **性能优化**：起课计算响应时间 < 100ms

## 测试

运行测试文件验证算法：

```bash
npx tsx src/utils/calculation/test-four-lessons.ts
```

## 更新历史

- **2025年7月10日**：完全重构四课起法算法，实现九宗门法则
- **2025年1月8日**：初始版本，基础四课实现
