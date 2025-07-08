# 大六壬起课应用 (Da Liu Ren Divination App)

一个基于传统大六壬理论的现代化起课应用，采用 React + TypeScript 开发，保持文化准确性和传统美学。

## 项目简介 (Project Introduction)

大六壬是中国古代三大预测学之一（与太乙神数、奇门遁甲并称"三式"），以其严密的逻辑体系和深厚的文化内涵著称。本应用致力于将传统的大六壬起课方法数字化，为现代用户提供准确、便捷的占卜体验。

## 功能特性 (Features)

### 核心功能
- ✅ **传统起课算法** - 严格按照古法实现四课起法
- ✅ **天地人神四盘** - 完整的盘面展示系统
- ✅ **历法转换** - 支持公历与农历的精确转换
- ✅ **十二神将** - 准确的神将定位和运行规律
- ✅ **课式解析** - 基于传统理论的占断解释

### 界面特色
- 🎨 **传统美学** - 采用中国传统色彩和设计元素
- 📱 **响应式设计** - 支持桌面端和移动端
- 🔄 **实时计算** - 快速响应的起课计算
- 💾 **历史记录** - 保存和管理历史占卜记录

## 技术栈 (Tech Stack)

- **前端框架**: React 19.1.0
- **开发语言**: TypeScript 5.8.3
- **构建工具**: Vite 7.0.0
- **样式方案**: CSS Modules + 传统中国色彩
- **状态管理**: React Hooks
- **代码规范**: ESLint + TypeScript

## 项目结构 (Project Structure)

```
daliuren/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React 组件
│   │   ├── plates/        # 盘面组件 (天地人神)
│   │   │   ├── heaven-plate.tsx    # 天盘组件
│   │   │   ├── earth-plate.tsx     # 地盘组件
│   │   │   ├── human-plate.tsx     # 人盘组件
│   │   │   └── spirit-plate.tsx    # 神盘组件
│   │   ├── forms/         # 表单组件
│   │   │   ├── date-time-input.tsx # 日期时间输入
│   │   │   └── divination-form.tsx # 起课表单
│   │   └── common/        # 通用组件
│   │       ├── loading.tsx         # 加载组件
│   │       └── modal.tsx          # 模态框组件
│   ├── utils/             # 工具函数
│   │   ├── calendar/      # 历法转换
│   │   │   ├── lunar-calendar.ts   # 农历转换
│   │   │   └── solar-terms.ts     # 节气计算
│   │   ├── calculation/   # 起课算法
│   │   │   ├── four-lessons.ts    # 四课算法
│   │   │   ├── twelve-spirits.ts  # 十二神将
│   │   │   └── plate-calculation.ts # 盘面计算
│   │   └── constants/     # 常量定义
│   │       ├── stems-branches.ts  # 天干地支
│   │       ├── spirits.ts         # 神将定义
│   │       └── colors.ts          # 传统色彩
│   ├── types/             # TypeScript 类型定义
│   │   ├── divination.ts          # 占卜相关类型
│   │   ├── calendar.ts            # 历法相关类型
│   │   └── ui.ts                  # UI 相关类型
│   ├── styles/            # 样式文件
│   │   ├── global.css             # 全局样式
│   │   ├── traditional.css        # 传统风格样式
│   │   └── components/            # 组件样式
│   ├── hooks/             # 自定义 hooks
│   │   ├── use-divination.ts      # 占卜逻辑 hook
│   │   └── use-local-storage.ts   # 本地存储 hook
│   ├── App.tsx            # 主应用组件
│   └── main.tsx           # 应用入口
├── docs/                  # 项目文档
│   ├── API.md            # API 文档
│   ├── DEVELOPMENT.md    # 开发指南
│   └── THEORY.md         # 大六壬理论说明
├── .clinerules           # Cline 开发规范
├── CHANGELOG.md          # 变更日志
└── README.md             # 项目说明
```

## 快速开始 (Quick Start)

### 环境要求
- Node.js >= 18.0.0
- Yarn 或 npm

### 安装依赖
```bash
# 使用 yarn
yarn install

# 或使用 npm
npm install
```

### 开发模式
```bash
# 启动开发服务器
yarn dev

# 或
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本
```bash
# 构建项目
yarn build

# 预览构建结果
yarn preview
```

## 使用指南 (Usage Guide)

### 基本起课流程
1. **选择时间** - 输入起课的具体日期和时间
2. **自动计算** - 系统自动计算天干地支和节气信息
3. **生成四盘** - 展示天地人神四盘的完整布局
4. **查看解析** - 获得基于传统理论的占断解释
5. **保存记录** - 可选择保存此次占卜记录

### 界面说明
- **天盘** - 显示十二天干的固定位置
- **地盘** - 显示十二地支的当前位置
- **人盘** - 显示四课的具体内容
- **神盘** - 显示十二神将的当前位置

## 开发指南 (Development Guide)

### 代码规范
- 遵循 TypeScript 严格模式
- 使用 ESLint 进行代码检查
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 函数和变量使用有意义的中英文混合命名

### 提交规范
```
[类型] 简短描述

详细说明（可选）

类型说明：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
```

### 文档维护
每次添加新功能或修改现有功能时，请确保：
1. 更新相关的 TypeScript 类型定义
2. 更新 API 文档
3. 更新用户指南
4. 记录变更日志

## 大六壬理论基础 (Theory Foundation)

### 基本概念
- **天干地支** - 中国古代的纪时系统
- **四课** - 大六壬起课的核心方法
- **十二神将** - 大六壬中的十二个神煞
- **三传** - 从四课中提取的三个关键信息

### 起课步骤
1. 确定日干支和时辰
2. 布置天地盘
3. 立四课
4. 发三传
5. 定神将
6. 进行占断

详细理论说明请参考 [docs/THEORY.md](docs/THEORY.md)

## 贡献指南 (Contributing)

欢迎对本项目做出贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '[feat] Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 贡献要求
- 保持文化准确性
- 遵循项目代码规范
- 添加适当的测试
- 更新相关文档

## 版本历史 (Version History)

详细的版本变更记录请查看 [CHANGELOG.md](CHANGELOG.md)

## 许可证 (License)

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 联系方式 (Contact)

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发起 Discussion
- 邮件联系

## 致谢 (Acknowledgments)

- 感谢所有为传统文化传承做出贡献的学者
- 感谢开源社区提供的优秀工具和库
- 感谢所有参与项目开发和测试的贡献者

---

**注意**: 本应用仅供学习和研究传统文化使用，占卜结果仅供参考，请理性对待。
