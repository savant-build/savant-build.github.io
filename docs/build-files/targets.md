---
layout: docs
title: Build Targets
description: Savant uses build targets defined in the build file to execute your build.
---

Our Savant build file doesn't do anything yet, so let's add some targets.

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  ...
}

target(name: "clean", description: "Cleans out the build directory") {
  ...
}

target(name: "compile", description: "Compiles the project") {
  ...
}

target(name: "test", description: "Executes the projects tests", dependsOn: ["compile"]) {
  ...
}
~~~~ 

This is a fairly common build file that includes targets to clean the project, compile the project and run the tests. Notice that the **test** target depends on the **compile** target.

## Target Dependencies

Target dependencies are an ordered list. This means that Savant will ensure that dependent targets are executed in the order they are defined in the build file. For example:

~~~~ groovy
target(name: "one") {
  output.info("One")
}

target(name: "two") {
  output.info("Two")
}

target(name: "three", dependsOn: ["one", "two"]) {
  output.info("Three")
}
~~~~ 

If we run the build like this:

~~~~ shell
$ sb three
~~~~ 

Savant guarantees that the output will always be:

~~~~ 
One
Two
Three
~~~~ 

[Next, we'll cover generating output from the build file](output)