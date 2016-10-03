---
layout: docs
title: Spock Plugin
description: The Spock plugin allows you to run Spock tests in your project.
---

The Spock plugin allows you to execute [Spock](https://code.google.com/p/spock/) specifications.

**LATEST VERSION: 1.0.0**


## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
spock = loadPlugin(id: "org.savantbuild.plugin:spock:0.1.2")
~~~~ 

## Executing Tests

This plugin provides a single method to run the tests. Here is an example of calling this method:

~~~~ groovy
spock.test()
~~~~ 

Finally, you can run a single test(s) using the command-line **test** switch like this:

~~~~ shell
$ sb test --test=FooBarTest
$ sb test --test=FooBarTest --test=YetAnotherFooBarTest
~~~~ 

