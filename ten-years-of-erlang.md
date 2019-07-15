---
title: 十年Erlang观察
subtitle: 十年饮冰 难凉热血
description: erlang,history
date: 2019-07-14
layout: default
bg_url: "assets/images/code.jpg"
category: 技术
---

- 原文地址：[Ten Years of Erlang](https://ferd.ca/ten-years-of-erlang.html)
- 原文作者：[Fred T-H](https://ferd.ca/)
- 译文永久链接：[十年Erlang观察](https://notes.tried.cc/ten-years-of-erlang)

## Ten Years of Erlang

大约十年前，我加入了Erlang社区，当时它正处于第一个快速发展期(hype phase)。我们被告知，Erlang是并发(concurrency)和并行(parallelism)的未来。这是搞定并发/并行最容易且最快的方式，而且还免费附赠分布式支持。那时候，事情刚刚开始朝着令人惊叹的方向发展，当时Erlang虚拟机刚开始支持[SMP](https://en.wikipedia.org/wiki/Symmetric_multiprocessing) ，在此之前，你需要在同一台计算机上运行多个虚拟机才让发挥出所有的CPU处理能力。

我想花一点时间来反思这十年光阴，在这篇文章中，我将讲述一些事情，比如快速发展期以及这与Erlang的关系，Erlang思想的学习阶梯以及我在十年中发生的变化。最后我将讲述我认为Erlang仍然需要带给整个编程社区的东西。

### The Hype Phase

[技术发展趋势曲线(Hype cycle)](https://en.wikipedia.org/wiki/Hype_cycle)引入了产品或技术生命周期的各个阶段。这仅一个营销概念，而不是一个科学概念，但它在描述事情进展时通常很有用。其中我最感兴趣的就是快速发展期(hyper phase)的核心思想，类似于编程社区中的一种淘金热。你之前可能已经历过一些类似的，他们似乎都被某个杀手级应用( [killer app](https://en.wikipedia.org/wiki/Killer_application))所吸引，迫使每个人随着浪潮涌入进去。

我想到的例子有Ruby on Rails和[如何在15分钟构建一个博客引擎](https://www.youtube.com/embed/Gzj723LkRJY)(*"Look at all the things I'm not doing!"* 依然是一个很有趣的句子)，又或是Go编写的Kubernetes(它在以前就被大量使用，但是后来迎来了爆炸式增长)。如果再放宽标准，Elixir/Phoenix也在此列表中。

在这样的大肆炒作的阶段，大批新人令人难以置信的速度涌入，来看看到底是怎么回事，有些人会留下，大多数人会离开。人们的停留时间可能是几个月或几年，在极少数情况下，你能找到一个停留持续几十年的。但是这些极少数中的绝大多数都是从早期就开始一直使用。他们从一个技术领域翻越到另一个技术领域，找寻率先使用某种框架，语言或工具包来获得竞争优势的最佳机会。

因此，通常情况下，你需要做的就是创造一个真正的杀手级应用，然后人们就会顺流融入对应的生态系统。杀手级应用推动这股浪潮。如果你建好了，他们就会来。然后如果还能让他们中一小部分留下来并保持活跃，在可预见的将来，这将会形成一个活跃的社区。这种模式，让我不禁想起[*Rain follows the plow*](https://en.wikipedia.org/wiki/Rain_follows_the_plow)：

[^Rain follows the plow]: 到底是鸡生蛋还是蛋生鸡的例子可能更好理解。

> 上帝加速犁...通过这种只有人类才能控制自然的奇妙规定，云正在散发大量的雨水…[犁]是将文明与野蛮分开的工具；把沙漠变成农场或花园...更简洁地说，雨跟随犁。
>
>  这一理论的基本前提是，人类的居住和通过建房进行的农业对干旱和半干旱地区的气候产生了永久性的变化，使这些地区更加潮湿。这一理论在19世纪70年代被广泛推广，作为大平原定居的理由，该地区以前被称为“美国大沙漠”。在同一时期，它也被用来证明南澳大利亚边际土地上小麦种植的扩张是合理的。

如果只要我们可以搞定一个大项目，那么开发者自然就会来，最终形成自然维持的生态。我认为这想法明显是错误的，主要是因为Erlang在其快速发展期有几十个杀手级的应用，但是社区仍然很小。例如：

* [ejabberd](https://www.ejabberd.im/) (2002年创建,2005年发布第一个稳定版本)：它是迄今为止运行的最具扩展的托管聊天服务器之一。Ejabberd取得了巨大的成功，直到今天，你仍然会在StackOverflow上找到相关问题。大约在2011年，它被分家进入了[MongooseIM](https://mongooseim.readthedocs.io/en/latest/History/)，这两种解决方案仍然在维护中。
* [CouchDB](http://couchdb.apache.org/) (2005):用Erlang编写的第一个[遵循CAP定理](https://en.wikipedia.org/wiki/CAP_theorem)流行数据库之一，同时也是当时多主(multi-master)文档存储的新浪潮之一。虽然MongoDB占有了大量市场，但couchDB仍然在存储引擎(例如[BarrelDB](https://barrel-db.org/))有着一席之地，并且至今还在维护。
* [RabbitMQ](https://www.rabbitmq.com/) (2007): 一个队列软件，几乎占据了AMQP的所有市场。它至今都还仍然在开发迭代中，当涉及到流式工作负载(streaming workloads)时，经常会与 [Kafka](https://kafka.apache.org/) 相比较，尽管两者有着非常不同的属性和用例。
* [Facebook chat](https://www.facebook.com/notes/facebook-engineering/chat-stability-and-scalability/51412338919/) (2008):Facebook聊天最初版本是由Erlang编写，由于大量的内部决策(稳定性，C++工程师强大的内部存在以及一套既定的解决方案)，后来被用C++重写了。
* [WhatsApp](https://www.whatsapp.com/) (2009成立, 2014被facebook收购):facebook在聊天系统中摆脱了Erlang之后，最终收购了WhatsApp，众所周知，[该公司9亿用户只需要50个工程师](https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/)。如今，WhatApp仍在继续发展，事实上，WhatsApp的人们决定以后更积极地参与到Erlang/Elixir社区中。
* [Riak](https://riak.com/) (2009):分布式系统世界中伸缩性(muscle-flexing)最好的例子之一。Riak是一个真正可靠的分布式键值存储系统，它是一个仍然在医疗保健系统和其它关键基础设施中运行的Basho产品。在Basho陷入财务困境并被迫破产后(很大程序是由于[违反信托义务](https://www.klgatesdelawaredocket.com/2018/09/controller-breaches-fiduciary-duties-by-coercing-onerous-financing-terms/)，导致[“公司陷入了亏损”](https://www.theregister.co.uk/2018/07/09/basho_damages_20m_misinformation_threats/))。从那以后，Bet365购买了它所有的IP，并把他们都开源出来。尽管支持相比于之前更局限了。

其中上面很多都发生在Joe Armstrong的[Erlang编程](https://www.goodreads.com/book/show/808814.Programming_Erlang)首次出版的时候，这为大量流行提供了一个完美的时机，Erlang吸引了大量的旁观者，甚至在[Hacker News强制所有的讨论都集中在Erlang上的那一天](https://news.ycombinator.com/item?id=12502531)也产生了显著的影响。然而结果是，很少有人留下来，绝大部分都止步于看一看就走了。

我现在认为杀手级的应用都是由那些在语言进入快速发展期后涌入的人所构建的。而不是先有杀手级应用，才迎来了快速发展阶段的爆发。总有一小部分人在早期阶段嗅到有趣的技术，决定信仰它，随后开发出一些应用。如果这个应用恰巧也是一个杀手级应用，那么就会迎来一个更炸裂的爆发时期，这些应用会迅速风行起来，一个成功的故事会滋生更多的模仿者。另一个常见的事情就是"重造轮子(reinventing the world)"，每个人都花时间重新实现所有已存在的东西，所以你会收到一堆关于用特定语言重新实现某某库的公告。

但是杀手级应用本身并不足够(推动社区快速发展)，其中一个有趣的结果是，像RabbitMQ和Ejabberd这样的产品，尽管很受欢迎，但其用户群体远无大于贡献群体。成千上万的人使用其产品，但是并一定会参与到Erlang社区中。

毫无疑问，部分原因是因为大多数的Erlang杀手级应用都是有专门的基础架构：创建一个其他人都可以使用的高可靠性的黑盒组件，如果它运行得足够好，他们永远不需要去解盒子内部。不管怎样，几十位开发人员已经为数以千记的其他产品和服务提供了基础服务。根据定义，专业基础设施是一个不需要大量人员就能产生巨大影响的。它总是会有更小的贡献者群体和社区，而不是最接近最终产品的东西，例如具有无数网络开发人员的web框架，或者更通用的基础架构(那些在大多数企业都需要小规模部署的基础架构)。

但即便没有这些因素，我们也很容易感觉到Erlang错过了一个绝佳的机会，错过了在快速发展阶段(hype phase)获得更多的关注和流量。

### The Ladder of Ideas

我不会通过描述可能或应该做的事情来讨论反事实([counterfactuals](https://plato.stanford.edu/entries/counterfactuals/#WhatCoun))，相反，我想深入探究一下我在Erlang社区中看到常见的学习模式，这些模式是我多年来教学和写作过程中所观察到的，这也是Elixir社区里正在发生的，我觉得通过它，可以是观测到未来的某些踪迹。

我最喜欢的理论是，像编程语言(及其生态系统)这样的技术主题具有多层复杂性，需要学习和发现各种概念。我第一次开始玩这个想法是在*Learn You Some Erlang*里，里面有学习Erl的9个阶段([The Nine Circles of Erl](https://learnyousomeerlang.com/relups#the-ninth-circle-of-erl))的图表。

现在，我觉得这是一种诙谐的方式，我不认为学习一项技术是无尽的痛苦(至少，它不应该是)，我只是喜欢双关语。但简单来说，通常会有一个更"核心(core)"的轨道或主题序列，创造出一个“思想阶梯(ladder of ideas)”，在这个阶梯上，越有价值的概念会被摆得越高，也正因它们更高更难，实际上很少有人能到达那里。

在Erlang中，我认为的(学习)思想梯形图可能如下所示：

1. 函数式编程 — functional programming
2. 独立的进程和并发 — isolated processes and concurrency
3. 可靠的并发(链接，监督者，超时)  — reliable concurrency (links, monitors, timeouts)
4. OTP行为和其它系统抽象 — OTP behaviours and other system abstractions
5. 如何构建/组织OTP系统 — How to structure OTP systems
6. 如何构建版本并处理其生命周期 — How to build releases and handle their life cycle
7. 如何永远不要关闭系统(热升级)，以及如何操作/调试它 — How to never take the system down, and how to operate it

![erlang-ladder](https://user-images.githubusercontent.com/3116225/61178814-857d6100-a628-11e9-9afa-f1b7dabab208.png)

如果你是第一次使用Erlang，并从一本初学者的书入手，那么你可能会花费大部分时间在第一阶梯：与函数式编程，不变性，递归及类似的概念打交道。随后，你会进入并发和并行，进程和消息传递。紧接着，开始了解链接和监督者，处理故障，以及为什么Erlang会成为现在这样样子。在Erlang的快速发展阶段，第二和第三阶梯被大多数的旁观者认为是真正令人惊奇的。领会理解后会不时想在将来的项目中实践一下这些令人着迷的思想。

其它梯级稍后会跟进，但前提是你坚持使用这门语言，特别是，OTP(梯级4)将被钦定为Erlang语言的所有内容 。并发和函数式编程确实很好，但是OTP所代表的通用开发框架是真正独特的，你必须坚持和使用它。很多人会使用OTP，随后理解它优雅的抽象。但可能还是会对如何正确的构建这一切感到困惑。

实际上，像Ejabberd这样的应用的大部分开发者都没有突破第四阶梯(使用OTP)，当时的生态系统有点像狂野西部(Wild West)，那些曾经在爱立信工作的人和最有动力学习的自学者才能习得的全面OTP实践知识。大多数人永远不会达到第五阶梯(如何构造OTP系统)。直到他们生产系统开始出现一些问题并希望寻找更好的方法时，才会有动力去思考这个问题。第六阶梯(构建Release)就更加罕见了，直到2015或2016年，[Relx](https://github.com/erlware/relx)让构建Release的整个过程变得更容易了。第七阶梯(热升级)绝少人能够达到，事实上，很多人觉得永远不应该热升级一个节点，理想的情况下，也永远不会在生产环境中调试程序。

实际上，并不是每个人都会以相同的顺序浏览所有这些内容，有些书会把它们翻来覆去(比如: [Erlang and OTP in Action](https://www.manning.com/books/erlang-and-otp-in-action) )。没关系，阶梯图只是为了说明目的。

社区的走势是波浪形的。进入快速发展期会在一段时间内将社区的规模扩大10倍或100倍，由于大多数人都是好奇的看一眼，随后离开，所以社区中大多数用户都处于第一阶梯。很少有能突破那里的。阶梯越往上，能到达的人比例就会越小，以此类推，直到你进入最高水平的内部专家圈子。

我认为对于Erlang来说，前三个阶梯可能很容易进入，第四阶梯花了几年时间才来学习，这也是非常值得的。第五阶梯是事情变得非常艰难的地方。Erlang缺乏工具链和生态系统。Erlang社区的人自我选择成为能够忍受这种贫瘠环境的人，因此对新来者的困境不敏感。为了保持这篇文章的简短(嗯，长而不是荒谬的长)，我在Erlang用户会议(Erlang User Conference )主题可能是我对生态系统最完整的咆哮:https://youtu.be/Z28SDd9bXcE

如果你一个Elixir使用者，可能会找到自己在这个任意定义的阶梯上的位置，并且你可以了解社区中派系通常位于什么位置。很多人，可能是那些除了Phoenix以外，其它一概不管的人，很少会突破第四关，在可预见的将来，很多人会坚持第三关或更低。当然这些没有什么不好的，这些不是判断，只是观察到的现象。作为一个已经看过很多阶梯的人(可能在这个设定下，还有一些超出我自己头脑的设定阶梯，比如："修补虚拟机")，感觉他们(那些停留在第三阶梯的人)会错过很多，但是坦率地来说，这可能永远不会对他们有用。所以也没关系。

但这所有的这些都是为了说：我认为，社区的发展可能会被无法让人们超越基本水平而束缚。要吸取一些教训不能操之过急。在某种程度上这就是盲人领导盲人，因为Erlang圈太小了，没有足够的人分享所有需要的经验。不过现在事情变得更容易了，如果你是在快速发展期之外进入的话，你更有可能找到很好的帮助。因为更少人想立马得到所有的一切。

我想如果未来Erlang有第二个快速发展阶段，我们会以一种更友好的方式来迎接它，而不在只是自己独坐在大浪上。希望这次经历，以及Erlang和Elixir社区之间更好的合作，可以增加社区的覆盖面，便我们成功的机会加倍。

### What Changed

Erlang并没有呆在装满甲醛的玻璃容器里，等待在光天化日后被拿出来。它一直在发展和进化。部分原因是Elixir社区的压力和需求，幸运的是，Elixir社区比Erlang用户更期待工具链的完善。部分原因在于推动平台向前发展的实际工业需求，而学术界只是按照他们喜欢的方式推动事情向前发展。

下面是我能想到的一些可以值得人们关注和高兴的事。这些事从2009年或更早期就发展起来了：

- 完美支持多核，它在过去使用2-4核就会发生各种各样无法控制的瓶颈，发展到现在能完美处理12-16核，最近我不太确定最多能支持多少个核，但是我很确定我编写和操作了运行在32个以上内核上的程序，没有任何问题。
- 堆栈(stacktraces)跟踪中有行号，回到没有行号之前的时候几乎是不可想象的。那时，”写简短的自我描述功能“不仅仅是一个设计问题，而一个生存问题。你现在可以随意调试Erlang程序，而不需要超凡高超的调试技巧，不过有这些技巧也不会带来任何不良效果。
- 支持Unicode，`string`模块包含了最重要的算法，`unicode`模块可以很好地处理大多数的转换和规范化。有一些处理原始代码点(raw codepoints)的策略，UTF-8,UTF-16和UTF-32。仍然缺乏区域设置(Locale)支持，但现在是正常工作状态，诸如`re`（用于正则表达式)和所有更高级文件处理代码等模块也都可以很好地处理Unicode。
- 支持Maps(使用[HAMTs](https://en.wikipedia.org/wiki/Hash_array_mapped_trie)实现)，并支持显式模式匹配语法 。支持Dialyzer对Maps进行类型分析，也支持用它们来代替使用非常痛苦的Record。
- 虚拟机的[时间处理机制](https://learnyousomeerlang.com/time#how-things-are)是世界一流的，在处理时间扭曲(time warping)，各种类型的时钟等方面都做得很好。但是，如果要处理时区和时间格式，最佳的方式还是使用社区的库。
- 新增了诸如 [atomics](http://erlang.org/doc/man/atomics.html), [counters](http://erlang.org/doc/man/counters.html)和[persistent terms](http://erlang.org/doc/man/persistent_term.html) 的高性能工具，以帮助改进为可观察性功能(observability features)和底层核心库提供支持的所有底层机制。
- 所有的[信号处理都是异步的](https://www.youtube.com/watch?v=U-JIzj07uQA)，包括[端口](https://github.com/erlang/otp/blob/master/erts/emulator/internal_doc/PortSignals.md)，大大减少了瓶颈。
- 编译器已经被重写(并且重写还在进行中)，以便通过[SSA](http://blog.erlang.org/ssa-history/)进行更高级别的分析和性能提升。
- 现在，NIFs支持脏调度(Dirty schedulers)，并使与C甚至Rust的代码集成变得简单，并支持IO或CPU密集型工作负载。因此虽然语言可能不是无限快，但是为了更快，可更容易替换为更高性能的库，关键是可以不太影响运行时稳定性的。
- [内存分配和管理](https://github.com/erlang/otp/tree/master/erts/emulator/internal_doc)的大量改进。
- 更快，更灵活的实时跟踪和微观状态核算( [micro-state accounting](http://erlang.org/doc/man/msacc.html))，用于跟踪正确性和性能调试。
- 一个更灵活的`gen_statem` OTP行为，用于实现可以处理选择性接收的有限状态机。
- 一个新改进版本的[日志记录框架](https://ferd.ca/erlang-otp-21-s-new-logger.html)，内置支持结构化日志记录。
- 重写了`crypto`模块，使用NIF代替之前更复杂(通常更新更慢)Dirvers。
- 使用NIFs完全重写文件驱动程序，[性能得到巨大(huge performance gains)提升](http://blog.erlang.org/My-OTP-21-Highlights/)。
- 使用NIFs重写网络驱动(network dirvers)，还在进行中。
- 完全重写了用于TLS处理的`ssl`应用。回想我在heroku的时候，为了设法让它在延迟方面与C++解决方案相比具有竞争力(可能慢5%)，并且在可预测性方面更好(比99th百分比低10~30倍)。
- ETS性能的重大改进。
- 我写了一本关于[如何使用ErlangVM操作和调试生产系统的手册](https://erlang-in-anger.com/)。
- 一个全新的构建工具([rebar3](https://www.rebar3.org/))，它与Erlang生态系统的[统一包管理器集成在一起](https://hex.pm/)。
- 虚拟机上还提供了多种新的编程语言，它们可以互换库使用，包括(但不限于)Elixir,Efene,LFE,Luer,Clojerl和至少两种与Gleam和Alpaca类型抢断的语言。
- 以及更多关于Erlang分布式内核改进的林林总总。

如果你想了解更多的内容，可以查看[发行说明的完整列表](https://www.erlang.org/news/tag/release)。但简而言之，从OTP13到16发布相对于在Ericsson的OTP团队来说，时间用得有点久(我们现在的版本是22)。那么他们在其旗舰产品也使用Erlang所做的最新动作真的很鼓舞士气，但即使在爱立信之外，事情也在快速发展。Erlang社区，以及Elixir社区及其他语言的贡献者，都联合起来建立了[Erlang生态系统基金会(the Erlang Ecosystem Foundation)](http://erlef.org/)，现在有活跃的工作组帮助协调和解决与构建和打包工具，监控，安全，培训相关的问题。

如果和我一样，你也是最初快速发展期的一部分，但和我不同的是，你没有留下来，因为很多东西感觉不可用或太棘手，你现在可以再尝试一次。Erlang语言及其生态系统的工效学有了显著的改善。

### Where Erlang Goes

没必要像从2007~2009年那样出现大的杀手级应用，但这也并不意味着没有项目就没有了希望。Erlang仍然深深嵌入了许多公司的基础设施中，其中大多数最初的杀手级应用仍然存在。每个BEAM交流会(Conf)上都有大量有趣的新玩家。我自己最近也讲了关于[Property-Based Testing的概念](https://www.youtube.com/watch?v=LvFs33-1Tbo&t=1057s)。Erlang/Elixir拥有的世界一流的框架也在尝试这些概念。不过尽管如此，有迹象表明我们现在还没有处于快速发展阶段。

是否会有另一个快速发展阶段? 也许会有，也许也不会。你可以说Elixir就是下一个。生态系统有足够的共同点：在一个地方学到的经验教训可以转移到别一个地方。它们之间的相似之处多于不同之处。也许还会有新的复兴。我个人对此不再那么关心了。我倾向于喜欢较小的社区，所以我对此感觉良好。Erlang不需要几何增长来让我来享受它。它只需要保持可持续性。

Erlang社区的规模也从来没有限制过它的全球影响力。据我所知，并没有大量关于Erlang开发的工作，公司很难招到足够的Erlang开发者。这两种情况都同时存在。但它们在地理位置 上并不一致。向偏远市场开放的公司和员工往往做得最好。整个Elixir正在进入以前Erlang无法轻易打入的web应用市场。

从全局来看，你是否使用像Erlang这样的语言可能并不重要。虽然我确实觉得它被低估了。但它最大的好处并不是运行一个使用它的系统，最大的好处来自于学习坚实的系统设计基础及思想。并在运用到实际环境中。

多年来我听到一类问题与寻找指导(finding guidance)有关。如何学习设计协议？有什么关于构建分布式系统推荐阅读材料么？如何让事情变得更健壮和容错？怎么知道我的设计是模块化的？我的抽象是否合适？怎样才是好的错误处理？怎么才能发现优化的时机(避免过早优化)？*declarate*一些事意思着什么？

我们喜欢简短易懂的解决方案，如cookbooks和最佳实践(best practices)，但大多数真正的答案都是”我多年来学到/积累"的变体。我可以诚实地说，在我的职业生涯中，没有什么比花时间在Erlang的世界中，并通过潜移默化的方式吸收其资深社区的经验更有价值。从数量上，它不是一个大的社区，但是从任何其它指标来看，它肯定是丰富的。几年后，我从一名初级开发人员转变成了高级职位，在世界各地演讲，想方设法把这种经历传承下去，这很大程度都归功于社区。

也许我仍然不能在15分钟内写一个博客引擎(说实话，反正我是一个慢节奏的开发人员)，但是我个人已经成为一个更可靠的开发人员和系统架构师，我认为这是一个非常节省时间的方式。再强调一次，我反复在说的不是使用系统，而是构建它们并使它们正常工作。无论如何，激励人的并不存在普遍性。

我无法想像我会在任何其它社区得到比Erlang社区的多。过去的十年令人惊叹。有趣的是，Erlang社区仍然很小。而且大部分都没有开发。这意味着有很多机会去参与任何事，和那些充满智慧并渴望分享的人一起，为自己创造一席之地。





