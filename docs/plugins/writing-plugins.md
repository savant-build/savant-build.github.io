---
layout: docs
title: Writing Plugins
description: Savant plugins are simple to write and test.
---

Plugins are the best part about Savant. They are simple and quick to write, simple to test, and easy to start using in your project via integration builds. Let's write a simple plugin that makes a file and puts some text in it.


## Project Layout

First, we need to create the project layout. You don't need to conform to this layout, but this layout works well with the current Savant plugins.

~~~~ 
project
   |- src/main/groovy                          <- Your Groovy plugin code will go here
   |
   |- src/test/groovy                          <- Your Groovy unit tests will go here
   |
   |- build.savant                             <- Your plugins's Savant build file
   |
~~~~ 

## Groovy Version

One thing to note is that Savant currently uses Groovy version **2.2.1**. This means that if you are building a plugin you MUST use this version of Groovy. The configuration in the Groovy plugin configuration file *~/.savant/plugins/org.savanbuild.plugin.groovy.properties* must be set like this:

~~~~ properties
2.2=some-path-to-groovy-2.2.1
~~~~ 


## Plugin Build File

Next, we need to add a Savant build file to our plugin. This build file goes in the root directory and is named **build.savant**. Here are the contents of a typical Groovy plugin's build script:

~~~~ groovy
project(group: "com.mycompany", name: "myplugin", version: "0.1.0", license: "Commercial") {
  workflow {
    standard()
  }

  dependencies {
    group(name: "provided") {
      dependency(id: "org.savantbuild:savant-core:1.0.0")
      dependency(id: "org.savantbuild:savant-dependency-management:1.0.0")
      dependency(id: "org.savantbuild:savant-utils:1.0.0")
    }
    group(name: "test-compile", export: false) {
      dependency(id: "org.testng:testng:6.8.7")
    }
  }

  publications {
    standard()
  }
}

// Plugins
dependency = loadPlugin(id: "org.savantbuild.plugin:dependency:1.0.0")
groovy = loadPlugin(id: "org.savantbuild.plugin:groovy:1.0.0")
groovyTestNG = loadPlugin(id: "org.savantbuild.plugin:groovy-testng:1.0.0")
release = loadPlugin(id: "org.savantbuild.plugin:release-git:1.0.0")

// Plugin settings
groovy.settings.groovyVersion = "4.0"
groovy.settings.javaVersion = "17"
groovy.settings.jarManifest = [
    "Savant-Plugin-Class": "com.mycompany.MyPlugin"
  ]
groovyTestNG.settings.groovyVersion = "4.0"
groovyTestNG.settings.javaVersion = "17"

target(name: "clean", description: "Cleans the project") {
  groovy.clean()
}

target(name: "compile", description: "Compiles the project") {
  groovy.compile()
}

target(name: "jar", description: "JARs the project", dependsOn: ["compile"]) {
  groovy.jar()
}

target(name: "test", description: "Runs the project's tests", dependsOn: ["jar"]) {
  groovyTestNG.test()
}

target(name: "int", description: "Releases a local integration build of the project", dependsOn: ["test"]) {
  dependency.integrate()
}

target(name: "release", description: "Releases a full version of the project", dependsOn: ["test"]) {
  release.release()
}
~~~~ 

## The Plugin Class

All plugins are simple Groovy classes (or they could be written in Java and it might be possible to write them in other JVM languages - honestly I haven't tried yet). Plugins must implement the marker interface **org.savantbuild.plugin.Plugin**. Start by creating a simple Groovy class such as **src/main/groovy/com/mycompany/MyPlugin.groovy**. Add this code to the plugin class to start:

~~~~ groovy
package com.mycompany

import org.savantbuild.plugin.Plugin

class MyPlugin implements Plugin {
}
~~~~ 

If you want to get some extra helper methods for your plugin, you can extend **org.savantbuild.plugin.groovy.BaseGroovyPlugin**, but this isn't required.

Your plugin class must have a constructor that takes the **Project** and **Output** objects like this:

~~~~ groovy
package com.mycompany

import org.savantbuild.plugin.groovy.BaseGroovyPlugin

class MyPlugin extends BaseGroovyPlugin {
  MyPlugin(project, output) {
    super(project output)
  }
}
~~~~ 

## Plugin Configuration

The simplest way to configure your plugin is by creating another Groovy class in your project and setting a field in the plugin class to a new instance. Let's make a configuration class that manages the file our plugin is going to write to and add it to our plugin. Create the file **src/main/groovy/com/mycomapny/MyPluginSettings.groovy** and add this code to it:

~~~~ groovy
package com.mycompany

import java.nio.file.Path

class MyPluginSettings {
  def file = Paths.get("foobar.txt")
}
~~~~ 

Now let's add the settings object to our plugin:

~~~~ groovy
package com.mycompany

import org.savantbuild.plugin.groovy.BaseGroovyPlugin

class MyPlugin extends BaseGroovyPlugin {
  def settings = new MyPluginSettings()

  MyPlugin(project, output) {
    super(project output)
  }
}
~~~~ 

## Plugin Methods

Lastly, you can define any number of public methods on your plugin. Each plugin method should be a separate feature of the plugin. Let's add our plugin method for creating the file and outputting some text into it:

~~~~ groovy
package com.mycompany

import java.nio.file.Files
import org.savantbuild.plugin.groovy.BaseGroovyPlugin

class MyPlugin extends BaseGroovyPlugin {
  def settings = new MyPluginSettings()

  MyPlugin(project, output) {
    super(project output)
  }

  def createFile() {
    Files.write(project.directory.resolve(settings.file), "Hello World".getBytes())
  }
}
~~~~ 

## Plugin Test

Now we need to test our plugin. Create the Groovy class **src/test/groovy/com/mycompany/MyPluginTest.groovy**. Add this code to this class:

~~~~ groovy
package com.mycompany

import org.savantbuild.domain.Project
import org.savantbuild.output.Output
import org.savantbuild.output.SystemOutOutput
import org.testng.annotations.Test

import java.nio.file.Files
import java.nio.file.Paths

import static org.testng.Assert.*

class JavaPluginTest {
  @Test
  def test() {
    Project project = new Project(Paths.get("build/test"), output)
    Output output = new SystemOutOutput(false)
    MyPlugin myPlugin = new MyPlugin(project, output)
    plugin.createFile()

    def bytes = Files.readAllBytes(Paths.get("build/test/foobar.txt"))
    assertEquals(new String(bytes), "Hello World")
  }
}
~~~~ 

Now we can run the tests by executing Savant from the project like this:

~~~~ 
$ sb test
~~~~ 

## Manifest entry

You might have noticed that in our **build.savant** file we added these lines of configuration:

~~~~ groovy
groovy.settings.jarManifest = [
    "Savant-Plugin-Class": "com.mycompany.MyPlugin"
  ]
~~~~ 

Savant uses the entry named **Savant-Plugin-Class** in the MANIFEST.MF file to load the plugin. You'll need to set this to point to your plugin class.

## Integrating

You can also run an integration build of our plugin and test it from another project. To do this, first run an integration build:

~~~~ 
$ sb int
~~~~ 

Next, go to another project and add this code to its build.savant file:

~~~~ groovy
myPlugin = loadPlugin("com.mycompany:myplugin:0.1.0-{integration}")
~~~~ 

You can now use the plugin from any project build file like this:

~~~~ groovy
target(name: "my-target") {
  myPlugin.createFile()
}
~~~~ 
