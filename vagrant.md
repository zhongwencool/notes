---
title: Vagrant必知必会
desc: 10分钟掌握Vagrant
layout: default
---

### 一、vagrant定位

[Vagrant](https://www.vagrantup.com)是指[HashiCorp](https://www.hashicorp.com/)开源的开箱即用，快速配置开发环境的命令行工具。官宣Sologan: Development Environments Made Easy，旨在一键配置开发环境，是团队成员间同步开发环境的绝佳助手。

Vagrant可以让你用简单的命令行在一分钟内就完成：

* 创建一个你所指定的操作系统(Ubuntu/CentOS/etc…)虚拟机（以下简称VM:*virtual machines* ）。
* 配置VM的物理属性（比如内存，CPU核数)。
* 配置VM的网络配置，让你的宿主机器/同一网络的其它机器都能访问。
* 配置宿主与VM的同步文件夹。
* 设置VM的hostname。
* 一键配置VM的ssh。

vagrant内部依赖已有成熟的VM技术(VritualBox/VMware/etc)。让vagrant结构简单但功能强大。

![vgrant_workflow](https://user-images.githubusercontent.com/3116225/48494500-f9ccee00-e868-11e8-885f-7edd43be1117.jpg)
vagrant官网提供主流的操作系统的各种版本镜像(在vagrant中都称为Box)，[可供下载](https://vagrantcloud.com/boxes/search)。丰富的box镜像也是vagrant大范围流行的原因之一。

| Developer | 第一个Release版本 | 开发语言 | 系统要求                     |
| --------- | ----------------- | -------- | ---------------------------- |
| HashiCorp | 2010年            | Ruby     | Linux/FreeBSD/OS X/Microsoft |

总之，vagrant操作简单但功能强大，只要一分钟配置，就可以创建出需要的沙箱(sandbox)环境。在正式开始前你需要花几分钟(主要是下载耗时)在官网上下载安装好[virtualbox](https://www.virtualbox.org/wiki/Downloads)和[vagrant](https://www.vagrantup.com/docs/installation/)。

### 二、基本流程(workflow)

![vagrant_command](https://user-images.githubusercontent.com/3116225/48494499-f9345780-e868-11e8-963e-8128d91cb6c1.jpg)
#### 2.1 项目设置

```shell
mkdir vagrant_paradise
cd vagrant_paradise
vagrant init
```

`vagrant init` 初始化项目，与`git init`类似，会在当前的目录下生成一个[Vagrantfile](https://www.vagrantup.com/docs/vagrantfile/)的文件，它有两个作用：

* 确定项目的根目录。很多的配置选项都与这个根目录有关。
* 指定VM的具体系统版本，想要预装的软件及如何与这个系统交互(ssh)。

团队间需要保持相同的环境，只需要用版本管理工具(git)管理此文件(不需要加入根目录下的.vagrant文件夹)。

#### 2.2 Boxes

vagrant官方提供了各种操作系统版本的[镜像文件box](https://vagrantcloud.com/boxes/search)。比如安装CentOS7操作系统。

```shell
vagrant box add centos/7
```

默认会从[HashiCorp's Vagrant Cloud box](https://vagrantcloud.com/boxes/search)使用HTTPS下载，你可以在这上面找到各种版本的box。

如果这些定制都不满足你的需求(这种情况很少出现)，你也可以指定URL下载自制的box。

```
vagrant box add centos/7 https://github.com/CommanderK5/packer-centos-template/releases/download/0.7.2/vagrant-centos-7.2.box
```

boxes下载后是在全局保存的，每个项目都只是clone下载的基础镜像，无法改变此基础镜像。

下载镜像需要几分钟（时间取决于你的网络状态），完成时可见Vagrantfile中的配置会变成：

```ruby
Vagrant.configure("2") do |config|
  
  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "centOS/7"
```

#### 2.3 启动并ssh进入

启动操作系统：

```shell
vagrant up
```

此命令可以在1分钟内启动一个配置centos7系统的VM，vagrant是命令行式的，并没有像直接很virtualbox启动时对应的UI。除了可以使用`vagrant status`查看状态外，还可以通过看是否可以ssh来检查VM是否正常。

```shell
vagrant ssh
```

此命令相当于你使用`ssh vagrant@127.0.0.1 -p 2222`直接进入到VM中。你可以使用`Ctrl+D`退出ssh会话。

你可以使用`vagrant ssh-config`查看当前的ssh配置情况。默认使用的用户是vagrant用户，如果你想使用root(当然不推荐这么干)，也是可以的。

```ruby
Vagrant.configure("2") do |config|  
  config.ssh.username = "root"
  config.ssh.private_key_path="/xyz/.vagrant/machines/default/virtualbox/private_key" 
```

其它高级选项可见[文档](https://www.vagrantup.com/docs/vagrantfile/ssh_settings.html)。

#### 2.4 停止

如果你想暂时挂起VM，可以使用

```shell
vagrant halt
```

vagrant首先会使用guest用户执行`shutdown`尝试优雅地关闭VM。如果关闭失败，就会直接关闭VM的电源（`vagrant halt —force`也可直接关闭电源）。

#### 2.5 销毁

当你想彻底销毁VM时，可以使用

```shell
vagrant destory
```

它会删除与除了共享文件夹外的所有资源，他不会释放box(全局的)，如果你需要删除box可以使用

```shell
vagrant box remove centos/7
```

### 三、同步文件夹(Synced Folds)

默认的同步文件夹是宿主的项目根目录(*Vagrantfile*所在目录)与VM的`/vagrant/`目录，可以看到两个目录下的*Vagrantfile*是同一个文件。这个共享文件夹就是宿主与VM的桥梁，一般把代码都放在这个共享文件夹下。

👉如何修改/更新/禁止这个共享文件夹？

直接修改Vagrantfile中的*config.vm.synced_folder*，然后执行`vagrant reload`。

```ruby
Vagrant.configure("2") do |config|
  # other config here
  config.vm.synced_folder "src/", "/srv/website"
end
```

第一个参数为宿主机器的目录，如果使用相对路径，相对的是项目的根目录。第二个参数是VM中的路径，必须是绝对路径，如果不存在，就会递归创建。共享文件夹默认的*owner/group*权限是和ssh的用户一致，此文件夹的父件夹*owner/group*被设置root。

如果你想改变上面的默认权限或禁止使用共享文件夹，[点击查看官方文档](https://www.vagrantup.com/docs/synced-folders/basic_usage.html#options)。

💡: 最好不要把共享文件夹指定为符号链接。大多数情况下可以工作，少数情况下会莫名出错。

### 四、初始化脚本(Provisioning)

下载的box只是别人打包完成的基础镜像，我们需要在基础镜像上根据个性化需求再次初始化。比如需要安装nginx，以前我们会直接通过ssh后使用命令行安装它，不便的是团队中每个成员都必须按照各种指引自己手动去安装定制软件。vagrant把这些前期准备的步骤统称为provision，可以通过`vagrant up`或`vagrant reload —provision`时来完成。

1. 在根目录创建启动脚本`bootstrap.sh`。																	

   ```shell
   #!/usr/bin/env bash
   yum install -y nginx
   ```

   💡: 脚本中不允许出现与需要用户输入确认(交互)的行为，所以`yum`加了一个`-y`选项。

2. 在Vagrantfile文件中指定脚本路径。

   ```ruby
   Vagrant.configure("2") do |config|
     config.vm.box = "centos/7"
     config.vm.provision :shell, path: "bootstrap.sh"
   end
   ```

3. 执行provision。

   ``` shell
   vagrant up
   ```

   💡: 如果你的VM已是启动状态，可以使用`vagrant reload --provision`或`vagrant provision`，provision并不会每次`vagrant up`都执行，执行的时机是provision从来没有执行过，或你明确告诉它。

4. 在VM中验证nginx是否可用。

   ```shell
   curl 127.0.0.1
   ```

### 五、网络设置(Network)

在上节中我们只是在VM中使用`curl`验证，在宿主机器上是不行的，因为我们并没有把VM的80端口映射到宿主机器上。那么我们现在把宿主机器的8080端口转发到VM的80端口，以便能在VM外部访问。

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.network :forwarded_port, guest: 80, host: 8080
end
```

此时使用宿主机器的浏览器打开`http://127.0.0.1:8080`就可以看到Nginx的欢迎界面。
PS:如果还是无法访问，需要把你的防火墙关闭(VM的root密码默认为*vagrant*)。

```shell
sudo systemctl stop firewalld
```

💡: 如果需要转发多个端口，可以写多行。

```ruby
config.vm.network :forwarded_port, guest: 80, host: 8080
config.vm.network :forwarded_port, guest: 81, host: 8081
```

网络设置中`config.vm.network`默认为*public_network*，如果你需要设置为*private_network*或想搞清楚这两者的具体区别，可以[查看这些高级设置](https://www.vagrantup.com/docs/networking/private_network.html)。

### 六、清理(Teardown)

vagrant停止有3种方式(suspend,halt,destroy)，退出时清理的程度一级级加深。

``` shell
vagrant suspend
```

挂起（supending)，会保存当前运行的所有状态，当你再次使用`vagrant up`启动时，它会还原到上次挂起时的状态。这样的好处是启动和关闭都非常快(5~10秒)，缺点就是VM会大量占用你的磁盘空间。

```shell
vagrant halt
```

停止(halting)，首先使用guest用户尝试使用`shutdown`关闭，如果无法关闭，就直接关闭VM的电源。它的好处是停止释放资源很彻底，不会占额外的硬盘空间(只有VM本身的)，缺点是这种冷启动会比suspend慢。

```shell
vagrant destroy
```

销毁(destroying)，它会移除除共享目录外VM所有痕迹。好处是不占任何空间。缺点是当再次`vagrant up`，会重新进行provision。

### 七、参考资料

* [Vagrant官方网站](https://www.vagrantup.com)。
* [Vagrantfile所有参数详解](https://www.vagrantup.com/docs/vagrantfile/)。
* [Vagrant Boxes官方查询](https://atlas.hashicorp.com/boxes/search)。
* [Vagrant Boxes非官方查询](http://www.vagrantbox.es/)。