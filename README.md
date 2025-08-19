# JS-GD-Game

一个基于Vue 3 + Three.js的3D格斗游戏项目，支持原神和崩坏：星穹铁道角色。

## 功能特性

- **双游戏支持**: 原神 (Genshin Impact) 和 崩坏：星穹铁道 (Honkai: Star Rail)
- **3D角色模型**: 支持GLTF和MMD模型格式
- **双形态系统**: 支持角色开大后的形态转换（如黄泉）
- **角色选择**: 完整的角色选择界面，支持玩家1和玩家2依次选择
- **技能系统**: 每个角色都有独特的技能组合（普攻、技能、大招、重击）
- **元素系统**: 支持多种元素类型（火、雷、冰、水、风、岩、量子、物理）
- **响应式UI**: 现代化的用户界面，支持不同屏幕尺寸

## 角色配置

### 原神角色
- **胡桃** (Pyro) - 火元素角色，生命值越低伤害越高
- **刻晴** (Electro) - 雷元素角色，高速移动和雷元素攻击
- **芙宁娜** (Hydro) - 水元素角色，**双形态系统**，技能可切换形态
- **玛薇卡** (Pyro) - 火元素角色，火焰剑法和舞蹈
- **诺艾尔** (Geo) - 岩元素角色，高防御和治疗能力
- **魈** (Anemo) - 风元素角色，夜叉形态和风元素攻击
- **丝柯克** (Hydro) - 水元素角色，深海之力和召唤
- **仆人** (Pyro) - 火元素角色，火焰掌控和舞蹈

### 崩坏：星穹铁道角色
- **丹恒** (Wind) - 风元素角色，风之守护和束缚
- **三月七** (Ice) - 冰元素角色，冰霜护盾和冻结
- **黄泉** (Lightning) - 雷元素角色，**双形态系统**，开大后进入雷神形态持续5秒
- **遐蝶** (Quantum) - 量子元素角色，消耗生命值的技能和持续伤害
- **卡芙卡** (Lightning) - 雷元素角色，连锁闪电和感电效果
- **镜流** (Ice) - 冰元素角色，冰镜反射和冻结
- **万敌** (Physical) - 物理角色，钢铁之躯和护盾

## 双形态系统

### 黄泉双形态（开大后自动切换）
- **形态一** (默认): 对应 `huangquan` 文件夹，使用 `星穹铁道—黄泉.pmx` 模型
- **形态二** (开大后): 对应 `huangquan2` 文件夹，使用 `星穹铁道—黄泉.pmx` 模型
- **持续时间**: 开大后形态二保持5秒，然后自动恢复形态一
- **效果**: 形态二期间攻击力提升50%，所有攻击附加雷元素伤害

### 芙宁娜双形态（技能切换）
- **形态一** (默认): 对应 `furina` 文件夹，使用 `芙宁娜.pmx` 模型
- **形态二** (技能切换): 对应 `furina` 文件夹，使用 `芙宁娜-荒.pmx` 模型
- **切换方式**: 使用技能可以主动切换形态，无时间限制
- **效果**: 不同形态拥有不同的技能效果和属性加成

## 技术架构

### 前端技术栈
- **Vue 3**: 使用 Composition API 和 `<script setup>`
- **TypeScript**: 完整的类型支持
- **Three.js**: 3D渲染引擎
- **MMD Loader**: 支持MMD模型格式
- **Vue Router**: 页面路由管理
- **LESS**: CSS预处理器

### 3D模型支持
- **GLTF/GLB**: 标准3D模型格式
- **MMD**: 支持 `.pmd` 和 `.pmx` 格式
- **自动检测**: 根据文件扩展名自动选择合适的加载器
- **双形态切换**: 支持角色形态的实时切换
  - **自动切换**: 开大后自动切换，定时恢复（如黄泉）
  - **手动切换**: 技能触发切换，无时间限制（如芙宁娜）

### 组件架构
- **CharacterPreview**: 3D模型预览组件，支持双形态
- **Select**: 角色选择页面，支持玩家顺序选择
- **Game**: 游戏主页面
- **Mode**: 游戏模式选择
- **Home**: 主页面

