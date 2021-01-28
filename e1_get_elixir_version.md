---
title: E1.获取Elixir/Erlang版本信息
subtitle: 
description: elixir,erlang,version
date: 2021-01-25
layout: default
category: 技术
---

### 获取Elixir版本

直接在shel中打开`iex` (interactive shell)，就可以查到具体的版本信息：

```elixir
iex
Erlang/OTP 22 [erts-10.6] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:1] [hipe] [dtrace]

Interactive Elixir (1.9.0) - press Ctrl+C to exit (type h() ENTER for help)
iex(1)>
```

使用符合GUN选项标准`--version`或`-v`，比如在写Shell脚本时可以用来判断版本。

```elixir
iex --version
Erlang/OTP 22 [erts-10.6] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:1] [hipe] [dtrace]
IEx 1.9.0 (compiled with Erlang/OTP 22)
iex -v
Erlang/OTP 22 [erts-10.6] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:1] [hipe] [dtrace]
IEx 1.9.0 (compiled with Erlang/OTP 22) 
```

在代码中获取版本信息：[system.version/0](https://hexdocs.pm/elixir/System.html#version/0)

```elixir
iex(1)> System.version
"1.9.0"
```

### 获取Erlang版本

Erlang无法使用`erl --version`命令，只能通过命令行选项[eval与noshell](http://erlang.org/doc/man/erl.html)参数求值来实现。

```elixir
erl -eval 'erlang:display(erlang:system_info(otp_release)), halt().'  -noshell
```

- `eval` :对Erlang表达式求值。
-  `noshell`: 不启动shell，就像上面的elixir --version一样。
- `halt()`退出当前运行时

由于`:erlang.system_info(:opt_release)`只能拿到一个大版本号：比如**22**：

```elixir
iex(1)> :erlang.system_info(:otp_release)
'22'
```

如果想要更详细的版本信息可以使用：

```elixir
erl -noshell -eval \
> '{ok, Version} = file:read_file(filename:join([code:root_dir(), "releases", erlang:system_info(otp_release), "OTP_VERSION"])), io:fwrite(Version), halt().'
22.2
```

上面的代码来源于[Erlang官方文档](http://erlang.org/doc/system_principles/versions.html)。

多个表达式写成一行使用逗号隔开，显得不那么容易理解，还可以把多个表达式分开写：

```elixir
erl -noshell -eval \
'{ok, Version} = file:read_file(filename:join([code:root_dir(), "releases", erlang:system_info(otp_release), "OTP_VERSION"])), io:fwrite(Version).'\
 -eval 'halt().'
22.2
```

或用`-s`参数：

```elixir
erl -noshell -eval \
> '{ok, Version} = file:read_file(filename:join([code:root_dir(), "releases", erlang:system_info(otp_release), "OTP_VERSION"])), io:fwrite(Version).'\
>  -s erlang halt
22.2
```

PS：上面的`OTP_VERSION`文件是从R17后才有的。

从R17开始，OTP的大版本代表的是一组特定版本的应用(Applications)，这一组合通过了爱立信官方OTP团队的测试，但是个人也可以不升级大版本，只升级其中的某个特定应用的版本，这样的组合的兼容性没有经过官方验证/测试，需要自己充分测试，所以没有经过充分的测试，别只单独升级个别应用，最佳实践是保持和官方大版本一致的应用版本。

> It is therefore **always preferred to use OTP applications from one single OTP version**.

想要得到那些应用在本版本做了变更，可以查看查看[otp_versions.table](https://github.com/erlang/otp/blob/master/otp_versions.table),它罗列了每个版本具体的改动情况，每一行代表一个版本，比如：

```elixir
OTP-22.1.1 : compiler-7.4.6 erts-10.5.1 snmp-5.4.1 # asn1-5.0.9 common_test-1.18 crypto-4.6 debugger-4.2.7...
```

- `OTP-22.1.1`: OTP版本
- `compiler-7.4.6 erts-10.5.1 snmp-5.4.1:`发生了变更的应用。
- `#`后面的应用为未发生变更。