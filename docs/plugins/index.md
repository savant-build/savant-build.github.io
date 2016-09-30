---
layout: docs
title: Plugins
description: Savant plugins provide re-usable build logic but not build targets.
---

Savant uses a different approach to plugins that most other build tools. Savant's approach is similar to the approach used by Ant. Savant plugins provide reusable logic that build files can leverage. However, plugins do not provide build targets.

# Build Targets

The decision to move build targets out of plugins and back into the build files was intentional. Build systems that allow plugins to define build targets often run into the issue of plugin dependencies.

Here's a simple example. Let's say you have a Java project that you want to compile and test. In Gradle or Maven, you might use the **Java** plugin and the **JUnit** plugin. The **Java** plugin creates these build targets in your project:

* clean
* compile
* jar

The **JUnit** plugin creates these build targets:

* test

The **test** build target will naturally need to ensure that all the source files are compiled first. There are a few ways to accomplish this:

1. The **JUnit** plugin must depend on (or extend) the **Java** plugin
2. The build system can define build stages and each plugin can "attach" to different stages

Solution #1 quickly becomes messy and difficult to manage. What if you want to inject some new build logic between the **compile** build target and the **test** build target. This is difficult because there is a strong coupling between the **Java** and **JUnit** plugins that is difficult to modify.
 
Solution #2 is equally as cumbersome. Each plugin now has to add its build targets to different stages. However, the order of targets within stages might be important but could be difficult to define and manage. Stages are often very arbitrarily named and defined and might not map to your project's needs. Sometimes you end up creating new stages just to get things to execute in the correct order. 

Rather that try to solve these issues and add massive amounts of complexity, Savant moves the build targets back into the build file and allows the developer to define the order build targets are run in as well as the dependencies between the targets.

# Plugin Methods

Savant plugins are simple objects. Methods on the object can be invoked by a build file to perform a set of tasks. This method makes it simple to write build files using Savant plugins.

Here is an example of how simple it is to compile C# code using Savant:

~~~~ groovy
csharp = loadPlugin("org.savantbuild.plugin:csharp:1.0.0")
csharp.settings.sdkVersion = "3.5"

target(name: "compile") {
  csharp.compile()
}
~~~~

That's it! It couldn't be simpler