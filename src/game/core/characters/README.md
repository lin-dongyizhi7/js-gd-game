# 角色类系统

本目录包含了游戏中所有角色的具体实现类，按照游戏类型进行分类。

## 目录结构

```
characters/
├── index.ts              # 主导出文件
├── genshin/              # 原神角色
│   ├── index.ts         # 原神角色导出
│   ├── Hutao.ts         # 胡桃
│   ├── Raiden.ts        # 雷电将军
│   ├── Keqing.ts        # 刻晴
│   ├── Furina.ts        # 芙宁娜（双形态）
│   ├── Mavuika.ts       # 玛薇卡
│   ├── Noelle.ts        # 诺艾尔
│   ├── Xiao.ts          # 魈
│   ├── Skirk.ts         # 丝柯克
│   └── Arlecchino.ts    # 仆人
└── starrail/             # 崩坏：星穹铁道角色
    ├── index.ts         # 星穹铁道角色导出
    ├── Danheng.ts       # 丹恒
    ├── March7.ts        # 三月七
    ├── Huangquan.ts     # 黄泉（双形态）
    ├── Xiadie.ts        # 遐蝶
    ├── Kafka.ts         # 卡芙卡
    ├── Jingliu.ts       # 镜流
    └── Wandi.ts         # 万敌
```

## 使用方法

### 1. 导入角色类

```typescript
// 导入特定角色
import { Hutao, Furina } from '@/game/core/characters/genshin'
import { Huangquan, Kafka } from '@/game/core/characters/starrail'

// 或者从主导出文件导入
import { Hutao, Huangquan } from '@/game/core/characters'
```

### 2. 创建角色实例

```typescript
import { Hutao, HutaoOptions } from '@/game/core/characters/genshin'

const hutaoOptions: HutaoOptions = {
  name: '胡桃',
  stats: {
    maxHp: 100,
    hp: 100,
    attack: 14,
    defense: 1,
    moveSpeed: 0.14,
    jumpPower: 5.0,
    specialCharge: 0,
    specialChargeMax: 100,
    element: 'Pyro'
  },
  teamId: 1,
  passives: [
    {
      key: 'charge_gain_up',
      name: '蝶引',
      description: '攻击充能提升'
    }
  ]
}

const hutao = new Hutao(hutaoOptions)
```

### 3. 角色特性

#### 双形态角色

**黄泉（Huangquan）**
- 开大招后自动进入雷神形态，持续5秒
- 雷神形态下攻击力提升50%
- 支持手动触发形态转换

```typescript
const huangquan = new Huangquan(options)

// 检查形态
if (huangquan.isThunderForm()) {
  console.log('处于雷神形态')
}

// 手动触发形态转换
huangquan.triggerTransform()
```

**芙宁娜（Furina）**
- 使用技能可以切换生命值形态
- 高生命形态：治疗效果
- 低生命形态：伤害提升

```typescript
const furina = new Furina(options)

// 切换形态
furina.toggleForm()

// 获取当前形态
const form = furina.getCurrentForm() // 'high' | 'low'
```

#### 特殊机制角色

**遐蝶（Xiadie）**
- 技能和重击消耗生命值
- 量子花雾被动：范围持续伤害

**卡芙卡（Kafka）**
- 触电效果系统
- 触电共鸣被动：触电伤害提升25%

**镜流（Jingliu）**
- 剑出无尘状态：攻击力提升，技能冷却缩短
- 冻伤效果系统

**万敌（Wandi）**
- 多杀系统：命中多个敌人时攻击力提升
- 可叠加2层，每层10%

### 4. 基础操作

```typescript
// 普攻
const lightDamage = character.attackLight()

// 重击
const heavyDamage = character.attackHeavy()

// 技能
const skillDamage = character.castSkill()

// 大招
const ultimateDamage = character.castUltimate()

// 跳跃
character.jump()

// 受伤
character.takeDamage(50)

// 检查被动
if (character.hasPassive('charge_gain_up')) {
  console.log('有充能提升被动')
}
```

### 5. 状态管理

```typescript
// 检查当前动作
const action = character.currentAction

// 检查是否在地面
const grounded = character.grounded

// 检查面向
const facing = character.facing // 1: 右, -1: 左

// 获取生命值百分比
const hpPercentage = (character.stats.hp / character.stats.maxHp) * 100
```

### 6. 资源清理

```typescript
// 清理定时器和资源
character.destroy()
```

## 扩展说明

### 添加新角色

1. 在对应游戏目录下创建新的角色类文件
2. 继承 `Character` 基类
3. 实现角色特有的技能和机制
4. 在对应的 `index.ts` 中导出
5. 在主 `index.ts` 中重新导出

### 角色配置

每个角色类都支持从配置文件加载数据，包括：
- 基础属性（生命值、攻击力、防御力等）
- 元素类型
- 被动技能
- 特殊机制参数

### 注意事项

1. 所有角色类都继承自 `Character` 基类
2. 双形态角色需要实现形态切换逻辑
3. 定时器资源需要在 `destroy()` 方法中清理
4. 角色特有的状态和机制应该封装在类内部
5. 支持从配置文件动态创建角色实例
