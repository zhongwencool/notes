---
title: Java反射和注解
subtitle: With great power comes great responsibility.
description: java反射,java注解,java,reflection,annotations
date: 2019-08-11
layout: default
bg_url: "assets/images/code.jpg"
category: Java
---

## Reflection

今天来挑战一下**如何在2000字以内把Reflection作用说明白**？

> Reflection is commonly used by programs which require the ability to examine or modify the runtime behavior of applications running in the Java virtual machine. This is a relatively advanced feature and should be used only by developers who have a strong grasp of the fundamentals of the language. With that caveat in mind, reflection is a powerful technique and can enable applications to perform operations which would otherwise be impossible.

https://docs.oracle.com/javase/tutorial/reflect/index.html

[Java Reflection](https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/)反射机制：Java可以**获取/调用**任意已加载类的所有信息(字段/方法/构造函数)。甚至改变类中成员的各种属性(又如private改成public)。官方API说明都在[java.lang.reflect](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/package-summary.html)。

假设目前我们只有奥迪车需要测试运行速度。

```java
package com.car.test;
// Car.java
class Car {int velocity;}
// Runnable.java
interface Runnable {public void run();}
// Audi.java
public class Audi extends Car implements Runnable {
    Audi(int velocity){this.velocity = velocity;}
    public void run() {
      String className = this.getClass().getSimpleName();
      System.out.println(className + " run " + velocity + "km/h");
    }
}
// CarFactory.java
public class CarFactory {
    public static void main(String[] args) {
      Audi audi = new Audi(120);
      audi.run();
    }
}
```

上面因为我们知道需要测试的只有`Audi`这一种车型，所以在main里面可以直接用调用对应的构造函数进行测试，但是当我们的车型增加时(特斯拉也来啦)，我们就不得不再次修改main函数。

```java
public class CarFactory {
  public static void main(String[] args) {        
    Tesla tesla = new tesla(150);
    tesla.run();
  }
}
```

为了更好的测试不断新加车型，同时不修改我们的工厂测试主函数。我们可以：

```java
package com.car.test;
// Tesla.java
// 省略以前已有不变的Audi
public class Tesla extends Car implements Runnable {
  Tesla(int velocity){this.velocity = velocity;}
  public void run() {
    String name = this.getClass().getSimpleName();
    System.out.println(name + " run " + velocity + "km/h");
  }
}
```



```java
package com.car.test;
// CarFactory.java
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class CarFactory {
  public static void main(String[] args) {
    try {
      //通过命令行把动态所需要测试的类名传入测试主函数。
      //args[0] = "com.car.test.Tesla".
      //args[1] = "140".
      //得到类名.此函数需catch异常 ClassNotFoundException.
      Class<?> c = Class.forName(args[0]);            
      //找到对应的构造函数并构造出实例
      int velocity = Integer.parseInt(args[1]);
      Object car = c.getDeclaredConstructor(int.class).newInstance(velocity);
      //找到需要测试的函数定义 
      Method method = c.getDeclaredMethod("run");
      //执行对应函数
      method.invoke(car);
    } catch (ClassNotFoundException e) {
       e.printStackTrace();
    } catch (NoSuchMethodException e) {
       e.printStackTrace();
    } catch (IllegalAccessException e) {
       e.printStackTrace();
    } catch (InstantiationException e) {
       e.printStackTrace();
    } catch (InvocationTargetException e) {
       e.printStackTrace();
    }
 }
}
```

这样只要我们在命令行传入对应的类名，就可以执行对应的测试函数啦。

