---
layout: docs
title: Java TestNG Plugin
description: The Java TestNG plugin allows you to execute your TestNG tests for your Java project.
---

The Java TestNG plugins allows you to execute TestNG tests in a Java project. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](docs/) for more information.

**LATEST VERSION: 1.0.0**


## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
javaTestNG = loadPlugin(id: "org.savantbuild.plugin:java-testng:1.0.0")
~~~~ 


## Settings

The Java TestNG plugin has one required setting, which specifies the Java version used to execute the tests with. The settings for the plugin are configured via the **JavaTestNGSettings** class. The **JavaTestNGPlugin** class has a field named **settings** that is the main instance of this class. Here is an example of configuring the plugin:

~~~~ groovy
javaTestNG.settings.javaVersion = "1.7"
~~~~ 

This property specifies the Java version to use, but you must also configure the location of the JDK on your computer. The location of the JDK is configured in the file **~/.savant/plugins/org.savantbuild.plugin.java.properties**.

Here's an example of the **~/.savant/plugins/org.savantbuild.plugin.java.properties** file for a Mac:

~~~~ 
1.6=/Library/Java/JavaVirtualMachines/1.6.0_65-b14-462.jdk/Contents/Home
1.7=/Library/Java/JavaVirtualMachines/jdk1.7.0_10.jdk/Contents/Home
1.8=/Library/Java/JavaVirtualMachines/jdk1.8.0.jdk/Contents/Home
~~~~ 

This class has additional fields that allow you to configure the command-line arguments passed to the Java when it is run, the verbosity of the TestNG output, and the location of the test reports. Here are the additional settings:

### JVM Arguments

You can specify additional parameters to the JVM when TestNG is run to execute your tests using the **jvmArguments** field on the settings class. Here is an example:

~~~~ groovy
javaTestNG.settings.jvmArguments = "-Dsome.param=true"
~~~~ 

### Verbosity

You can control the verbosity of the TestNG output using the **verbosity** field on the settings class. Here is an example:

~~~~ groovy
javaTestNG.settings.verbosity = 10
~~~~ 

The value is an integer where higher values mean more verbosity.

### Report Output Directory

The directory that the test reports are generated in can be changed using the **reportDirectory** field on the settings class. Here is an example:

~~~~ groovy
javaTestNG.settings.reportDirectory = Paths.get("build/reports/tests")
~~~~ 

### Dependencies

You can configure the dependencies that are included when TestNG is run using the **dependencies** field on the settings class. Here is an example:

~~~~ groovy
javaTestNG.settings.dependencies = [
    [group: "provided", transitive: true, fetchSource: false],
    [group: "compile", transitive: true, fetchSource: false],
    [group: "runtime", transitive: true, fetchSource: false],
    [group: "test-compile", transitive: true, fetchSource: false],
    [group: "test-runtime", transitive: true, fetchSource: false]
  ]
~~~~ 

This configuration is the default. It ensures that the **provided**, **compile**, **runtime**, **test-compile**, **test-runtime** and all of their transitive dependencies in any groups are included. If you want to configure a different set of groups, here are the attributes you can use for each dependency definition (the Maps inside the main list):

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| group | The dependency group to include | String | true |
| transitive | Determines if transitive dependencies are included or not | boolean | true |
| fetchSource | Determines if the source for the dependencies or downloaded or not | boolean | true |
| transitiveGroups | The transitive dependency groups to fetch. This is only used if transitive is set to true | List\<String> | false |


## Executing Tests

This plugin provides a single method to run the tests. Here is an example of calling this method:

~~~~ groovy
javaTestNG.test()
~~~~ 

You can also control the TestNG groups that are run by passing in a set of groups to the **test** method like this:

~~~~ groovy
groovyTestNG.test(groups: ["unit"])
~~~~ 

Finally, you can run one more tests using the command-line **test** switch like this:

~~~~ shell
$ sb test --test=FooBarTest --test=BazTest
~~~~

You may optionally provide a fully qualified test name if you have more than one test named `FooBarTest`. For example:

~~~~ shell
$ sb test --test=org.savantbuild.action.FooBarTest
~~~~

You may optionally run only tests that failed from the last execution. 

~~~~ shell
$ sb test --onlyFailed
~~~~