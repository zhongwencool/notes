---
title: UUID如何保证唯一性
subtitle: Universally Unique IDentifier
description: UUID,UUID使用场景,UUID唯一性
date: 2019-06-23
layout: default
category: 技术
---



### UUID

[UUID(Universally Unique IDentifier)](https://en.wikipedia.org/wiki/Universally_unique_identifier)是一个128位数字的唯一标识。[RFC 4122](https://tools.ietf.org/html/rfc4122)描述了具体的规范实现。本文尝试从它的结构一步步分析为什么它能做到唯一性？及各个版本的使用场景。

### Format

UUID使用16进制表示，共有36个字符(32个字母数字+4个连接符"-")，格式为`8-4-4-4-12`，如：

```shell
6d25a684-9558-11e9-aa94-efccd7a0659b
xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
```

M中使用4位来表示UUID的版本，N中使用1-3位表示不同的variant。如上面所示：M =1, N = a表示此UUID为version-1，variant-1的UUID(Time-based ECE/RFC 4122 UUID)。

但是为什么最开始说它是一个128位的唯一标识呢？这里明明字母位数是(8+4+4+4+12)*8=256位。

因为上面的字母是用的16进制，一个16进制只代表4个bit，所以应该是(8+4+4+4+12)*4=128位。

UUID使用的是大数位format([big-endian](https://en.wikipedia.org/wiki/Endianness#Big))，比如：

`00112233-4455-6677-8899-aabbccddeeff` 编码就是 `00 11 22 33` `44 55` `66 77` `88 99` `aa bb cc dd ee ff`.

UUID现有5种版本，是根据不同的使用场景划分的，而不是根据精度，所以Version5并不会比Version1精度高，在精度上，**大家都能保证唯一性，重复的概率近乎于0**。

### V1(date-time MAC address)

基于时间戳及MAC地址的UUID实现。它包括了48位的MAC地址和60位的时间戳，

接下来使用[ossp-uuid](https://web.archive.org/web/20190314034428/http://www.ossp.org/pkg/lib/uuid/)命令行创建5个UUID v1。(在Mac安装`brew install ossp-uuid`)

```shell
uuid -n 5 -v1
5b01c826-9561-11e9-9659-cb41250df352
5b01cc7c-9561-11e9-965a-57ad522dee7f
5b01cea2-9561-11e9-965b-a3d050dd0f99
5b01cf60-9561-11e9-965c-1b66505f58da
5b01d118-9561-11e9-965d-97354eb9e996
```

肉眼一看，有一种所有的UUID都很相似的感觉，几乎就要重复了！怎么回事？

其实v1为了保证唯一性，当时间精度不够时，会使用13~14位的clock sequence来扩展时间戳，比如：

当UUID的生产成速率太快，超过了系统时间的精度。时间戳的低位部分会每增加一个UUID就+1的操作来模拟更高精度的时间戳，换句话说，就是当系统时间精度无法区分2个UUID的时间先后顺序时，为了保证唯一性，会在其中一个UUID上+1。所以UUID重复的概率几乎为0，时间戳加扩展的clock sequence一共有74bits,(2的74次方，约为1.8后面加22个零),即在每个节点下，每秒可产生1630亿不重复的UUID(因为只精确到了秒,不再是74位，所以换算了一下)。

相对于其它版本，v1还加入48位的MAC地址，这依赖于网卡供应商能提供唯一的MAC地址，同时也可能通过它反查到对应的MAC地址。[Melissa](https://en.wikipedia.org/wiki/Melissa_(computer_virus))病毒就是这样做到的。

### V2(date-time Mac address)

这是最神秘的版本，RFC没有提供具体的实现细节，以至于大部分的UUID库都没有实现它，只在特定的场景(DCE security)才会用到。所以绝大数情况，我们也不会碰到它。

### V3,5(namespace name-based)

V3和V5都是通过hash namespace的标识符和名称生成的。V3使用[MD5](https://en.wikipedia.org/wiki/MD5)作为hash函数，V5则使用[SHA-1](https://en.wikipedia.org/wiki/SHA-1)。

因为里面没有不确定的部分，所以当namespace与输入参数确定时，得到的UUID都是确定唯一的。比如：

```shell
uuid -n 3 -v3 ns:URL http://www.baidu.com
2f67490d-55a4-395e-b540-457195f7aa95
2f67490d-55a4-395e-b540-457195f7aa95
2f67490d-55a4-395e-b540-457195f7aa95
```

可以看到这3个UUID都是一样的。

具体的流程就是

1. 把namespace和输入参数拼接在一起，如"http/wwwbaidu.com" ++ "/query=uuid"；
2. 使用MD5算法对拼接后的字串进行hash，截断为128位；
3. 把UUID的Version和variant字段都替换成固定的;
4. 如果需要to_string，需要转为16进制和加上连接符"-"。

把V3的hash算法由MD5换成SHA-1就成了V5。

### V4(random)

这个版本使用最为广泛:
```shell
uuid -n 5 -v4
a3535b78-69dd-4a9e-9a79-57e2ea28981b
a9ba3122-d89b-4855-85f1-92a018e5c457
7c59d031-a143-4676-a8ce-1b24200ab463
533831da-eab4-4c7d-a3f6-1e2da5a4c9a0
def539e8-d298-4575-b769-b55d7637b51e
```

其中4位代表版本，2-3位代表variant。余下的122-121位都是全部随机的。即有2的122次方(5.3后面36个0)个UUID。一个标准实现的UUID库在生成了2.71万亿个UUID会产生重复UUID的可能性也只有50%的概率

![uuid](https://user-images.githubusercontent.com/3116225/59972542-82f89000-95c3-11e9-8f58-0ed541d5e409.jpg)

这相当于每秒产生10亿的UUID，持续85年，而把这些UUID都存入文件，每个UUID占16bytes,总需要45 EB(exabytes)，比目前最大的数据库(PB)还要大很多倍。

### Summary

1. 如果只是需要生成一个唯一ID,你可以使用V1或V4。

   ```shell
   V1基于时间戳和Mac地址,这些ID有一定的规律(你给出一个，是有可能被猜出来下一个是多少的)，而且会暴露你的Mac地址。
   V4是完全随机(伪)的。
   ```

2. 如果对于相同的参数需要输出相同的UUID,你可以使用V3或V5。

   ```shell
   V3基于MD5 hash算法，如果需要考虑与其它系统的兼容性的话，就用它,因为它出来得早，大概率大家都是用它的。
   V5基于SHA-1 hash算法，这个是首选。
   ```

