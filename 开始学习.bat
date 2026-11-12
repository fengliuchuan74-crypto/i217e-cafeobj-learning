@echo off
chcp 65001 >nul
title I217E 関数プログラミング(E) · 本地学习系统
echo ============================================================
echo   I217E CafeOBJ 函数式程序设计 · 本地交互学习系统
echo ============================================================
echo.
echo   正在用默认浏览器打开学习系统...
echo   如果没自动打开，请手动双击本目录下的 index.html
echo.
echo   提示：
echo     - 学完一节后点「我学会了这一节」，进度会保存
echo     - 代码块点「运行」可以真的执行 CafeOBJ 代码
echo     - 右上角显示距离考试的天数
echo.
start "" "%~dp0index.html"
timeout /t 3 >nul
