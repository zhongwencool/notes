---
title: GitHub Pull Request入门
subtitle: 小老弟，怎么回事？年纪轻轻想混GitHub圈！
description: Pull Request实例,Pull Request例子,Pull Request入门,PR例子,PR流程,PR指南,PR手册
date: 2018-11-28
layout: default
category: 工具
---

编程的乐趣是什么？[人的成就感来源于两样东西，创造与毁灭](https://www.zhihu.com/question/20029839/answer/13732329)。

没有什么能比用一个伟大的Pull Request(PR)展示自己炉火纯青的编码功力，更让人着迷。本文将详细介绍创建Pull Request时应该要掌握的知识。

文未的[实战环节](#practice)，会一步步指引你提交PR把自己的名字署在文末，快来完成自己的第一个PR吧~

### 如何挑选项目(Finding)

有部分人会止步于找不到适合自己的项目，而迟迟不动手。其实多关注平时项目使用的第三方库，就可能会发现测试/文档还可以更完善，更进一步还可以为它改进/增添新功能。这些可以把你从围观者逐渐变成一个推动者。当然，参与开源项目应该是一个完全自然且合乎逻辑的过程，发现一个认为能它变得更好的地方，优化它。如果你从来不使用其他人的项目，可能你才刚开始编程，继续练习，将来一定会尝试使用更多开源项目的。

### 先问(Asking)

当你为项目找到一个非常值得添加的功能时，不要迫不及待地把代码clone下来，然后一顿操作后，发起PR。可能别人也想到(或者更好的方案)，并且已经在为之努力，又或者维护者有不想加入这个特性的其它考虑。所以为了保证自己不白费心劳力，可以在已有的issues中找找相关内容的讨论。如果没有，可以新建issue来讨论这个需求，提问的过程也可以帮助自己理清思路。

当你找到一个明确bug时，可以直接尝试提交PR来修复它。

如果你只是单纯非常欣赏一个项目，就是想为它贡献代码！可以在issue找些感兴趣的任务，或者直接问维护者有什么可以帮忙的。

### 明确的分支名(Branch)

明确可以贡献代码后，fork项目，然后clone到本地，后在master上创建一个新的分支(branch)。好处：

* 确保你的分支语义明确，一看就大概明白你用它来完成什么。
* 后续可以更好的和master同步代码。

例如：

```shell
nodes/atom_improvements 
scheuduler/dirty_scheuduler_collapse
kernel/clean-history-shell
```

### 提交日志(Commit Message)

日志(Commit Message)要尽量避繁就简，[这可以让你的PR更容易被人理解和接受](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)。

* 首行总结要尽量少于50字符。
* 附加的更详细的说明，保持宽度在72字符左右。
* 使用“Fix bug"代替”Fixed bug"或“Fixes bug"。
* 多使用列表说明问题。

### 代码礼仪(Code Standard)

每个人都会有自己的代码风格，到底是用制表符(Tab)还是空格(Space)？每行是80字符还是120字符？这种圣战不应该在PR中出现，PR应该遵循项目已有的风格。例如：如果原来使用的驼峰命名变量，PR中就应该使用驼峰命名。

### 整理日志(Rebase)

`git rebase`是一个让你可以改变历史的命令！通过它轻易地重新排列，编辑或合并历史日志。

* 编辑以前提交过的日志。
* 把多条日志合并成一条日志。
* 删除或回滚一些不必要的日志。

例如：有时图个方便，会把代码分阶段性提交，到真正完成时，希望Review的人看到是最终的结果。

```shell
git commit -am "Add Account Form"
git commit -am "Add Passwd Form"
git commit -am "Add Verification Code Form"
```

你需要把上面的都合并成一条提交日志。可以使用**rebase**功能。

```shell
git rebase -i HEAD~3
```

* `-i`表示打开交互模式(*interactive mode*)。
* `HEAD~3`表示检查最近3条日志。
* 输入的数字过大会导致`fatal: Need a single revision`错误，可以减小数字。

随后会通过默认的编辑器(一般是vi)打开一个文本：

```shell
pick cee46ac Add Verification Code Form
pick 5dd4924 Add Passwd Form
pick 27dc5ce Add Account Form

# Rebase 925891e..cee46ac onto 925891e (3 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

需要重点关注的是前3行，后面带**#**的是注释说明，不会出现在日志中。默认是pick选项，就是保持此条日志不变，其它选项可以看上面的注释，我们的目标是把3条合成一条，并修改日志内容。所以可以使用到*f(fixup)*与*r(reword)*选项。最终效果如下。

```shell
r cee46ac Add Verification Code Form
f 5dd4924 Add Passwd Form
f 27dc5ce Add Account Form
```

保存后，会直接再弹出一个文本编辑器用于重写日志内容：*Add login UI.*

[关于rebase各种选项的详细说明](https://help.github.com/articles/about-git-rebase/#commands-available-while-rebasing)。

### 提交变更(Submit PR)

当所有的commit都准备好时，就可以在网页上选择对应的分支创建PR。最后检查一下

* 标题，描述是否简洁清晰？
* 如果改动是可见的，是否需要附上一个截图或gif说明？
* 想PR被合并后自动关闭对应的issue，可以在描述的结尾加上一行<u>Closes #issue编号</u>。

如果PR改动很大，你想边改边得到别人及时的反馈，可以先创建PR后，在标题上加上**[WIP]**是Work In Progress的缩写，表示工作还未完成。但尽量不要把未完成的PR提交到别人的项目上(可能会引起别人反感)，通常**WIP**的PR都是自己的项目里面使用就行了。

<span id="practice"></span>

### 审查/合并(Review/Merge)

PR提交后，维护者会对它进行逐行的审查(review)，大家可以共同讨论，看是否有考虑不周或者更好的方案，在这过程中，你可以根据建议随时改进代码，然后push到分支上，PR就会同步改动。当所有的改动都被批准后，PR应该就会被合并啦！

### 实战篇(Practice)

**目标：** 通过提交Pull Request的方式把你的名字署在文末。

1. 首先Fork[本项目](https://github.com/zhongwencool/notes)，把它变成你自己GitHub下的项目。如果你没有设置好Git，可[参照GitHub指引](https://help.github.com/articles/set-up-git/)。

   ![fork](https://user-images.githubusercontent.com/3116225/49161572-189cab80-f364-11e8-9246-bd8465f5716f.png)



2. 成功后可在自己GitHub账户下看到notes项目。将项目用命令行clone到本地后创建新分支。

   ```shell
   git clone https://github.com/你自己GitHub用户名/notes.git
   cd notes
   git checkout -b learn/add-my-name
   ```

   ![new branch](https://user-images.githubusercontent.com/3116225/49162442-dc6a4a80-f365-11e8-9171-e8baa4889f0a.png)

3. 然后用文本编辑器打开`github-pull-request.md`这个文件，在末尾加上你的名字。

   ```markdown
   [某文](https://github.com/zhongwencool)
   ```

4. 提交修改到远端自己刚才fork的项目中。

   ```shell
   git commit -am "我的第一个PR实验"
   git push origin learn/add-my-name
   ```

5. 通过PR的方式把你fork项目中的变更提交到我的项目中，完成PR!

   被合并后马上就能在文章中看到你的名字啦~
   ![PullRequest](https://user-images.githubusercontent.com/3116225/49165617-8fd63d80-f36c-11e8-8c3c-e3b2b394e2a3.png)


   另外如果你发现了本文还有其它可以改良的地方，欢迎帮忙  👏👏 👏👏 👏。

### 同步上游分支(Upstream)

🙇‍♂️：如何保持fork分支与上游分支(upstream)同步？

1. 先查看一下你目前git状态。

   ```shell
   $ git remote -v
   origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
   origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
   ```

   以上说明: 你的origin分支指向的是你fork的分支。

2. 指定上游地址。

   ```shell
   $ git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
   ```

   upstream分支指向上游地址，这里的**upstream**名字可以任意指定，只是一般都把上游地址都叫**upstream**。

3. 检查地址是否设置成功。

   ```shell
   $ git remote -v
   origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
   origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
   upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (fetch)
   upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (push)
   ```

4. 从upstream分支上拉取最新代码。

   ```shell
   $ git fetch upstream
   remote: Counting objects: 75, done.
   remote: Compressing objects: 100% (53/53), done.
   remote: Total 62 (delta 27), reused 44 (delta 9)
   Unpacking objects: 100% (62/62), done.
   From https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY
    * [new branch]      master     -> upstream/master
   ```

5. 切换到自己的master上，然后把upstream分支上更新内容合并到master上。

   ```shell
   $ git checkout master
   Switched to branch 'master'
   $ git merge upstream/master
   Updating a422352..5fdff0f
   Fast-forward
    README                    |    9 -------
    README.md                 |    7 ++++++
    2 files changed, 7 insertions(+), 9 deletions(-)
    delete mode 100644 README
    create mode 100644 README.md
   ```

这时你的本地master就和上游同步成功啦，但是这只是表示你的本地master，一般你还需要把本地master同步到GitHub下的远程分支上。

``` shell
$ git  push origin master
```

### 参考链接(Reference)

* [理解GitHub的工作流](https://guides.github.com/introduction/flow/index.html)。

**纸上得来终觉浅，绝知此事要躬行。**

[某文](https://github.com/zhongwencool)、
[CY](https://github.com/Confidential-CY)、
[王昭君❄️ ](https://github.com/TianliJin/)
[Hello PR](https://github.com/MyCodeMyMoney)
[嘿嘿嘿，小老弟（baixuangezhu）](https://github.com/Baixuangezhu)
[prime](https://github.com/BlueFresher)
[ligong](https://github.com/lingr7)

