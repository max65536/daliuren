/**
 * UI 相关类型定义
 * UI Type Definitions
 */

import type { DivinationResult, DivinationHistory } from './divination';

// 主题配置
export interface Theme {
  name: string;
  colors: {
    primary: string;      // 主色 - 朱红
    secondary: string;    // 次色 - 墨黑
    accent: string;       // 强调色 - 金黄
    background: string;   // 背景色
    surface: string;      // 表面色
    text: {
      primary: string;    // 主要文字
      secondary: string;  // 次要文字
      accent: string;     // 强调文字
    };
    border: string;       // 边框色
    shadow: string;       // 阴影色
  };
  fonts: {
    primary: string;      // 主字体
    secondary: string;    // 次字体
    mono: string;         // 等宽字体
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// 盘面显示配置
export interface PlateDisplayConfig {
  size: number;           // 盘面大小 (px)
  showLabels: boolean;    // 是否显示标签
  showGrid: boolean;      // 是否显示网格
  animationDuration: number; // 动画持续时间 (ms)
  highlightActive: boolean;  // 是否高亮激活项
}

// 组件状态
export type ComponentState = 'idle' | 'loading' | 'success' | 'error';

// 模态框配置
export interface ModalConfig {
  title: string;
  content: React.ReactNode;
  size: 'sm' | 'md' | 'lg' | 'xl';
  closable: boolean;
  maskClosable: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// 通知配置
export interface NotificationConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // 显示时长 (ms)
  closable?: boolean;
}

// 表单字段配置
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// 分页配置
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

// 表格列配置
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

// 历史记录表格数据
export interface HistoryTableData {
  key: string;
  timestamp: string;
  question: string;
  category: string;
  result: DivinationResult;
  actions: React.ReactNode;
}

// 应用状态
export interface AppState {
  theme: Theme;
  user: {
    preferences: {
      language: 'zh-CN' | 'en-US';
      timezone: string;
      autoSave: boolean;
      showTutorial: boolean;
    };
  };
  divination: {
    current: DivinationResult | null;
    history: DivinationHistory[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    sidebarCollapsed: boolean;
    activeModal: ModalConfig | null;
    notifications: NotificationConfig[];
    plateConfig: PlateDisplayConfig;
  };
}

// 动作类型
export type AppAction = 
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_DIVINATION_RESULT'; payload: DivinationResult }
  | { type: 'ADD_HISTORY'; payload: DivinationHistory }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SHOW_MODAL'; payload: ModalConfig }
  | { type: 'HIDE_MODAL' }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationConfig }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_PLATE_CONFIG'; payload: Partial<PlateDisplayConfig> };

// 路由配置
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  icon?: string;
  exact?: boolean;
  protected?: boolean;
}

// 响应式断点
export interface Breakpoints {
  xs: number;  // 手机
  sm: number;  // 平板
  md: number;  // 小屏幕桌面
  lg: number;  // 大屏幕桌面
  xl: number;  // 超大屏幕
}

// 动画配置
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// 键盘快捷键配置
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}
