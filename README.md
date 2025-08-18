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
 - 角色选择：基于配置的角色池（原神 / 星穹铁道）可筛选与选择，左右两侧同时选择并实时显示 3D 模型预览
- 角色能力：移动、跳跃、普攻（轻击）、重击、技能、终极技能（大招）
- AI：简单追踪 + 随机出招的冷却逻辑（用于单人模式对手）
- 面向对象架构：角色、工厂、输入、AI、场景、引擎模块化设计
- 预留模型绑定：`Character.attachModel(model)` 可在后续替换几何体/动画

UI 调整：
- 角色选择页模型预览高度增大，底部保留约页面高度的 1/8 空间
- 角色正方形头像尺寸缩小，卡片视觉更紧凑

## 目录结构（关键）

```
js-gd-game/
  ├─ index.html
  ├─ public/
  │  ├─ avatars/
  │  │  ├─ genshin/   # 原神角色头像
  │  │  └─ starrail/  # 星穹铁道角色头像
  │  └─ models/
  │     ├─ genshin/   # 原神 glTF 模型
  │     └─ starrail/  # 星穹铁道 glTF 模型
  ├─ src/
  │  ├─ main.ts
  │  ├─ App.vue
  │  ├─ router/
  │  │  └─ index.ts            # 路由（home / mode / select / game）
  │  ├─ pages/
  │  │  ├─ Home.vue
  │  │  ├─ Mode.vue            # 模式选择
  │  │  ├─ Select.vue          # 角色筛选与双侧选择，3D 模型预览
  │  │  └─ Game.vue            # three.js 视口与引擎启动
  │  ├─ components/
  │  │  └─ CharacterPreview.vue
  │  └─ game/
  │     ├─ config/
  │     │  ├─ genshin.json     # 原神角色配置（含 charged_attack）
  │     │  ├─ starrail.json    # 星穹铁道角色配置（含 charged_attack）
  │     │  ├─ index.ts         # 角色列表聚合/检索
  │     │  └─ types.ts         # 配置类型定义
  │     ├─ core/
  │     │  ├─ GameEngine.ts
  │     │  ├─ Character.ts
  │     │  ├─ CharacterFactory.ts
  │     │  ├─ KeyboardInput.ts
  │     │  ├─ AIController.ts
  │     │  └─ SceneFactory.ts
  │     └─ types.ts            # 运行期类型（键位/数值等）
  ├─ vite.config.ts
  ├─ tsconfig.json / tsconfig.app.json / tsconfig.node.json
  └─ package.json
```

## 角色与资源配置

- 配置位置：`src/game/config/genshin.json` 与 `src/game/config/starrail.json`
- 资源路径规范：
  - 原神：`avatar` 使用 `/avatars/genshin/<name>.png`，`model` 使用 `/models/genshin/<name>.glb`
  - 星穹铁道：`avatar` 使用 `/avatars/starrail/<name>.png`，`model` 使用 `/models/starrail/<name>.glb`
- 字段说明：`stats`、`passives`、`skills`；技能已统一支持 `charged_attack`（重击）

示例（节选）：
```json
{
  "game": "genshin",
  "key": "raiden",
  "name": "雷电将军",
  "avatar": "/avatars/genshin/raiden.png",
  "model": "/models/genshin/raiden.glb",
  "stats": { "maxHp": 105, "attack": 13, "defense": 2, "moveSpeed": 0.14, "jumpPower": 4.8, "specialChargeMax": 120 },
  "skills": [
    { "key": "skill", "name": "神变·恶曜开眼", "description": "..." },
    { "key": "ultimate", "name": "奥义·梦想真说", "description": "..." },
    { "key": "charged_attack", "name": "重击", "description": "..." }
  ]
}
```

## 运行与构建

在 `js-gd-game` 目录执行：

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

## 更新记录（摘要）

- 原神新增：刻晴、芙宁娜、玛薇卡、诺艾尔、魈、丝柯克、仆人；移除：钟离
- 星穹铁道新增：黄泉（雷）、遐蝶（量子，技能消耗生命，被动范围 DoT）、卡芙卡、镜流、万敌
- 资源路径按游戏分目录：`/avatars/genshin|starrail` 与 `/models/genshin|starrail`
- 为两游戏的角色补充 `charged_attack`（重击）技能
- 角色选择页 UI：模型预览高度增大（底部约留 1/8 屏幕），头像尺寸缩小
