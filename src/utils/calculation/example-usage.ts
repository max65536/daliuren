/**
 * 大六壬起课接口使用示例
 * Example Usage of Da Liu Ren Calculation Interface
 */

import { 
  calculateFromStrings, 
  quickCalculate, 
  parseGanZhi,
  calculateDaLiuRenComplete,
  type SiZhu 
} from './four-lessons';

/**
 * 示例1：使用字符串参数的便捷接口
 */
export function example1() {
  console.log('=== 示例1：字符串参数接口 ===');
  
  // 输入：日柱甲子，时柱丙寅，月将在丑位，时间为上午10点
  const result = calculateFromStrings('甲子', '丙寅', '丑', 10);
  
  console.log(result);
  return result;
}

/**
 * 示例2：使用解析后的干支对象
 */
export function example2() {
  console.log('=== 示例2：干支对象接口 ===');
  
  try {
    const dayGanZhi = parseGanZhi('乙丑');
    const hourGanZhi = parseGanZhi('戊午');
    const yueJiang = '寅';
    
    const result = quickCalculate(dayGanZhi, hourGanZhi, yueJiang as any, 14);
    
    console.log(result);
    return result;
  } catch (error) {
    console.error('解析错误:', error);
    return null;
  }
}

/**
 * 示例3：使用完整四柱信息
 */
export function example3() {
  console.log('=== 示例3：完整四柱接口 ===');
  
  try {
    const siZhu: SiZhu = {
      year: parseGanZhi('癸卯'),   // 2023年
      month: parseGanZhi('甲子'),  // 十一月
      day: parseGanZhi('丙申'),    // 日柱
      hour: parseGanZhi('庚寅')    // 时柱
    };
    
    const yueJiang = '亥'; // 月将在亥位
    const hour = 16; // 下午4点
    
    const result = calculateDaLiuRenComplete(siZhu, yueJiang as any, hour);
    
    console.log('=== 完整结果 ===');
    console.log(result.tianDiPan);
    console.log(result.siKe);
    console.log(result.sanChuan);
    console.log(result.analysis);
    
    // 也可以获取原始数据进行进一步处理
    console.log('=== 原始数据 ===');
    console.log('四课:', result.raw.siKe);
    console.log('三传:', result.raw.sanChuan);
    console.log('神将位置:', result.raw.shenJiangPositions);
    
    return result;
  } catch (error) {
    console.error('计算错误:', error);
    return null;
  }
}

/**
 * 示例4：批量计算不同时辰的结果
 */
export function example4() {
  console.log('=== 示例4：批量计算 ===');
  
  const dayGanZhi = '戊戌';
  const yueJiang = '卯';
  const results: string[] = [];
  
  // 计算一天中不同时辰的起课结果
  const timeSlots = [
    { hour: 6, name: '卯时' },
    { hour: 8, name: '辰时' },
    { hour: 12, name: '午时' },
    { hour: 18, name: '酉时' },
    { hour: 22, name: '亥时' }
  ];
  
  for (const slot of timeSlots) {
    console.log(`\n--- ${slot.name}（${slot.hour}点）---`);
    
    // 根据时辰计算时柱
    const hourGanZhi = calculateHourGanZhi(dayGanZhi, slot.hour);
    const result = calculateFromStrings(dayGanZhi, hourGanZhi, yueJiang, slot.hour);
    
    console.log(result);
    results.push(`${slot.name}：\n${result}`);
  }
  
  return results;
}

/**
 * 根据日干和小时计算时柱（简化版）
 */
function calculateHourGanZhi(dayGanZhi: string, hour: number): string {
  // 这里简化处理，实际应该使用更精确的时干计算
  const hourZhiMap: Record<number, string> = {
    23: '子', 0: '子', 1: '丑', 2: '丑',
    3: '寅', 4: '寅', 5: '卯', 6: '卯',
    7: '辰', 8: '辰', 9: '巳', 10: '巳',
    11: '午', 12: '午', 13: '未', 14: '未',
    15: '申', 16: '申', 17: '酉', 18: '酉',
    19: '戌', 20: '戌', 21: '亥', 22: '亥'
  };
  
  const hourZhi = hourZhiMap[hour] || '子';
  
  // 简化的时干计算（实际应该根据日干推算）
  const ganMap: Record<string, string> = {
    '甲': '甲', '乙': '乙', '丙': '丙', '丁': '丁', '戊': '戊',
    '己': '己', '庚': '庚', '辛': '辛', '壬': '壬', '癸': '癸'
  };
  
  const dayGan = dayGanZhi[0];
  const hourGan = ganMap[dayGan] || '甲';
  
  return hourGan + hourZhi;
}

/**
 * 运行所有示例
 */
export function runAllExamples() {
  console.log('开始运行大六壬起课示例...\n');
  
  example1();
  console.log('\n' + '='.repeat(50) + '\n');
  
  example2();
  console.log('\n' + '='.repeat(50) + '\n');
  
  example3();
  console.log('\n' + '='.repeat(50) + '\n');
  
  example4();
  
  console.log('\n所有示例运行完成！');
}

// 如果直接运行此文件，执行示例
if (typeof window === 'undefined') {
  // Node.js 环境
  runAllExamples();
}
