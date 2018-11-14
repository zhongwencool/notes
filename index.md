---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

## Vagrant必知必会



### 一、了解vagrant

Vagrant 本意是[无所事事的流浪汉](https://www.dictionary.com/browse/vagrant)。 但今天出场的[vagrant](https://www.vagrantup.com)是指[HashiCorp](https://www.hashicorp.com/)开源的快速模拟完整开发环境的工具。旨在极速配置出和生产环境一致的开发环境，提高团队的开发效率。让开发者在本地快速验证新的改动，快速迭代的绝佳助手。

vagrant可以让你用一个简单的命令在一分钟内就完成：

* 创建一个你所指定的操作系统(Ubuntu/CentOS/etc...)虚拟机。
* 修改虚拟机的物理属性（比如内存，CPU核数)。
* 配置虚拟机的网络配置，让你的宿主机器/同一网络的其它机器都能访问。
* 配置宿主与虚拟机的同步文件夹。
* 设置虚拟机的hostname。
* 自动配置ssh。

vagrant内部依赖已有成熟的虚拟机技术(VritualBox/VMware/etc)。让vagrant结构简单但功能强大。

![vagrant workflow](https://zhongwencool.github.io/notes/_asset/vagrant_workflow.jpg)

vagrant官网提供主流的操作系统的各种版本镜像(在vagrant中都称为Box)，[可供下载](https://vagrantcloud.com/boxes/search)。丰富的box镜像也是vagrant大范围流行的基础。

| Developer | 第一个Release版本 | 开发语言 | 系统要求                     |
| --------- | ----------------- | -------- | ---------------------------- |
| HashiCorp | 2010年            | Ruby     | Linux/FreeBSD/OS X/Microsoft |

总之，vagrant操作简单但功能强大，只要一分钟配置，就可以创建出需要的沙箱(sandbox)环境。在正式开始前你需要花几分钟(主要是下载耗时)在官网上下载安装好[virtualbox](https://www.virtualbox.org/wiki/Downloads)和[vagrant](https://www.vagrantup.com/docs/installation/)。

### 二、基本工作流程

![vagrant commands](https://zhongwencool.github.io/notes/_asset/vagrant_command.jpg)
#### 2.1 项目设置

```shell
mkdir vagrant_paradise
cd vagrant_paradise
vagrant init
```

`vagrant init` 初始化项目，与`git init`类似，会在当前的目录下生成一个[Vagrantfile](https://www.vagrantup.com/docs/vagrantfile/)的文件，它有两个作用：

* 确定项目的根目录。很多的配置选项都与这个根目录有关。
* 指定虚拟机的具体系统版本，想要预装的软件及如何与这个系统交互(ssh)。

团队间需要保持相同的环境，只需要用版本管理工具(git)管理此文件(不需要加入根目录下的.vagrant文件夹)。

#### 2.2 Boxes

vagrant官方提供了各种操作系统版本的[镜像文件box](https://vagrantcloud.com/boxes/search)。比如安装最新版CentOS的操作系统。

```shell
vagrant box add centos/7
```

默认会从[HashiCorp's Vagrant Cloud box](https://vagrantcloud.com/boxes/search)使用HTTPS下载，你可以在这上面找到各种别人使用的镜像。

当然你也可以指定URL下载自制的box。

```
vagrant box add centos/7 https://github.com/CommanderK5/packer-centos-template/releases/download/0.7.2/vagrant-centos-7.2.box
```

boxes下载后是在全局保存的，每个项目都只是clone最基础的镜像，无法改变基础镜像。

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

此命令可以在1分钟内启动一个配置centos7系统的虚拟机，vagrant是命令行式的，并没有像直接很virtualbox启动时对应的UI。除了可以使用`vagrant status`查看状态外，还可以通过看是否可以ssh来检查虚拟机是否正常。

```shell
vagrant ssh
```

此命令相当于你使用`ssh vagrant@127.0.0.1 -p 2222`直接进入到虚拟机中。你可以使用`Ctrl+D`退出ssh会话。

todo 高级如何改ssh配置及使用root权限？

#### 2.4 停止

如果你想暂时挂起虚拟机，可以使用

```shell
vagrant halt
```

vagrant首先会使用guest用户执行`shutdown`尝试优雅地关闭虚拟机。如果关闭失败，就会直接关闭虚拟机的电源（`vagrant halt --force`直接关闭电源）。

#### 2.5 销毁

当你想彻底销毁虚拟机时，可以使用

```shell
vagrant destory
```

它只会删除与除了共享文件夹外的所有资源，他不会释放box（全局的），如果你需要删除box可以使用

```shell
vagrant box remove centos/7
```

### 三、共享文件夹(Synced Folds)

默认的共享文件夹是宿主的项目根目录与虚拟机的`/home/vagrant/`目录，可以看到两个目录下的*Vagrantfile*是一样的。改动也是可以同步的。这个共享文件夹就是宿主与虚拟机的桥梁。

### 四、初始化脚本(Provisioning)

下载的box只是别人封装好的一个基础box，我们需要在基础box根据自个的个性化需求再次初始化。比如需要安装nginx，以前我们会直接通过ssh后使用命令行安装它，导致团队中每个成员都必须按照各种指引自己手动去安装定制软件。vagrant把这些前期准备的工作都统一为provision，可以通过`vagrant up`或`vagrant reload —provision`时来完成。

1. 在根目录创建启动脚本`bootstrap.sh`。																	

   ```shell
   #!/usr/bin/env bash
   yum install -y nginx
   ```

   **Tips:** 脚本中不允许出现与需要用户输入确认(交互)的行为，所以上面有一个`-y`选项。

2. 在Vagrantfile文件中指定脚本路径。

   ```ruby
   Vagrant.configure("2") do |config|
     config.vm.box = "centos/7"
     config.vm.provision :shell, path: "bootstrap.sh"
   end
   ```

3. 启动虚拟机。

   ``` shell
   vagrant up
   ```

   PS: 如果你的虚拟机已是启动状态，可以使用`vagrant reload --provision`快速reload。

4. 在虚拟机中验证nginx是否可用。

   ```shell
   curl 127.0.0.1
   ```

### 五、网络设置(Network)

在上节中我们只是在虚拟机中使用`curl`验证，在宿主机器上是不行的，因为我们并没有把虚拟机的80端口映射到宿主机器上。那么我们现在把宿主机器的8080端口转发到虚拟机的80端口，以便能在虚拟机外部访问。

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.network :forwarded_port, guest: 80, host: 8080
end
```

此时使用宿主机器的浏览器打开`http://127.0.0.1:8080`就可以看到Nginx的欢迎界面。
PS:如果还是无法访问，需要把你的防火墙关闭(虚拟机的root密码默认为*vagrant*)。

```shell
sudo systemctl stop firewalld
```

**Tips:** 如果需要转发多个端口，可以写多行。

```ruby
config.vm.network :forwarded_port, guest: 80, host: 8080
config.vm.network :forwarded_port, guest: 81, host: 8081
```

todo: 高级设置Nat private,public及图示。

### 六、清理(Teardown)

vagrant停止有3种方式(suspend,halt,destroy)，退出时清理的程度一级级加深。

``` shell
vagrant suspend
```

挂起（supending)，会保存当前运行的所有状态，当你再次使用`vagrant up`启动时，它会还原到上次挂起时的状态。这样的好处是启动和关闭都非常快(5~10秒)，缺点就是虚拟机会大量占用你的磁盘空间。

```shell
vagrant halt
```

停止(halting)，首先使用guest用户尝试使用`shutdown`关闭，如果无法关闭，就直接关闭虚拟机的电源。它的好处是停止释放资源很彻底，不会占额外的硬盘空间(只有虚拟机本身的)，缺点是冷启动会慢一些。

```shell
vagrant destroy
```

销毁(destroying)，它会移除除共享目录外虚拟机所有痕迹。好处是不占任何空间。缺点是当再次`vagrant up`，会重新provision。



### 七、高阶

### 八、最佳实践



####  TODO

思维导图
