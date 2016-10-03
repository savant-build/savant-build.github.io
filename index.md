---
layout: homepage
title: Welcome to the Savant Build System
description: Savant is a modern build tool that you don't have to battle with. It just works!
---

## Getting started is as simple as:

~~~~ shell
$ wget http://savant.inversoft.org/org/savantbuild/savant-core/1.0.0/savant-1.0.0.tar.gz
$ tar -xzvf
$ savant-1.0.0/bin/sb --version
~~~~

## Build files are as simple as:

~~~~ groovy
project(group: "org.example", name: "savant-example", version: "0.1.0", licenses: ["ApacheV2_0"])

groovy = loadPlugin(id: "org.savantbuild.plugin:groovy:1.0.0")
groovy.settings.groovyVersion = "2.4"
groovy.settings.javaVersion = "1.8"

target(name: "clean", description: "Cleans the project") {
  groovy.clean()
}

target(name: "compile", description: "Compiles the project") {
  groovy.compile()
}
~~~~

## What is Savant?

Savant is a modern build tool that uses a Groovy DSL for the build files. Savant is fully SemVer compliant and
handles the most complex dependency graphs easily. Savant uses a plugin approach to quickly add complex build
logic to a project.

The main difference between Savant and other build systems is that Savant does not allow plugins to add targets
to the build. This decision makes Savant declarative and simplifies the entire system by removing the need to
manage inter-plugin dependencies (i.e. the JUnit plugin depends on the Java plugin).

If you are interested in learning more about this design decision, check out the [Plugin Doc Page](/docs/plugins/)
