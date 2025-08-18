# GD Fight（Vue3 + TypeScript + three.js）

一个使用 Vue3 + TypeScript + three.js 开发的基础格斗游戏原型，支持选择场景、选择模式（单人/双人）与选择角色。角色具备移动、跳跃、普攻、重击、技能与大招等动作；使用面向对象进行角色、输入、AI 与场景的设计。角色模型暂未绑定，已预留绑定模型的接口。

## 版本信息

- 当前版本：0.0.0（可运行原型）
- 技术栈与关键依赖：
  - Vue `^3.5.x`
  - Vite `^7.x`
  - TypeScript `~5.8.x`
  - Vue Router `^4.5.x`
  - three.js `^0.179.x`

## 功能特性

- 模式选择：
  - solo（单人对战AI）
  - pvp（本地双人对战）
- 场景选择：`dojo` / `city` / `forest`（可扩展装饰）
- 角色选择：`ninja` / `knight` / `mage`（含不同数值与特性）
- 角色能力：移动、跳跃、普攻（轻击）、重击、技能、终极技能（大招）
- AI：简单追踪 + 随机出招的冷却逻辑（用于单人模式对手）
- 面向对象架构：角色、工厂、输入、AI、场景、引擎模块化设计
- 预留模型绑定：`Character.attachModel(model)` 可在后续替换几何体/动画

## 目录结构（关键）

```
gd-fight/
  ├─ index.html
  ├─ src/
  │  ├─ main.ts                 # 应用入口
  │  ├─ App.vue                 # 根组件
  │  ├─ router/
  │  │  └─ index.ts            # 路由（/ 与 /game）
  │  ├─ pages/
  │  │  ├─ Home.vue            # 选择模式/场景/角色
  │  │  └─ Game.vue            # three.js 视口与引擎启动
  │  ├─ game/
  │  │  ├─ types.ts            # 类型定义（模式/场景/角色/属性/输入）
  │  │  └─ core/
  │  │     ├─ GameEngine.ts    # 渲染循环、相机、场景/玩家装配、更新
  │  │     ├─ Character.ts     # 角色实体（移动/跳跃/攻击/受击/大招）
  │  │     ├─ CharacterFactory.ts  # 角色数值工厂
  │  │     ├─ KeyboardInput.ts # 键盘输入适配（支持双人映射）
  │  │     ├─ AIController.ts  # 简易AI（solo模式下控制对手）
  │  │     └─ SceneFactory.ts  # 场景生成工厂
  ├─ vite.config.ts
  ├─ tsconfig.json / tsconfig.app.json
  └─ package.json
```

## 运行与构建

在 `gd-fight` 目录执行：

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 操作说明（默认键位）

- P1：
  - 左/右：方向键 ← →
  - 跳跃：Space
  - 轻击：J
  - 重击：K
  - 技能：U
  - 大招：I
- P2（仅 pvp 模式）：
  - 左/右：A / D
  - 跳跃：W
  - 轻击：F
  - 重击：G
  - 技能：R
  - 大招：T

## 架构设计

- `Character`：
  - 属性：`stats`（hp/攻击/防御/速度/跳跃/能量）、`velocity`、`facing`、`currentAction`、`grounded`
  - 能力：`updateFromInput`、`jump`、`attackLight`、`attackHeavy`、`castSkill`、`castUltimate`、`takeDamage`
  - 模型接口：`attachModel(model: Object3D)`（后续挂接骨骼与动画）
- `CharacterFactory`：按 `CharacterKey` 生成不同数值的角色
- `KeyboardInput`：采集键盘状态并提供 `snapshot()`，支持不同键位映射
- `AIController`：根据目标位置与冷却随机出招，提供 `snapshot()` 给角色更新
- `SceneFactory`：生成基础场景（地面/网格/天光），可按 `SceneKey` 扩展装饰
- `GameEngine`：初始化渲染器/相机/场景，创建玩家与输入/AI，驱动 `tick` 与渲染循环

## 扩展点

- 新角色：在 `CharacterFactory` 添加数值映射；必要时在 `Character` 扩展专属技能逻辑
- 新场景：在 `SceneFactory` 增加 `SceneKey` 与对应装饰/灯光/平台
- 新输入设备：新增 `GamepadInput`/`TouchInput` 并在 `GameEngine` 装配
- 打击判定与碰撞：可在 `GameEngine` 中加入命中盒、硬直与连击系统
- 模型/动画：在资源加载完成后调用 `character.attachModel(model)` 进行挂载

## 常见问题

- 构建超过 500 kB 警告：为 Vite 默认提示，可通过动态导入与手动分包优化
- Node 版本：`package.json` 中声明较新的 Node 版本，如遇到安装警告，可升级 Node

## 许可证

仅用于学习与演示，可按需自定义添加许可证文本。
