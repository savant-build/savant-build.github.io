---
layout: docs
title: Tomcat Plugin
description: The Tomcat plugin allows you to setup Tomcat to run your project's web application.
---

The Tomcat plugin allows you to setup Tomcat to run your project's web application. This project has a number of settings that control its behavior, but nothing is required and if your project conforms to the standard layout, this plugin will work out of the box. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](docs/) for more information.

**LATEST VERSION: 1.0.0**


## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
tomcat = loadPlugin(id: "org.savantbuild.plugin:tomcat:1.0.0")
~~~~ 

## Layout

By default, this plugin uses this layout to setup Tomcat.

~~~~ 
project
   |- src/main/tomcat
   |       |- bin     <- Any source files that should be placed in the Tomcat bin directory (i.e. setenv.sh)
   |       |- conf    <- Any source files that should be placed in the Tomcat conf directory (i.e. server.xml)
   |
   |- web             <- You project's web application directory
   |
   |- build/apache-tomcat-8.0.12
   |    |- bin        <- The Tomcat bin directory after running the plugin
   |    |- conf       <- The Tomcat conf directory after running the plugin
   |    |- webapps
   |         |- ROOT  <- The Tomcat webapp directory that is a symlink back to the web directory
~~~~ 

## The Tomcat Dependency

In order for this plugin to work properly, you must define a dependency on a Tomcat tarball artifact in a Savant repository. This Tomcat artifact must be identical to the bundle that you can download from the Apache Tomcat website here http://tomcat.apache.org. Here is an example of defining this dependency:

~~~~ groovy
group(name: "tomcat") {
  dependency(id: "org.apache.tomcat:apache-tomcat:8.0.12:tar.gz")
}
~~~~ 

By default, this plugin uses the dependency group named **tomcat** and the artifact whose id is **org.apache.tomcat:apache-tomcat:8.0.12:tar.gz**. You can change this if necessary.

## Settings

The Tomcat plugin doesn't require any settings and will use Tomcat 8.0.12 by default. However, you can control how the plugin downloads and installs Tomcat using the TomcatSettings object. Here are the settings you can use:

### Version

The **version** field on the settings object controls the version of Tomcat to use. Here is an example:

~~~~ groovy
tomcat.settings.version = "7.0.40"
~~~~ 

This setting is used in other settings including the **buildBinDirectory** and **buildConfDirectory**. If you change the version, those settings are also updated. In most cases, the defaults for everything will work fine though. The default for the version setting is **8.0.12**.

### Build Directory

The **buildDirectory** field on the settings object sets the build directory that Tomcat is installed to. This installation process uses these steps:

1. Download the Tomcat artifact (as a tarball) from a Savant repository (using the artifact and workflow definitions of your project)
2. Extract the Tomcat artifact into the build directory

Here is an example of setting this directory:

~~~~ groovy
tomcat.settings.buildDirectory = Paths.get("output/tomcat")
~~~~ 

The default value for this setting is ~~~~ build~~~~ . If you use the Tomcat 8.0.12 tarball, it will be extract into this directory and result in Tomcat being installed to ~~~~ build/apache-tomcat-8.0.12~~~~ .

## Webapp Directory

The **buildWebDirectory** field on the settings object sets location of the web application directory within the Tomcat installation. This allows Tomcat to startup your webapp. Here is an example of setting this:

~~~~ groovy
tomcat.settings.buildWebDirectory = tomcat.settings.buildDirectory.resolve("apache-tomcat-${tomcat.settings.version}/webapps/ROOT")
~~~~ 

The plugin will actually create a symlink between the webapp directory in your project and this directory. This allows you to make changes to your webapp and quickly reload them in the browser without having to copy everything into Tomcat each time you make a change. The default value for this setting is ~~~~ build/apache-tomcat-8.0.12/webapps/ROOT~~~~ .

### Source Bin Directory

The **binDirectory** field on the settings object sets the location of the source bin directory. Any files in this directory will be copied into the Tomcat **bin** directory during the build. The Tomcat **bin** directory is calculated based on the **buildDirectory** setting and the **version** setting. The default location is ~~~~ build/apache-tomcat-8.0.12/bin~~~~  since the default **buildDirectory** is ~~~~ build~~~~  and the default version is ~~~~ 8.0.12~~~~ . Here is an example of setting this:

~~~~ groovy
binDirectory = Paths.get("src/main/tomcat/scripts")
~~~~ 

### Source Bin Directory

The **confDirectory** field on the settings object sets the location of the source conf directory. Any files in this directory will be copied into the Tomcat **conf** directory during the build. The Tomcat **conf** directory is calculated based on the **buildDirectory** setting and the **version** setting. The default location is ~~~~ build/apache-tomcat-8.0.12/conf~~~~  since the default **buildDirectory** is ~~~~ build~~~~  and the default version is ~~~~ 8.0.12~~~~ . Here is an example of setting this:

~~~~ groovy
confDirectory = Paths.get("src/main/tomcat/configu")
~~~~ 

### The Tomcat Dependency

In order to download the Tomcat tarball, this plugin uses the dependency group defined in the **dependencyGroup** and **dependencyID** fields of the settings object. Here is an example of setting these fields:

~~~~ groovy
tomcat.settings.dependencyGroup = "tomcat-group"
tomcat.settings.dependencyID = "org.apache.tomcat:apache-tomcat:7.0.40:tar.gz"
~~~~ 

## Building

Once you have configured the plugin and specified the Tomcat dependency in your project, you can execute the plugin like this:

~~~~ groovy
tomcat.build()
~~~~ 
