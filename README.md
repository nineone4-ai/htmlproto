# HTML表单生成器项目



[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/easonchan777s-projects/zerohtmlcreator)


1. 技术架构概览

   🏗️ 采用的设计模式与架构风格

   组件化架构: 基于React函数式组件的模块化设计

   状态提升模式: 主要状态集中在根组件FormBuilder中管理

   拖拽设计模式: 使用react-dnd实现的拖拽交互系统

   工厂模式: 在HTML生成器中根据组件类型动态生成对应HTML结构

   观察者模式: 通过props回调函数实现组件间通信

#### 🛠️ 主要技术栈与依赖项

```
{
  "name": "my-v0-project",
  "dependencies": {
    "next": "15.2.4",
    "react": "^19",
    "react-dom": "^19",
    "react-dnd": "latest",
    "react-dnd-html5-backend": "latest",
    "@radix-ui/react-*": "多个UI组件库",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
}
```

**核心技术栈**:

- **前端框架**: Next.js 15.2.4 + React 19
- **UI组件库**: Radix UI + shadcn/ui
- **样式系统**: Tailwind CSS
- **拖拽功能**: react-dnd + HTML5Backend
- **表单处理**: react-hook-form + zod验证
- **开发语言**: TypeScript

#### 🏢 模块划分与组织结构

```
htmlproto/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主应用组件(FormBuilder)
│   └── layout.tsx         # 应用布局
├── components/            # 业务组件
│   ├── component-sidebar.tsx    # 组件侧边栏
│   ├── layout-preview.tsx       # 布局预览区
│   ├── form-preview.tsx         # 表单预览组件
│   ├── property-panel.tsx       # 属性配置面板
│   └── ui/                      # 基础UI组件
├── lib/                   # 工具库
│   ├── html-generator.ts        # HTML生成器
│   ├── html-parser.ts           # HTML解析器
│   └── utils.ts                 # 通用工具函数
└── hooks/                 # 自定义Hooks
    └── use-toast.ts
```

### 2. 代码组织与模块化分析

#### 🔗 模块间的耦合度分析

**低耦合设计**:

- **数据流向**: 单向数据流，状态从父组件向子组件传递
- **接口抽象**: 通过TypeScript接口定义清晰的组件契约

**组件依赖关系**:

```
graph TD
    A[FormBuilder 主组件] --> B[ComponentSidebar 组件侧边栏]
    A --> C[LayoutPreview 布局预览]
    A --> D[PropertyPanel 属性面板]
    C --> E[FormPreview 表单预览]
    E --> F[DraggableComponent 可拖拽组件]
    A --> G[HTML Generator 生成器]
    A --> H[HTML Parser 解析器]
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style H fill:#f3e5f5

```

#### 🔧 核心功能模块

**1. 拖拽系统**:

- 使用react-dnd实现组件拖拽
- 支持组件重排序和跨区域拖拽

```
const [{ isDragging }, drag, preview] = useDrag({
  type: "FORM_COMPONENT",
  item: () => ({ id: component.id, index }),
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
})
```

**2. HTML生成与解析**:

- 双向转换：可视化编辑 ↔ HTML代码
- 支持多种布局类型(tabs/accordion/flat)

```
export const generateHtml = (appState: AppState) => {
  const { layoutType, layoutItems, metadata } = appState
  
  if (layoutType === "tabs") {
    html += generateTabsHtml(layoutItems)
  } else if (layoutType === "accordion") {
    html += generateAccordionHtml(layoutItems)
  } else if (layoutType === "flat") {
    html += generateFlatHtml(layoutItems)
  }
}
```

#### 📊 可扩展性和维护性评估

**✅ 优势**:

1. **组件化设计**: 每个功能模块独立封装，便于维护和测试
2. **类型安全**: 完整的TypeScript类型定义，减少运行时错误
3. **状态管理清晰**: 集中式状态管理，数据流向明确
4. **UI组件复用**: 基于shadcn/ui的组件库，保证设计一致性

**⚠️ 改进建议**:

1. 状态管理优化
   - 当前所有状态集中在单个组件中，随着功能增加可能变得复杂
   - 建议引入Context API或状态管理库(如Zustand)
2. 错误处理增强
   - 增加更完善的错误边界和异常处理
   - 添加数据验证和用户输入校验
3. 性能优化
   - 对大型表单的渲染性能进行优化
   - 使用React.memo和useMemo减少不必要的重渲染
4. 测试覆盖
   - 当前缺少单元测试和集成测试
   - 建议添加Jest + Testing Library测试套件



## Install

```
yarn install
```



## Build your app

```
yarn build
```



## How It Works

```
yarn dev
```

