---
layout: docs
title: Plugins
description: Plugins provide re-usable logic to your build files and are simple to configure and use. 
---

At this point, you should have a functional build file that might include targets, dependencies, and a workflow. However, it doesn't do very much. You could start writing your build using Groovy code directly inside the targets. This would require quite a bit of work though. Instead of writing this code yourself, you can leverage plugins to fill out your build.

We'll assume that your project is a Java project and that you need to compile Java source files. To accomplish this task, we will include the Java plugin and assign it to a variable. This will look like this:

~~~~ groovy
java = loadPlugin(id: "org.savantbuild.plugin:java:1.0.0")
~~~~ 

This code has to be put after the project and workflow definition because Savant uses the workflow to download and instantiate the plugin. The key to Savant's plugin mechanism is that Plugins are simply Groovy objects. They aren't abstracted in any way. That means after this line of code executes, the variable **java** will be in instance of the class org.savantbuild.plugin.java.JavaPlugin. Any public methods or fields on that instance can be invoked to perform parts of your build.

For the Java plugin, you need to define the version of the JDK to compile with (in case you have multiple JDKs installed or need to compile with a JDK besides JDK 8 which Savant requires to run).

~~~~ groovy
java = loadPlugin(id: "org.savantbuild.plugin:java:1.0.0")
java.settings.javaVersion = "1.7"
~~~~ 

Finally, you need to create a special configuration file for the Java plugin that tells Savant the location of the JDK. Create the file ~/.savant/plugins/org.savantbuild.plugin.java.properties and put the full path to the JDK base directory in it like this:

~~~~ 
1.7=/Library/Java/JavaVirtualMachines/jdk1.7.0_10.jdk/Contents/Home
~~~~ 

Now that you have loaded and configured the Java plugin, you can update your targets to use it. Plugins are simple Java objects and the public methods define their features. The public fields are often used to configure the plugin. Here's the build file again with the Java plugin calls added:

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  workflow {
    standard()
  }

  dependencies {
    group(name: "compile") {
      dependency(id: "org.apache.commons:commons-collections:3.1.0")
    }
  }
}

java = loadPlugin(id: "org.savantbuild.plugin:java:1.0.0")
java.settings.javaVersion = "1.7"

target(name: "clean", description: "Cleans out the build directory") {
  java.clean()
}

target(name: "compile", description: "Compiles the project") {
  java.compile()
}

target(name: "test", description: "Executes the projects tests", dependsOn: ["compile"]) {
  ...
}
~~~~ 

Most plugins provide detailed instructions on how to configure them at runtime. If you run Savant without the proper configuration, you should get a nice error message that tells you exactly how to configure the plugin to work properly.

[Next, we'll look at variables in Savant build file](variables)