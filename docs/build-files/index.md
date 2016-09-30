---
layout: docs
title: Build Files
description: Learn the basics of writing Savant build files including project information, dependencies and targets.
---

In this quick start guide to Savant build files we’ll cover how to define build dependencies and build targets.

## 1. First, let’s set up a simple build file for a new project called _HelloWorld_.

Here is how we define this project and its version:

~~~~ groovy
project(group: "org.inversoft.savant.example", name: "HelloWorld", version: "1.0", licenses: ["ApacheV2_0"]) {
  // Project info goes here
}
~~~~ 

A project definition needs a group, name, version and a license. You can ignore the licenses definition for now, we’ll cover that in a separate quick start guide.

The group name is usually a reverse DNS name (notice that the org is first not last) that identifies the owners of the project. The name is the project’s formal name and the version is the project’s [Semantic Version](http://semver.org/).


## 2. Next we can define the other libraries and frameworks that our project depends on.

We place the dependencies inside the project definition and break them into groups. It looks like this:

~~~~ groovy
project(group: "org.inversoft.savant.example", name: "HelloWorld", version: "1.0", licenses: ["ApacheV2_0"]) {
  dependencies {
    group(name: "compile") {
      dependency(id: "org.apache.commons:commons-collections:3.1")
    }
    group(name: "test-compile") {
      dependency(id: "org.testng:testng:6.8.7")
    }
  }
}
~~~~ 

These dependency directives tell Savant that in order to compile our source code Savant needs to include Commons Collections version 3.1. Likewise, in order to compile our test source code, Savant will need to include TestNG version 6.8.7.

Savant always uses a shorthand notation for dependencies. This notation is in this form:

~~~~ groovy
<group>:<name>:<version>
~~~~ 


Savant’s dependency group definition is completely free-form. We could have named the groups above "compile-time" and "test-compile-time".
However, there are a few standard names that are used by Savant plugins. These are:

| group | description |
| ----- | ----------- |
| compile | Used during compilation |
| provided | User during compilation, but not at runtime because these dependencies are provided by an external source (i.e. a servlet container) |
| compile-optional | Used during compilation, but not included at runtime because they are optional |
| runtime | Used at runtime and not included during compilation (used mostly for API implementations like implementers of the SLF4J logging API) |
| test-compile | Used during compilation of test source code |
| test-runtime | Used to run the tests |


## 3. Next, let’s add some build targets to our project.

The first target we need to add is a compile target that will compile all of our source code. Compiling everything is not a trivial task. Because Savant uses a Groovy DSL, you could simply write all of the Groovy code needed to compile your code. Writing this much code would be tedious. For common tasks such as compiling, Savant uses plugins to provide reusable features. In this case, we will use the Java plugin since our project is a Java project.

Plugins are dependencies just like the project dependencies we added above. However, they are note included in a dependency group, instead, we simply define the plugin dependency using the _loadPlugin_ directive. Here is how we include tje Java plugin in our build file:

~~~~ groovy
java = loadPlugin(id: "org.savantbuild.plugin:java:0.2.0")
~~~~ 

_Notice that this looks very similar to a normal dependency declaration, we have only changed *dependency* to *loadPlugin*._
This directive loads the Java plugin version 0.2.0 and the plugin reference is assigned to a variable named ‘java’. Now that we have loaded the plugin, we need to configure it. The Java plugin requires us to define the JDK we are using to compile. We’ll start by setting the java version using the settings of the plugin like this:

~~~~ groovy
java.settings.javaVersion = "1.8"
~~~~ 

## 4. Next, we need to create a configuration file for the Java plugin.

Now that we have told the plugin we want to use Java version 1.8, we'll need to tell Savant the location of JDK 1.8 on our computer.
Forcing this configuration file to be in the users home directory allows you to have Java in different locations on different computers.

We need to create the file `~/.savant/plugins/org.savantbuild.plugin.java.properties` and add this configuration:

~~~~ groovy
1.8=/Library/Java/JavaVirtualMachines/jdk1.8.0.jdk/Contents/Home
~~~~ 

This tells Savant where JDK 1.8 lives on my computer. The path to the JDK may be different on your computer.

## 5. Now that the Java plugin is configured to use JDK 1.8.

We can use it in our build target like this:

~~~~ groovy
target(name: "compile", description: "Compiles everything") {
  java.compile()
}
~~~~ 

This will tell Savant that we have a build target named _compile_ and that it will execute the Java plugin’s compile() method. This method on the Java plugin executes the javac command using the path we configured above. It will include the dependencies we configured in our build file on the classpath when executing the javac command.

## 6. Finally, we can execute our build from the command line.

Execute the build like this:

~~~~ bash
$ sb compile
~~~~ 

This is just a brief overview of how Savant build files are written. In summary, we've demonstrated the following:
  * The creation of the Savant project definition
  * Defined two new dependency groups
  * Loaded and configured the Java plugin
  * Requested the Java plugin compile our project within a ‘_compile_’ target
  * Successfully executed the Savant build command to run the new ‘_compile_’ target.