# better-sp：自定义 Skill 与体系说明（含必要提醒）

本文档用于说明 **better-sp 相对 upstream superpowers 的新增 / 强化部分**，以及使用这套 fork 时必须知道的边界与提醒。

## 先说清楚：这不是“另起炉灶”

better-sp 不是脱离 [obra/superpowers](https://github.com/obra/superpowers) 重新发明的一套体系，而是：

- 以 upstream superpowers 为基底
- 针对真实使用中的编排痛点做增强
- 增加少量新的 workflow skill
- 调整部分 skill 的衔接关系与 artifact 边界

所以更准确的说法是：

> **这是一个 fork-specific workflow layer，不是对 upstream 来源的抹除。**

## 我们这套 fork 主要解决什么

这套体系重点在修这些问题：

1. 主代理分配子代理后容易**硬等**
2. 把“内部执行模式选择”暴露给人类，导致**多一步无意义决策**
3. 发现 shared write scope 后，要么假并行，要么直接空等，缺少 **1 writer + readers** 的自然退化
4. refactor 被混在 feature patch 流里，长期导致 **TDD patch pile**
5. 项目知识沉淀路径错误，什么都往 `AGENTS.md` 塞，形成 **context landfill**

## 我们新增 / 强化了哪些核心 Skill

### 1. `project-landscape-analysis`

作用：
- 在 greenfield / 新子系统 / 高代价架构决策之前，先做外部借鉴

关键变化：
- 先做 bypass check
- 优先二手总结 / 架构拆解，而不是直接深啃 repo
- 输出拆成两层：
  - **完整 archive brief**
  - **压缩 guidance brief**

必要提醒：
- 它不是“随便搜几个 repo 然后编对比表”
- 不要把大段研究结果直接塞给后续实现 prompt
- 没证据的维度要标 `unknown`

---

### 2. `refactor-mode`

作用：
- 把“结构收口”从 feature workflow 里拆出来

关键变化：
- 先冻结行为，再做结构调整
- 产物是 **refactor brief**，不是直接开写

必要提醒：
- refactor 不是“顺手清理一下”
- 如果行为目标还没稳定，别用 refactor-mode，先回 brainstorming
- refactor brief 里必须明确 temporary scaffolding 的删除时机

---

### 3. `executing-plans`

作用：
- 成为**单一执行入口**

关键变化：
- 不再让用户选择：
  - routed subagents
  - inline execution
  - subagent-driven
  这类内部模式
- 控制器自己根据 plan metadata 路由

必要提醒：
- 它是内部调度器，不是用户菜单
- 真正阻塞前，不应该默认先 `wait`
- 一旦运行期发现 write scope 和计划不一致，应当重路由，而不是硬执行原计划

---

### 4. `engineering-knowledge-garden`

作用：
- 取代把项目知识胡乱塞进 `AGENTS.md` 的做法

关键变化：
- 区分：
  - **archive brief**
  - **guidance brief**
  - **evergreen garden entry**
- 支持：
  - lookup
  - archive
  - distill
  - capture
  - prune

必要提醒：
- archive 不是 evergreen
- raw notes 不是 evergreen
- transcript 不是 evergreen
- 只有经受过实现 / review 压力后仍然成立的结论，才该 distill

---

### 5. `gardener-mode`

作用：
- 独立维护知识花园

关键变化：
- 不把 prune / distill / cleanup 强塞进日常 feature 热路径

必要提醒：
- 它应该降低熵，不应该制造新的上下文噪音
- 不要用它做“批量洗稿式改写”
- 应优先做 reviewable diff，而不是静默大改

## 我们这套体系里几个最重要的边界

### 边界 1：`spec != plan`

- **spec** 是给人 review 的
- **plan** 是给 agent orchestration 的

必要提醒：
- 不要把一堆执行细节塞进 spec
- 不要把需要人确认的产品/行为问题塞进 plan

---

### 边界 2：`archive != evergreen`

- **archive**：完整研究、完整对比、完整背景
- **evergreen**：小、稳、可触发、可复用

必要提醒：
- “有价值” 不等于 “应该立刻进 garden”
- 先 archive，再 distill，别反过来

---

### 边界 3：`human-facing choice != internal routing choice`

用户应该决定的是：
- 做不做
- 目标是什么
- 风险能否接受

而不是：
- 这步是 subagent-driven 还是 parallel
- controller 什么时候 wait
- review 用哪种内部策略

必要提醒：
- 这些属于控制器内部编排问题
- 不要把内部路由不确定性转嫁给用户

---

### 边界 4：`parallel != multiple writers by default`

并行的前提是：
- 写入范围真正隔离

必要提醒：
- 发现 shared write scope 后，正确降级方式是：
  - **1 writer + readers**
- 不要继续多 writer
- 也不要直接退化成 controller 空等

## 必要提醒（强烈建议保留）

### 1. 这套 fork-specific skill 不是 upstream 官方行为

如果以后要往 upstream 提 PR：
- 不要一股脑整包上推
- 应拆成小 PR
- 每个 PR 都要有独立问题陈述与 evidence

### 2. Skill 不是普通 prose，它会直接塑造 agent 行为

所以：
- 改 wording 不是“润色”
- 改流程图不是“美化”
- 改 red flags / rationalization table 不是“整理格式”

这些都可能改变代理行为。

### 3. 没有压力测试的行为修改，不应被轻易当成“优化”

特别是这些部分：
- routing
- review gate
- subagent handoff
- memory / lookup / capture

都应该尽量有：
- baseline failure
- 修改后验证
- 最好有真实 transcript / eval

### 4. 不要把 AGENTS.md 再次变成垃圾场

`AGENTS.md` 最多应该只保留：
- 短规则
- 入口指针
- 极高优先级约束

不要再往里面堆：
- 长记忆
- 项目琐碎知识
- 研究笔记
- 过程性日志

### 5. 不要为了“显得严谨”而制造额外流程成本

几个典型反模式：
- 明明 spec 已清晰，还无限追问
- 明明 archive 只是参考，还强行全量注入 prompt
- 明明 shared write scope 已确定，还硬拆多 writer
- 明明是结构收口，却继续走 feature patch 路径

## 推荐你把它当成什么来维护

更合适的心态是：

> 把 better-sp 当成一个**实验性 workflow fork + evidence-driven orchestration layer**

而不是：

> “我们已经发明了一套完全独立、可以随便往 upstream 替换的标准体系”

## 当前最值得长期坚持的原则

1. **先证明问题，再改 skill**
2. **先分清 artifact，再传递上下文**
3. **先控制 write scope，再谈并行**
4. **先 archive，再 distill**
5. **先 evidence，再宣传‘优化’**

## 对外说明时的推荐表述

如果以后你要对别人介绍这套 fork，推荐这样说：

> better-sp 是基于 superpowers 的一个 fork，重点增强了执行编排、refactor workflow、外部借鉴 intake、以及工程知识花园这几个方向。它不是要替代 upstream 的全部哲学，而是把我们在真实 agent 开发中遇到的调度与记忆问题，整理成一套更顺手的 workflow layer。
