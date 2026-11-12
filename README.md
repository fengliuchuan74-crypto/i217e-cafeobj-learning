# I217E 関数プログラミング(E) · CafeOBJ 交互学习系统

JAIST **I217E 関数プログラミング(E)**（CafeOBJ / 代数规格与项重写）的**离线交互式学习系统**。
纯前端、零依赖、双击即用：浏览器里能**真的执行 CafeOBJ 代码**（内置教学用重写引擎），并配套随堂测验、闪卡、间隔复习、作业系统与两套模拟卷。

> A self-contained, offline, interactive study system for the JAIST course *I217E Functional Programming (CafeOBJ)*.
> No build step, no server, no dependencies — open `index.html` and it runs. Includes an embedded term-rewriting engine that executes the course's CafeOBJ modules for real.

---

## 快速开始 / Quick start

```
双击  开始学习.bat        (Windows)
或直接双击  index.html    (任意浏览器)
```

无需联网、无需安装 CafeOBJ。进度、答题记录、作业草稿保存在浏览器 `localStorage`。

---

## 内容覆盖 / Coverage

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

---

## 四个核心交互 / Interactive features

1. **▶ 运行** — 每个代码块都能在浏览器里真跑，显示逐步归约、结果与排序。
2. **归约播放器** — 逐帧回放项重写：哪一步、用了哪条等式、替换在哪个位置（`ε`、`2.1` …）。
3. **策略对比器** — 同一项在两种 E-strategy 下并排执行，直观看到 `strat: (1 0)` 如何实现惰性、去掉后如何发散。
4. **量子模拟器**（L13）— 点 H / CX / X / Z 门观察真实振幅变化；隐形传态 5 步演示，自动校验四种测量情形均恢复原态。

配套：每节「我学会了这一节」记录进度、答错自动进入 1→3→7→21 天间隔复习队列、考试倒计时。

---

## 内置引擎支持的模块 / Built-in modules

`BOOL` `BOOL-IF` `NAT` `NAT-ERR` `NAT-IF` `NATLIST` `FACT` `OEDC-FACT` `GCD` `QSORT`
`ERATOSTHENES-SIEVE(-FIN)` `NAT-TRIPLE-IMLM/-OMLM` `INF-LIST` `NAT-INF-LIST` `HAMMING`
`QID` `QID-NAT-PAIR` `PNAT1` `PNAT2` `PNAT3` `LIST1` `LIST2` `MULTISET-NAT` `MULTISET-PAIR`

引擎实现：排序格（含子排序与重载 rank 解析）、`assoc/comm/id:` 的 AC 匹配（回溯式匹配器）、
E-strategy 解释、条件等式、`open/close/red` 会话、证明分数（新常量 + IH 等式）。

### 已知限制 / Limitations

- `mod*` **参数化模块与 view 不执行**（需要完整的模块表达式求解）。L4/L5 以图文 + 手工实例化的等价模块讲解，课文中有明确标注。
- 少数打印格式与官方 CafeOBJ 1.5.9 有细微差异（例如 `('a,1)` 多一层括号），语义一致。
- 有官方 `CafeOBJ159` 时，可把系统中的代码原样粘进去对照运行。

---

## 目录结构 / Layout

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

---

## 自检 / Verification

内容文件中的 33 个可运行代码块均通过 Node 回归（每块执行并检查 `red` 结果与错误）：

```js
// 加载 engine + 全部 content 文件，提取每个 <pre> 源码并 runScript
node _build/verify_content.js     // FAILED: 0
```

---

## 免责声明 / Disclaimer

本项目为个人学习笔记与教学演示，非官方教材。讲义结构参考 JAIST I217E（担当：緒方和博 教授）课程大纲；
所有讲解文字、可视化组件与引擎实现均为本仓库原创。课程原始讲义与 PDF 不在本仓库内。
如涉及课程材料版权问题，请联系仓库所有者删除。
