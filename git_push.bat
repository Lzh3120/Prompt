@echo off
REM ------------------------------------------
REM 脚本名称: git_push.bat
REM 功能: 添加、提交并推送到远程仓库
REM 放置位置: Git 仓库根目录
REM ------------------------------------------

echo.
echo =========================================
echo Git 提交和推送脚本
echo =========================================
echo.

REM 提示用户输入提交信息
set /p commit_message="请输入本次提交信息 (Commit Message): "

if "%commit_message%"=="" (
    echo.
    echo !!! 错误：提交信息不能为空。操作已取消。
    echo.
    goto :end
)

echo.
echo ------------------------------------------
echo 1. 添加所有修改到暂存区 (git add .)
echo ------------------------------------------
git add .
if %errorlevel% neq 0 (
    echo !!! Git add 失败。
    goto :end
)

echo.
echo ------------------------------------------
echo 2. 提交修改 (git commit -m "%commit_message%")
echo ------------------------------------------
git commit -m "%commit_message%"
REM 检查 commit 的退出码。注意：如果没有新修改，commit 也会返回非0，但可以忽略。
if %errorlevel% neq 0 (
    REM 尝试检查是否有 'nothing to commit' 的情况 (这个检查在纯批处理中比较复杂，这里简化处理)
    REM 如果是真正的错误，需要用户手动查看。
    echo !!! Git commit 可能有警告或错误，但将尝试继续推送。
)

echo.
echo ------------------------------------------
echo 3. 推送到远程仓库 (git push)
echo ------------------------------------------
git push
if %errorlevel% neq 0 (
    echo.
    echo ------------------------------------------
    echo !!! Git 推送失败 !!!
    echo 请检查网络连接或远程仓库权限。
    echo ------------------------------------------
) else (
    echo.
    echo ------------------------------------------
    echo Git 提交和推送成功!
    echo ------------------------------------------
)

:end
echo.
pause