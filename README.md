# I217E 関数プログラミング(E) — CafeOBJ Interactive Learning System

**▶ Live demo / デモ / 在线版: <https://fengliuchuan74-crypto.github.io/i217e-cafeobj-learning/>**

A self-contained, offline, interactive study system for the JAIST course **I217E 関数プログラミング(E)**
(*Functional Programming*, algebraic specification & term rewriting with **CafeOBJ**).

No build step, no server, no dependencies: open `index.html` and it runs.
The key feature is an **embedded term-rewriting engine** that actually executes the course's CafeOBJ
modules in the browser — every code block in the lessons is runnable, with step-by-step reduction traces.

[English](#english) · [日本語](#日本語) · [中文](#中文)

---

## English

### What it is

Course material for I217E is normally taught with the CafeOBJ system: you write equations, and the
system rewrites terms to normal forms; you then prove properties by structural induction ("proof scores").
This project turns that into a **single-page interactive study tool**, so a learner can read a concept,
run the code immediately, watch each rewrite step, and test themselves — without installing anything.

### Contents

| Part | Chapters |
|---|---|
| Orientation | **L0** what the course is about, how to read CafeOBJ code, exam format |
| Foundations | **L1** sorts / operators / terms / equations ・ **L2** modules, order-sorted sorts, lists ・ **L3** term rewriting (positions, redex, E-strategy, AC matching) |
| Data structures | **L4** parameterized modules & views ・ **L5** tables ・ **L6** infinite lists ・ **L7** multisets |
| Language processors | **L8** interpreter ・ **L9** virtual machine ・ **L10** compiler (with backpatching) |
| Verification | **L11** induction over naturals ・ **L12** induction over lists ・ **L13** verification of quantum teleportation ・ **L14** proof assistant (CITP) |
| Exam prep | syntax cheat-sheet, five answer templates, two mock exams, last-24-hours checklist |
| Homework | **HW1–HW14**, each with hints, collapsible reference answers, self-check quizzes, and an auto-saved draft pad |

Scale: **17 chapters / 90 sections / 63 quiz & flashcard sets / 33 runnable code blocks / 16 interactive widgets.**

### Four interactive features

1. **▶ Run** — executes the snippet in the built-in engine and shows every rewriting step, the result and its sort.
2. **Reduction player** — replays a term's rewriting frame by frame: which equation fired, and at which position (`ε`, `2.1`, …).
3. **Strategy comparator** — runs the same term under two E-strategies side by side, so it is visible why
   `strat: (1 0)` on infinite lists gives laziness and why removing it diverges.
4. **Quantum simulator** (L13) — apply H / CX / X / Z gates and watch the actual amplitudes; a 5-step
   teleportation walkthrough that verifies all four measurement branches recover the original state.

Also: per-section "I learned this" progress, wrong answers enter a 1→3→7→21-day spaced-repetition queue,
and an exam countdown.

### Engine scope and limitations

Implemented: order-sorted sort lattice with overload resolution by least rank, `assoc` / `comm` / `id:`
with a backtracking AC matcher, E-strategy interpretation, conditional equations, `open/close/red` sessions,
and proof scores (fresh constants + induction hypothesis as an equation).

Not implemented: **parameterized modules (`mod*`) and views are not executed** (that needs full module-expression
evaluation). L4/L5 are taught with diagrams plus hand-instantiated equivalent modules, and the lesson text says so.
A few printing details differ slightly from official CafeOBJ 1.5.9 (e.g. an extra layer of parentheses); semantics agree.
Where official CafeOBJ is available, the snippets can be pasted there unchanged.

### Running it

- Any OS: open `index.html` in a browser — **this is the recommended way, no prompts**.
- Windows: double-click `打开学习系统.url` (a plain shortcut to `index.html`), or `开始学习.bat`.
  A `.bat` may trigger the Windows dialog *“Open File — Security Warning: the publisher could not be verified”*,
  because batch files carry no digital signature. It is a routine prompt, not a virus: click **Run**, or just open
  `index.html` / the `.url` shortcut instead.
- Or use the hosted version: <https://fengliuchuan74-crypto.github.io/i217e-cafeobj-learning/>

Progress, quiz history and homework drafts are stored in the browser's `localStorage`; nothing is sent anywhere.

### Language note

The **learning content is written in Chinese**, with all technical terms kept in English (sort, operator,
term, redex, E-strategy, proof score, …), since it was built as personal study material for exam preparation.
The engine, the code and this README are language-neutral / English.

### Verification

All 33 runnable snippets are regression-tested in Node (execute, then check every `red` result and error):

```js
node _build/verify_content.js     // => FAILED: 0
```

---

## 日本語

JAIST **I217E 関数プログラミング(E)**（CafeOBJ による代数仕様・項書き換え）の**オフライン対話型学習システム**です。

- ビルド・サーバ・依存関係は不要。`index.html` を開くだけで動作します（Windows では `打开学习系统.url` か `开始学习.bat` をダブルクリック。`.bat` は署名がないため Windows の「発行元を確認できません」警告が出ることがありますが、無害です。「実行」を押すか、`index.html` を直接開いてください）。
- ブラウザ内に**項書き換えエンジンを内蔵**しており、講義で扱う CafeOBJ のモジュールを**実際に実行**できます。
  各コードブロックは「▶ 実行」で動き、書き換えの各ステップ（どの等式がどの位置で適用されたか）を表示します。
- 内容は L0（導入）から L14（証明支援系 CITP）までの全 14 回分＋期末対策＋宿題 HW1–HW14。
  項書き換え（E-strategy、AC マッチング）、無限リスト、多重集、Minila のインタプリタ／VM／コンパイラ、
  構造帰納法による証明スコア（自然数・リスト・量子テレポーテーションの検証）を扱います。
- 制限: `mod*` パラメータ化モジュールと view は実行対象外（L4/L5 は図と等価な手書きインスタンス化モジュールで解説）。
- **本文は中国語**（技術用語は英語表記）で書かれています。個人の試験対策ノートとして作成したためです。

---

## 中文

JAIST **I217E 関数プログラミング(E)**（CafeOBJ / 代数规格与项重写）的**离线交互式学习系统**。
纯前端、零依赖、双击即用：浏览器里能**真的执行 CafeOBJ 代码**（内置教学用重写引擎），并配套随堂测验、闪卡、间隔复习、作业系统与两套模拟卷。

> 在线版：<https://fengliuchuan74-crypto.github.io/i217e-cafeobj-learning/>
> 本地：双击 `index.html`（任意系统，不弹任何提示）或 `打开学习系统.url`（Windows）；
> `开始学习.bat` 可能触发 Windows 的「无法验证发布者」安全警告——批处理脚本没有数字签名，属例行提示，点「运行」即可，或改用上面两种方式。

### 打开时弹「安全警告」怎么办

双击 `开始学习.bat` 出现 *「打开文件 - 安全警告 / 无法验证发布者」* 时：这是 Windows 对未签名 `.bat` 的例行提示，不是病毒。
① 直接双击 `index.html` 或 `打开学习系统.url`（不会弹）；② 或点「运行(R)」，只弹一次；③ 或右键 `.bat` → 属性 → 勾选「解除锁定」。

### 内容覆盖

| 部分 | 章节 |
|---|---|
| 导学 | **L0** 这门课在讲什么、如何读代码、考试形式 |
| 基础 | **L1** 排序·算子·项·等式 ・ **L2** 模块·阶排序·列表 ・ **L3** 项重写（位置 / redex / E-strategy / AC 匹配） |
| 进阶 | **L4** 参数化模块与 view ・ **L5** 表 ・ **L6** 无限列表 ・ **L7** 多重集 |
| 语言处理器 | **L8** 解释器 ・ **L9** 虚拟机 ・ **L10** 编译器（含回填） |
| 验证 | **L11** 自然数归纳证明 ・ **L12** 列表归纳证明 ・ **L13** 量子隐形传态的验证 ・ **L14** 证明助手（CITP） |
| 考前 | 语法速查表 ・ 5 个答题模板 ・ 模拟卷 A / B ・ 考前 24 小时清单 |
| 作业 | **HW1 – HW14**，每题含提示、折叠参考答案、自检题与自动保存的草稿本 |

规模：**17 章 / 90 节 / 63 组测验与闪卡 / 33 个可运行代码块 / 16 个交互组件**。

### 四个核心交互

1. **▶ 运行** — 每个代码块都能在浏览器里真跑，显示逐步归约、结果与排序。
2. **归约播放器** — 逐帧回放项重写：哪一步、用了哪条等式、替换在哪个位置（`ε`、`2.1` …）。
3. **策略对比器** — 同一项在两种 E-strategy 下并排执行，直观看到 `strat: (1 0)` 如何实现惰性、去掉后如何发散。
4. **量子模拟器**（L13）— 点 H / CX / X / Z 门观察真实振幅变化；隐形传态 5 步演示，自动校验四种测量情形均恢复原态。

配套：每节「我学会了这一节」记录进度、答错自动进入 1→3→7→21 天间隔复习队列、考试倒计时。

### 内置引擎支持的模块

`BOOL` `BOOL-IF` `NAT` `NAT-ERR` `NAT-IF` `NATLIST` `FACT` `OEDC-FACT` `GCD` `QSORT`
`ERATOSTHENES-SIEVE(-FIN)` `NAT-TRIPLE-IMLM/-OMLM` `INF-LIST` `NAT-INF-LIST` `HAMMING`
`QID` `QID-NAT-PAIR` `PNAT1` `PNAT2` `PNAT3` `LIST1` `LIST2` `MULTISET-NAT` `MULTISET-PAIR`

引擎实现：排序格（含子排序与重载 rank 解析）、`assoc/comm/id:` 的 AC 匹配（回溯式匹配器）、
E-strategy 解释、条件等式、`open/close/red` 会话、证明分数（新常量 + IH 等式）。

### 已知限制

- `mod*` **参数化模块与 view 不执行**（需要完整的模块表达式求解）。L4/L5 以图文 + 手工实例化的等价模块讲解，课文中有明确标注。
- 少数打印格式与官方 CafeOBJ 1.5.9 有细微差异（例如 `('a,1)` 多一层括号），语义一致。
- 有官方 `CafeOBJ159` 时，可把系统中的代码原样粘进去对照运行。

### 目录结构

```
index.html            入口（脚本按序加载，无构建）
css/style.css         深色主题样式
js/engine.js          CafeOBJ 子集：词法/语法/AC 匹配/E-strategy/归约/内置模块
js/widgets.js         交互组件（项树、归约播放器、格图、策略对比、列表演示、Minila）
js/mounts.js          组件挂载表 + 量子态模拟器
js/quiz.js            进度存储、弹窗测验、闪卡、间隔复习
js/content-core.js    L0–L5 内容与测验
js/content-mid.js     L6–L10 内容与测验
js/content-adv.js     L11–L14 + 期末冲刺
js/homework.js        HW1–HW14 作业系统
js/app.js             导航、路由、进度、倒计时、挂载
学习指南.md            课程导览 + 19 天学习计划 + 分数策略 + 易错清单
开始学习.bat           Windows 一键启动
```

### 自检

内容文件中的 33 个可运行代码块均通过 Node 回归（每块执行并检查 `red` 结果与错误），全部通过。

---

## 免责声明 / Disclaimer

本项目为个人学习笔记与教学演示，**非官方教材**，与课程方无关。
讲义结构参考 JAIST I217E（担当：緒方和博 教授）的课程大纲；所有讲解文字、可视化组件与引擎实现均为本仓库原创。
**课程原始讲义与 PDF 不在本仓库内**（已在 `.gitignore` 中排除）。如涉及课程材料版权问题，请联系仓库所有者删除。

This is unofficial personal study material, not affiliated with the course. All prose, visualizations and the
engine implementation are original work of this repository; the lecturer's original slides and PDFs are **not**
included. Please contact the repository owner for any takedown request.
