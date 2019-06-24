---
title: UNIX VS Linux
subtitle: 虽然你可能对Linux一窍不通，但是一定使用过Android。
description: UNIX历史,Linux,Linux历史,UNIX,UNIX来源
date: 2019-06-15
layout: default
category: 技术
---

[Linux](https://en.wikipedia.org/wiki/Linux)已经渗透入生活的各个方面，Android，Chrome OS，Raspberry Pi系统使用的内核就是Linux。Linux和[UNIX](https://en。wikipedia。org/wiki/Unix)非常相似，以至于有部分人不能明确说出两者有什么不同的。为了理清它们的渊源，就必须从UNIX的诞生说起。

### UNIX起源

 Ken Thompson和Dennis Ritchie于20世纪70年代在贝尔实验室发明了UNIX，[Dennis Ritchie](https://en.wikipedia.org/wiki/Dennis_Ritchie)同时也是C语言的创始人，之所以叫C语言，也是因为Thompson搞出了一个B语言，所以就接字母顺序叫了C语言，[Ken Thompson](https://en.wikipedia.org/wiki/Ken_Thompson)也是utf-8的发明者，同时也是golang的联合创始人(co-inventor)，当时他俩在贝尔实验室一起在开发一个叫Multics的操作系统，目标是可以操作系统可以**同时**运行多个程序。不过团队在项目的实施上遇到瓶颈，所以他俩在业务时间开始研究有没有其它的替代方案，最后确定目标变成**一次只运行一个程序**，所以它不再是Multix，就起了个名字UNiplexed Information and Compution Service --- UNICS，但是因为U后跟一个C非常难记，所以直接改成了X(UNIX)。它最初完全使用C语言编写。

到1972年时，Ritchie已经把C语言体系搞得很成熟，确定可以用于重写操作系统(以前的OS大部分都是汇编写的)。不过由于AT&T由于以前一些法律问题被禁止进入计算机市场。所以他们发布了UNIX的源代码非商业的许可证，它开始在各个大学传播并使用，基中也包括在伯克利(Berkeley)的加州大学(University of California)。随后AT&T和贝尔实验室分离，所以在1980年代，市场上开始出现UNIX的商业版本—**System5**，与此同时，加州大学也基于AT&T授权得到的UNIX上继续开发，这就引出了另一个分支**BSD**(Berkeley Software Distribution)，所以你会看到System5和BSD在1980年代中期都被广泛流传和使用，后来的[Solaris](https://en.wikipedia.org/wiki/Solaris_(operating_system))就来源于System5，[Ultrix](https://en.wikipedia.org/wiki/Ultrix)继承于BSD。

随后，BSD开发者开始使用他们自己版本替换来自AT&T的源文件，想把BSD彻底从System5中分离出来，开始对外说明BSD的操作系统是完全免费的，并于90年代初期，开发者为是否完全免费还发生争端。

争议导致后来出现了一个完全移除了AT&T提供的UNIX源代码的版本，叫**BSD4.4 light**，随后它快速发展成了现在被我们熟知的**FreeBSD**。在FreeBSD打磨最成功的就是Mac OS系统。

### POSIX标准

随着各个小分支都百花齐放，各自朝着自己认为正确的道路狂奔，最终大家都意识到了必须要规定出一套UNIX标准(也叫**UNIX哲学**philosophy)来规范。就如何写一个程序，如何设计一个程序的输出成为另一个程序的输入(pipe)，如何去编译程序等等，只有这些标准制定了，才能同一个程序在各个不同分支的UNIX正常运行起来(兼容性)，所以开始制定发布一系列的标准，其中最流行的就是**POSIX**，它实际说的就是如果你的程序要在这个操作系统上编译运行，你必须编写POSIX规范的特定功能API。

### GNU Project

在这技术百舸争流的70年代中期，一帮Hackers成立在硅谷成立了"Homebrew Computer Club"，刚成立Microsoft的Bill Gate于1976年1月31号发公开信给此俱乐部，信中他一点点为软件产权的相关新观念辩论，指出

> "To me the most critical thing in the hobby market right now is lack of good software courses books and software itself, without good software and an owner who understands programming, a hobby computer is wasted, will quality software be written for the hobby market"。

有些大公司开始停止分发源代码，并使用各种各样的版权和许可证还禁止复制和再分发，企图构建自己的技术围城。[Richard Stallman](https://en.wikipedia.org/wiki/Richard_Stallman)当时在MIT人工智能实验室写代码，经常遇到如果需要查看代码，就必须签署不能随意分享它的协议。Hackers们认为这把他们从社会和合作的社区分离了，为了打破大家各自封闭的圈子，随后成立了Free Sofware Foundation， 创建了[GNU Project](https://en.wikipedia.org/wiki/GNU_Project)(Emacs就是在GNU项目中产生的)。他还负责新版本C compiler, debugger, text-editor，这些工具用于能够构建免费版本的UNIX而无需依赖BSD或AT&T的任何源代码。

### Linux崛起

因此在90年代你可以得到公开发布的BSD，System5，除此之外，还有[Andrew Tannenbaum](https://en.wikipedia.org/wiki/Andrew_S.Tanenbaum)编写用于教学生操作系统设计基础知识的[MINIX](https://en.wikipedia.org/wiki/MINIX)。MINIX被远在芬兰一名叫[Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds)的大学生所发觉，随后决心从头写一个操作系统。他成功做到了并公开向全世界发布。这份[公开声明](https://groups.google.com/forum/#!msg/comp.os.minix/dlNtH7RRrGA/SwRavCzVE7gJ)的重点在于:

![linux](https://user-images.githubusercontent.com/3116225/59553224-a3718a80-8fc4-11e9-8912-5e85c9667ba5.jpg)

1. 它是运行在386电脑上的，不是大型机或超级计算机，这可以让学生在自己的家里也可开发。
2. 工具集中的bash，gcc都是使用的GNU工具集。
3. 完全Free。

随后Linux开发大部分都参照了UNIX哲学，得到了大量来自有BSD和System5背景开发者的关注。但真正开始起飞来源于1992年Linux开始支持X window。这意味着你可以拥有一个带window的桌面，你可以找开多个终端，linux开始在开发者中大量被下载使用。迅猛发展直到现在，Android，Chrome OS和相当比例的web server都使用的Linux内核，不过因为Linux不是UNIX或UNIX的克隆版本，所以它通常都叫**unix-like**，因为它还是继承了UNIX哲学的。

### Summary

1. 基本Linux内核开发，也派生出了很多版本，如RedHat，fedora， arch等，这些版本打包了一系列增加的工具（KDE 桌面，Gnome桌面，libera office，Chrome)，但它的内核是Linux。
2. FreeBSD是基于不含有AT&T代码的免费UNIX版本(BSD 4.4 light)。最广为流传的是Mac OS。由于严格遵循BSD规范，所以在Mac下使用`find`命令必须加路径，而在Linux使用的是GNU标准，GNU额外加了很多功能的，[比如现在这个`find`不输入路径则使用当前路径](https://stackoverflow.com/questions/17548854/difference-between-mac-find-and-linux-find)。
3. Linux是基于MINIX开发的，unix-like系统，与UNIX不共享任何代码，以现在开源免费软件的发展来看，Linux参照UNIX哲学，但已有一种青出于蓝而胜于蓝的趋势。

说话有这么多的Linux版本：

![Linux_Distribution_](https://user-images.githubusercontent.com/3116225/59553212-8341cb80-8fc4-11e9-903a-da9fd33505cc.jpg)

[如何选择一款适合自己的呢](https://librehunt.org/)?，⌨️或者自己google linux distros就会出来相关内容。



PS: 在Steve Job去世后一周，Dennis Richie也过世了，享年70岁。不过这个消息并没有得到大众太多关注。

### Reference

1. [操作系统革命-Revolution OS记录片](https://www.bilibili.com/video/av9512574/)。