## 目录结构

```
js-gd-game/
├── public/
│   ├── avatars/          # 角色头像
│   │   ├── genshin/      # 原神角色头像
│   │   └── starrail/     # 崩坏星穹铁道角色头像
│   ├── models/           # 3D模型文件
│   │   ├── genshin/      # 原神角色模型
│   │   └── starrail/     # 崩坏星穹铁道角色模型
│   └── pixel-space.png   # 默认背景图
├── src/
│   ├── components/       # Vue组件
│   │   └── CharacterPreview.vue  # 3D模型预览
│   ├── game/            # 游戏核心逻辑
│   │   ├── config/      # 角色配置文件
│   │   │   ├── genshin.json      # 原神角色配置
│   │   │   ├── starrail.json     # 崩坏星穹铁道角色配置
│   │   │   └── types.ts          # 类型定义
│   │   └── core/        # 游戏引擎核心
│   ├── pages/           # 页面组件
│   │   ├── Home.vue     # 主页面
│   │   ├── Mode.vue     # 模式选择
│   │   ├── Select.vue   # 角色选择
│   │   └── Game.vue     # 游戏页面
│   └── router/          # 路由配置
└── package.json
```

## 资源文件

### 模型文件结构
```
public/models/
├── genshin/
│   ├── hutao/
│   ├── keqing/
│   ├── furina/
│   ├── mavuika/
│   ├── noelle/
│   ├── xiao/
│   ├── skirk/
│   └── arlecchino/
└── starrail/
    ├── danheng/
    ├── march7/
    ├── huangquan/        # 形态一
    ├── huangquan2/       # 形态二
    ├── xiadie/
    ├── kafka/
    ├── jingliu/
    └── wandi/
```

### 头像文件结构
```
public/avatars/
├── genshin/              # 原神角色头像
└── starrail/             # 崩坏星穹铁道角色头像
```

## 开发指南

### 环境要求
- Node.js >= 20.19.0
- npm >= 9.8.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 角色配置格式

### 基础配置
```json
{
  "game": "starrail",
  "key": "huangquan",
  "name": "黄泉",
  "element": "Lightning",
  "avatar": "/avatars/starrail/huangquan.png",
  "model": "/models/starrail/huangquan/星穹铁道—黄泉.pmx",
  "model2": "/models/starrail/huangquan2/星穹铁道—黄泉.pmx",
  "transform_duration": 5
}
```

### 双形态配置字段
- `model`: 第一形态模型路径
- `model2`: 第二形态模型路径（可选）
- `transform_duration`: 形态转换持续时间（秒，仅用于开大后自动切换）

### 双形态类型

#### 1. 开大后自动切换（如黄泉）
```json
{
  "model2": "/models/starrail/huangquan2/星穹铁道—黄泉.pmx",
  "transform_duration": 5
}
```
- 开大后自动切换到形态二
- 5秒后自动恢复形态一
- 使用 `triggerTransform()` 方法触发

#### 2. 技能主动切换（如芙宁娜）
```json
{
  "model2": "/models/genshin/furina/芙宁娜-荒.pmx"
}
```
- 无 `transform_duration` 字段
- 使用技能可以主动切换形态
- 使用 `toggleForm()` 方法切换
- 使用 `setForm('form1'|'form2')` 强制设置形态

## 更新记录

### v1.0.0 (当前版本)
- ✅ 支持原神和崩坏：星穹铁道双游戏
- ✅ 集成MMD模型加载器
- ✅ 实现黄泉双形态系统（开大后自动切换）
- ✅ 实现芙宁娜双形态系统（技能主动切换）
- ✅ 完整的角色选择界面
- ✅ 响应式UI设计
- ✅ 支持GLTF和MMD模型格式
- ✅ 角色技能和被动系统
- ✅ 元素类型系统
- ✅ 双形态切换API（自动/手动）

### 计划功能
- 🔄 战斗系统实现
- 🔄 角色动画系统
- 🔄 音效和背景音乐
- 🔄 多人对战模式
- 🔄 角色皮肤系统

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

本项目采用MIT许可证。
