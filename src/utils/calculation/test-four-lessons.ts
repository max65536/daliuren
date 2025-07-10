/**
 * 四课算法测试文件
 * Test file for Four Lessons Algorithm
 */

import { calculateFromStrings, quickCalculate, parseGanZhi } from './four-lessons';

// 测试示例：丁未日申时，月将未
console.log('=== 大六壬四课算法测试 ===\n');

// 测试1：使用字符串接口
console.log('测试1：丁未日申时，月将未');
console.log('----------------------------');
const result1 = calculateFromStrings('丁未', '戊申', '未', 16);
console.log(result1);

// 测试2：使用对象接口
console.log('\n测试2：甲寅日子时，月将子');
console.log('----------------------------');
try {
  const dayGanZhi = parseGanZhi('甲寅');
  const hourGanZhi = parseGanZhi('甲子');
  const result2 = quickCalculate(dayGanZhi, hourGanZhi, '子', 0);
  console.log(result2);
} catch (error) {
  console.error('测试2出错：', error);
}

// 测试3：八专课测试
console.log('\n测试3：庚申日（八专课）');
console.log('----------------------------');
const result3 = calculateFromStrings('庚申', '丙子', '申', 12);
console.log(result3);

// 测试4：伏吟课测试
console.log('\n测试4：伏吟课测试');
console.log('----------------------------');
const result4 = calculateFromStrings('乙卯', '乙卯', '卯', 12);
console.log(result4);

console.log('\n=== 测试完成 ===');
