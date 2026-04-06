# better-sp（Superpowers 的改良分叉）

[English](./README.md) | [简体中文](./README.zh-CN.md)

`better-sp` 是基于 [obra/superpowers](https://github.com/obra/superpowers) 的实验性分叉，目标不是“重写一套技能文档”，而是修正我们在真实 agent 开发里反复遇到的几个编排问题：

- 主代理分配完子代理就硬等
- 让人类去选内部执行模式
- 共享写入范围一出现就把并行退化成空等
- refactor 被当成“继续打 feature patch”
- 项目记忆全塞进 `AGENTS.md`

这个仓库当前是一个 **fork / worktree 形态的实验层**，不是在宣称这些修改已经被 upstream 接受。

## Fork / 借鉴说明

**Fork 来源**
- 上游基线：[obra/superpowers](https://github.com/obra/superpowers)

**设计借鉴 / 灵感来源**
- [xhyqaq/superpowers-plus](https://github.com/xhyqaq/superpowers-plus) —— 单一执行入口与更轻量的编排体验
- Anthropic Claude Code 的 memory / subagent 模式 —— 记忆分层与有界上下文
- Google Gemini CLI 的 context / custom memory 模式 —— 渐进式披露与全局 / 项目分离

## 这个分叉想补什么

- `executing-plans` 作为**单一执行入口**
- 不再把“选内部执行模式”甩给用户
- `shared write scope -> 1 writer + readers`
- `spec != plan`
- `project-landscape-analysis`
- `refactor-mode`
- `engineering-knowledge-garden`
- `gardener-mode`

## 补充说明

- 自定义 skill 与体系说明（含必要提醒）：
  - `docs/better-sp-custom-skills-and-system.zh-CN.md`

## 特殊标注版流程图

图例：
- **蓝色**：upstream 已有的基线 skill / 流程节点
- **橙色**：better-sp 强化或新增的关键节点
- **绿色**：我们新增的知识沉淀闭环

```mermaid
flowchart TD
    A["用户请求"] --> R{"要不要先看外部参考？"}
    R -- "要" --> S["project-landscape-analysis"]
    R -- "不要" --> B{"当前是哪类工作？"}
    S --> B
    B -- "行为不清晰" --> C["brainstorming"]
    B -- "行为冻结但结构混乱" --> D["refactor-mode"]
    B -- "已足够明确" --> E["writing-plans"]
    C --> E
    D --> E
    E --> F["executing-plans"]
    F --> G["direct"]
    F --> H["sidecar"]
    F --> I["parallel"]
    F --> J["high-assurance serial<br/>1 writer + readers"]
    G --> K["requesting-code-review"]
    H --> K
    I --> K
    J --> K
    K --> L["finishing-a-development-branch"]
    L --> M["engineering-knowledge-garden"]
    S --> N["archive brief"]
    N --> O["guidance brief"]
    O --> C
    O --> E
    M --> P["distilled evergreen entries"]
    P --> E
    P --> F
    P --> K
    Q["gardener-mode"] --> M

    classDef upstream fill:#e8f1ff,stroke:#4f7cff,color:#123;
    classDef custom fill:#fff1e8,stroke:#ff8a3d,color:#432;
    classDef garden fill:#ebfff1,stroke:#27ae60,color:#123;

    class A,B,C,E,G,H,I,K,L upstream;
    class S,D,F,J,Q custom;
    class M,N,O,P garden;
```

## 工作流总览

```mermaid
flowchart TD
    A["用户请求"] --> R{"要不要先看外部参考？"}
    R -- "要" --> S["project-landscape-analysis<br/>研究 + 归档 + 压缩指引"]
    R -- "不要" --> B{"当前到底是哪类工作？"}
    S --> B
    B -- "行为 / 产品形态还不清楚" --> C["brainstorming<br/>产出可 review 的 spec"]
    B -- "行为冻结但结构很乱" --> D["refactor-mode<br/>产出 refactor brief"]
    B -- "需求已足够明确" --> E["writing-plans<br/>产出 orchestration plan"]
    C --> E
    D --> E
    E --> F["executing-plans<br/>唯一执行入口"]
    F --> G["direct 本地执行"]
    F --> H["sidecar 只读辅助"]
    F --> I["parallel writers<br/>仅限写入范围真正隔离"]
    F --> J["high-assurance serial<br/>1 writer + readers"]
    G --> K["requesting-code-review"]
    H --> K
    I --> K
    J --> K
    K --> L["finishing-a-development-branch"]
    L --> M["批量沉淀 / 蒸馏 durable lessons"]
```

## Research -> Archive -> Distilled Garden 闭环

```mermaid
flowchart LR
    A["外部同类研究"] --> B["project-landscape-analysis"]
    B --> C["完整研究 brief"]
    B --> D["压缩 guidance brief"]
    C --> E["archive/landscapes/<br/>可检索，但不直接塞 prompt"]
    D --> F["brainstorming / writing-plans"]
    F --> G["真实实现 + review"]
    G --> H{"有经受住压力的可复用结论吗？"}
    H -- "有" --> I["distill 成小型 evergreen entries"]
    H -- "没有" --> J["只保留 archive brief"]
    I --> K["patterns / pitfalls / decisions / recipes"]
    K --> L["后续规划 / 执行 / review 时做有界查询"]
    K --> M["gardener-mode<br/>validate + audit + prune"]
    N["可选全局只读 garden"] --> L
```

## 闭环活样本

当前分支里已经有一份真实样本：

- Archive brief：
  - `docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md`
- Distilled entries：
  - `docs/engineering-knowledge-garden/decisions/keep-research-archives-separate-from-evergreen-garden-entries.md`
  - `docs/engineering-knowledge-garden/agent-optimizations/use-one-execution-entry-and-route-internally-by-task-metadata.md`

这个样本体现的边界是：
- 完整对比留在 archive
- 下游只吃压缩 guidance
- 真正经受住实现 / review 压力的结论，再提升成 evergreen entry

## Artifact 边界

| Artifact | 作用 | 给谁看 | 是否应该继续往下游传 |
|---|---|---|---|
| Spec | 人类 review 工件 | 人类 + controller | 是 |
| Plan | orchestration 工件 | controller + implementer | 是 |
| Archive brief | 完整研究 / 对比记录 | 人类 + 后续检索 | **否**，只传文件路径 |
| Guidance brief | Borrow / Avoid 压缩摘要 | 下游设计 / 规划 | 是 |
| Garden entry | 小而耐用的工程知识 | 后续规划 / 执行 / review | 是，但必须有界加载 |

## 它和原版相比，核心差异是什么

### 1. 不再默认“派一个子代理然后硬等”

`executing-plans` 不应该把子代理当成用户可见模式，而应该把它当成**内部路由策略**。

目标行为：
- 有本地可做的 controller 工作，就先做
- 有只读 sidecar 能并行，就先并行
- 只有真正阻塞时才等待

### 2. 共享写入范围时，不是假并行，而是 **1 writer + readers**

一旦真实写入范围收敛到同一组文件：
- 不再继续多 writer 乱写
- 也不该让 controller 直接空等
- 正确退化方式是：**单 writer + 只读 explorer / verifier / reviewer**

### 3. `spec` 和 `plan` 明确分离

- **spec**：给人 review，用来确认“要做什么”
- **plan**：给 agent 编排，用来确认“怎么拆、谁能并行、哪儿会冲突、如何验证”

### 4. `refactor-mode` 把“结构收口”从 feature patch 流里拆出来

refactor 不是“继续写功能，只是顺手清理一下”。

它需要先冻结行为，再产出：
- Frozen Behavior
- Target Shape
- Seam Map
- Migration Order
- Temporary Scaffolding

### 5. `engineering-knowledge-garden` 负责项目记忆，别再污染 `AGENTS.md`

项目知识应该：
- 小
- 可检索
- 有触发条件
- 有证据
- 可以验证

而不是把所有东西都塞进一个永远越长越乱的 `AGENTS.md`。

## 这版新增 / 强化的知识花园能力

- 支持 **archive-create**：先把完整研究 brief 归档
- 支持 **search-archive**：回查历史研究，而不是重新联网再搜一遍
- 支持 **distill**：把 archive 中真正耐用的结论蒸馏成 evergreen entry
- `audit` 会额外检查 **archive backlog**
- `validate --include-archive` 可以同时校验 archive 与 evergreen entry 结构

## 主要技能变化

1. **project-landscape-analysis**  
   先做 bypass check；优先二手分析而不是直接啃 repo；完整研究进入 archive，只把 guidance brief 传下游。

2. **brainstorming**  
   只在真的需要澄清行为时问问题，不再为了“显得严谨”强行问题循环。

3. **refactor-mode**  
   行为冻结 + 结构收口的独立入口。

4. **writing-plans**  
   plan 是 orchestration artifact，要写清 write scope、冲突、验证、路由建议、Knowledge Inputs。

5. **executing-plans**  
   单一执行入口；内部决定 direct / sidecar / parallel / high-assurance-serial。

6. **engineering-knowledge-garden**  
   负责 lookup / archive / distill / capture / prune。

7. **gardener-mode**  
   独立维护模式；负责 validate、audit、archive backlog 收口、重复项与陈旧项治理。

## 压测过的行为

这版 fork 明确围绕这些失败模式做过 pressure test：

- 不再默认 spawn 一个子代理就 wait
- 不再让人类选择内部执行模式
- shared write scope 会退化成 **1 writer + readers**
- refactor 不再被混进 feature patch 流

参考：
- `docs/superpowers/evals/2026-04-06-better-sp-routing-pressure-test.md`
- `docs/superpowers/specs/2026-04-06-engineering-knowledge-garden-design.md`

## 安装

安装方式仍然沿用 Superpowers 原有平台分发方式：

- Claude Code / Cursor：插件市场
- Codex：看 `docs/README.codex.md`
- OpenCode：看 `docs/README.opencode.md`
- Gemini CLI：扩展安装

平台细节请优先看英文 README 与对应安装文档。

## 仓库说明

- 这个分支 / worktree 基于 `obra/superpowers`
- 目标是先把真实痛点修顺，再考虑是否拆分出可 upstream 的小 PR
- 如果后面要往 upstream 回推，应该拆成**小而有证据**的 PR，而不是一坨“大 fork dump”

## License

MIT License - see `LICENSE`