完美做到新加车型，不需要修改主测试函数。这就是java反射机制在运行时的一个基本示例。但是对于一个静态语言来说，这种动态调用太过灵活，所以需要每一步都要小心(上面的每个函数都需要catch异常）

*With great power comes great responsibility.*

上面就是事先不知道我们需要测试的是什么类，只有到了运行时才能得到对应的类，这就是应用反射机制的常用场景。它在运用在真实场景中一个典型例子就是`Junit`,它过去枚举了类中所有的方法`getDeclaredMethods()`，并把以`testXXX`开头的方法假设为测试函数并执行它们。但在`JUit4`后使用了注解(annotations)来替换了它。

不过注解的本质也是通过反射来实现的。

## Annotations

在文章的开始处写反射是对类的属性/方法/构造函数的操作，并没有提到注解。但是通过Reflection API列表我们可以看到他有[getAnnotation](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/AnnotatedElement.html#getAnnotation-java.lang.Class-)之类的函数，所以注解也是可以读写操作的。不过想对于上面说的，稍微复杂一点。

解析注解的方式有两种，**编译期检查和运行期反射**。

### 1.编译期检查

常见到的就是`@Override`,编译器就会检查当前方法的方法签名是否真正重写了父类的某个方法，也就是比较父类中是否具有一个同样的方法签名。比如我们在上面的Car类中增加一个方法得到名字：

```java
package com.car.test;
//car.java
class Car {
  int velocity;
  public String getName() {return "Car";}
}
// Tesla.java
public class Tesla extends Car implements Runnable {
  Tesla(int velocity){this.velocity = velocity;}
  // @Override
  public get_name() { return "Tesla";}
  // 省略以前有的
 }
}
```

` Tesla`继承了`Car`，并想重写它的`getName`函数。但不小心手误写成了`get_name`，这时Tesla就同时有了这两个函数。为了避免这种低级错误，就使用`@Overide`，这告诉编译器，此方法是重写父类方法的，如果方法的定义(名字/返回值/参数)与父类不一致，则编译不通过。PS： 打开上面的注释，你就会得到一个编译报错。

可见`@Override`作用于方法，只在编译期解析，编译结束后，使命就完成了。不会把信息存到字节码中。

其它内置的注解还有

* `@Deprecated`标记当前类/方法/字段不再被推荐使用，下次版本可能会不在支持它。
* `@SuppressWarnings`明确告诉编译器这个警告我已发现了，你不用再来烦我。

### 2.元注解

为了在注解定义时规定生命周期(编译期/永久保存etc),作用范畴(字段/方法etc)，又引入了注解的注解，也就是**元注解**，它是主要用于修饰注解的注解。比如在`@override`的定义中

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

* `@Target`表示作用目标,`METHOD`作用于方法，还有其它的`FIELD,PARAMETER`之类的。
* `@Retention`表示生命周期`SOURCE`编译器可见，不写入class文件；`CLASS`类加载时丢弃，会写入class文件，`RUNTIME`永久保存，可以通过反射读取。
* `@Documented`是否在JavaDoc文档中出现。
* `Inherited`是否允许子类继承该注解。

### 3.运行期注解

下面我们稍微改造一个上面car的例子来说明一下运行期的注解操作。

通过新建一个注解(`@DriveAccess`来表示控制可以允许运行`run`函数进行函数(当然，你可以有更好的方法来做这件事，这里只是为了用来演示注解如何工作)。

```java
package com.car.test;
// DriveAccess.java
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME) // 永久保存
@Target(ElementType.METHOD) //作用于方法
public @interface DriveAccess {
  public boolean canDrive() default false; //默认返回false
}
// Tesla.java
public class Tesla extends Car implements Runnable {
  Tesla(int velocity) { this.velocity = velocity; }

  @Override
  public String getName() { return "Tesla"; }

  @DriveAccess(canDrive = true)
  public void run() {
    String name = this.getClass().getSimpleName();
    System.out.println(name + " run " + velocity + "km/h");
    }
}
// CarFactory.java
import java.lang.reflect.Method;

public class CarFactory {
  public static void main(String[] args) throws Exception {        
    Class<?> car = Class.forName(args[0]);
    for (Method method : car.getDeclaredMethods()) {
      if (method.isAnnotationPresent(DriveAccess.class)) {
        DriveAccess access = method.getAnnotation(DriveAccess.class);
        String methodName = method.toGenericString();
        if (access.canDrive()) {
          System.out.println(methodName + " method can be accessed... ");
          Object c = car.getDeclaredConstructor(int.class).newInstance(100);
          method.invoke(c);
        } else {
          System.out.println(methodName + " method can not be accessed... ");
        }
      }else {
       System.out.println(methodName + " don't have DriveAccess Annotation...");
     }
   }
}
}
}
```

运行 `java CarFactory com.car.test.Tesla`得到

```reStructuredText
public void com.car.test.Tesla.run() method can be accessed... 
Tesla run 100km/h
public java.lang.String com.car.test.Tesla.getName() don't have DriveAccess Annotation...
```

如果Tesla中的`canDirve`改成`false`则：

```
public void com.car.test.Tesla.run() method can not be accessed... 
public java.lang.String com.car.test.Tesla.getName() don't have DriveAccess Annotation...
```



## Summary

运用Java Reflection API可以读取/操作类中所有的元素。非常灵活强大，因为灵活，也会带来很多不确定的危险。所以如果可以用其它方法实现的，最好不要用反射。
