---
layout: docs
title: Java Plugin
description: The Java plugin allows you compile and JAR your project's Java source code.
---

The Java plugin allows you to build Java projects. This plugin includes methods for compiling, jarring, and cleaning a Java project. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](docs/) for more information.

**LATEST VERSION: 1.0.0**


## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
java = loadPlugin(id: "org.savantbuild.plugin:java:1.0.0")
~~~~ 


## Layout

The default layout for a Java project's is:

~~~~ 
project
   |- src/main
   |       |- java        <- Your main Java source files go here
   |       |- resources   <- Your main resources (files that are needed at runtime and will be placed into the JAR)
   |
   |- src/test
   |       |- java        <- Your test Java source files go here
   |       |- resources   <- Your test resources (files that are needed at test-time and will be placed into the test JAR)
   |
   |- build
   |    |- classes
   |    |     |- main     <- The main Java source files are compiled into this directory and the main resources are copied into this directory
   |    |     |- test     <- The test Java source files are compiled into this directory and the test resources are copied into this directory
   |    |
   |    |- jars           <- The JAR files that contain your compiled Java files are created here
~~~~ 

You can change the layout via the **JavaLayout** class. The JavaPlugin class has a member field named **layout** that is the main instance of this class. Here's an example:

~~~~ 
java.layout.mainSourceDirectory = Paths.get("source/main/java")
java.layout.testSourceDirectory = Paths.get("source/test/java")
~~~~ 

This changes the location of the source files from **src/main/java** and **src/test/java** to **source/main/java** and **source/test/java**. You can also change these locations as well using the same method in the example above:

* docDirectory
* jarOutputDirectory
* mainResourceDirectory
* mainBuildDirectory
* testResourceDirectory
* testBuildDirectory


## Settings

The Java plugin has one required setting, which defines the Java version to compile with. The settings for the plugin are configured via the **JavaSettings** class. The **JavaPlugin** class has a field named **settings** that is the main instance of this class. Here is an example of configuring the plugin:

~~~~ groovy
java.settings.javaVersion = "1.7"
~~~~ 

This property specifies the version of Java to use, but you must also configure the location of the JDK on your computer. The location of the JDK is configured in the file **~/.savant/plugins/org.savantbuild.plugin.java.properties**. Here's an example of the **~/.savant/plugins/org.savantbuild.plugin.java.properties** file for a Mac:

~~~~ 
1.6=/Library/Java/JavaVirtualMachines/1.6.0_65-b14-462.jdk/Contents/Home
1.7=/Library/Java/JavaVirtualMachines/jdk1.7.0_10.jdk/Contents/Home
1.8=/Library/Java/JavaVirtualMachines/jdk1.8.0.jdk/Contents/Home
~~~~ 

This class has additional fields that allow you to configure the command-line arguments passed to the javac compiler, and the dependencies to include during compilation. Here are the additional parameters:

### Compiler Arguments

You can specify additional parameters to the Java compiler using the **compilerArguments** field on the settings class. Here is an example:

~~~~ groovy
java.settings.compilerArguments = "-g"
~~~~ 

This will enable debug information be included by the Java compiler. This is actually the default setting for this field.

### Doc Arguments

You can specify additional parameters to the Java doc generator using the **docArguments** field on the settings class. Here is an example:

~~~~ groovy
java.settings.docArguments = "-footer '<span>Copyright 2014 My Company</span>'"
~~~~ 

### Additional Library Directories

In some cases, you don't have access to a Savant repository that contains certain JAR files that you need for compilation. The best practice is to add the missing JAR files to a Savant repository and use Savant's dependency management system to manage them. However, some 3rd party JAR files might have unknown transitive dependencies. Rather than trying to figure out all of these complex dependencies, Savant provides you with a simple way to include additional JARs in the compile time classpath. You can specify 1 or more directories that contain JAR files and Savant will include all of the JAR files in the classpath. Here is an example:

~~~~ groovy
java.settings.libraryDirectories = ["lib"]
~~~~ 

### Compile Dependencies

You can change the dependencies that are included in the classpath during compilation. This is an advanced setting and should be only used in very special cases. This setting controlled by the **mainDependencies** and **testDependencies** fields. This fields are a List of Maps. Each Map defines a dependency group to include and also whether or not transitive dependencies are included and what transitive dependency groups are also included. Here is an example:

~~~~ groovy
java.settings.mainDependencies = [
    [group: "compile", transitive: false, fetchSource: false],
    [group: "provided", transitive: false, fetchSource: false]
  ]
java.settings.testDependencies =  [
    [group: "compile", transitive: false, fetchSource: false],
    [group: "test-compile", transitive: false, fetchSource: false],
    [group: "provided", transitive: false, fetchSource: false]
  ]

~~~~ 

This defines that the project's **compile** and **provided** dependency groups should be included when the main classes are compiled but transitive dependencies are not included. Likewise, this includes the **compile**, **test-compile** and **provided** dependency groups are included when the test classes are compiled, but transitive dependencies are not. This is the default setting and should be used in almost every project, but you can modify these setting if necessary. If you choose to change these definitions, the attributes you can specify for dependency definitions are:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| group | The dependency group to include | String | true |
| transitive | Determines if transitive dependencies are included or not | boolean | true |
| fetchSource | Determines if the source for the dependencies or downloaded or not | boolean | true |
| transitiveGroups | The transitive dependency groups to fetch. This is only used if transitive is set to true | List\<String> | false |

### JAR Manifest

You can control the manifest attributes for the JAR file that the Java plugin builds for your project. This plugin ensures that these manifest attributes are always set:

* Manifest-Version - this is set to **1.0**
* Implementation-Version - this is set to the project version
* Implementation-Vendor - this is set to the group and name of the project concatenated together with a dot separator
* Specification-Version - this is set to the project version
* Specification-Vendor - this is set to the group and name of the project concatenated together with a dot separator

Here is an example of setting additional manifest attributes or overriding the defaults listed above:

~~~~ groovy
groovy.settings.jarManifest = [
    "Implementation-Vendor": "My Company",
    "Specification-Vendor": "My Company",
    "Main-Class": "com.mycompany.Main"
  ]
~~~~ 


## Compiling

The **compile** method on the Java plugin allows you to compile the Java source files. This compiles both the main and test source files in the project and it also copies the main and test resource files to the build directory. Here's an example of calling this method:

~~~~ groovy
java.compile()
~~~~ 

You an also compile the main or test source files separately using the *compileMain** and **compileTest** methods like this:

~~~~ groovy
java.compileMain()
java.compileTest()
~~~~ 


## Jarring

The **jar** method on the Java plugin allows you to build the project Jar files. This produces two Jar files, the main Jar and the test Jar. The main Jar contains all of the files from the **build/classes/main** directory and the test Jar file contains all of the files from the **build/classes/test** directory. Here is an example of using this method.

~~~~ groovy
java.jar()
~~~~ 


## Cleaning

The **clean** method on the Java plugin simply deletes the **build** directory. Here's an example of using this method:

~~~~ groovy
java.clean()
~~~~ 


## Advanced Usage

The Java plugin also defines a few more advanced methods for compiling Java files in any directory to any directory or copying resources from any directory, to any directory. Refer to the JavaDoc of the plugin for more information.