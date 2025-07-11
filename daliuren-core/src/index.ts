// 大六壬核心计算库主入口
export * from "./types";
export * from "./constants/stems-branches";
export * from "./constants/spirits";
export * from "./utils/calendar";
export * from "./calculation/four-lessons";
export * from "./calculation/divination";

// 便捷调用接口
export { 
  quickCalculate,
  calculateFromStrings,
  parseGanZhi
} from "./calculation/divination";
