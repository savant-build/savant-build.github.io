---
layout: docs
title: Webapp Plugin
description: The Webapp plugin allows you to setup your web application to run inside a JEE container.
---

This plugin allows you to build a web application for your project. This conforms to the JEE specification for web applications. This plugin has a number of settings that control how it behaves. In most cases, the defaults will work fine though. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](docs/) for more information.

**LATEST VERSION: 1.0.0**


## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
webapp = loadPlugin(id: "org.savantbuild.plugin:webapp:1.0.0")
~~~~ 

## Layout

By default, this plugin uses this layout to setup Tomcat.

~~~~ 
project
   |- web               <- You project's web application directory
   |  |- WEB-INF
   |  |    |- classes   <- Often when configuration files are placed
   |  |    |- lib       <- Where the project dependencies and JAR files are placed
~~~~ 

## Settings

This plugin has a number of settings that control how it behaves. These settings are:

### Cleaning WEB-INF/classes

By default, the plugin doesn't clean up the WEB-INF/classes directory. You can place configuration files in that directory and the plugin will leave them there. However, some projects prefer to store configuration files outside of the web application directory and copy them into the web application during the build. To force the plugin to clean the WEB-INF/classes directory you can set the **cleanClassesDirectory** field on the settings object. Here is an example of setting this:

~~~~ groovy
webapp.settings.cleanClassesDirectory = true
~~~~ 

### Copying Web Resources

If you enable cleaning of the WEB-INF/classes directory and want to store your web resources outside of the web application, you can use the **copyResources** and **webResourceDirectory** fields on the settings class to control the location of the web resources and if they are copied to the web application during the build. Here is an example of setting these:

~~~~ groovy
webapp.settings.copyResources = true
webapp.settings.webResourceDirectory = Paths.get("src/main/web")
~~~~ 

### Project JARs

In most cases, you need to copy the JAR file for you project into the WEB-INF/lib directory. In order to do this, the plugin needs to know where the JAR is located. The **jarOutputDirectory** specifies where the project JAR files are located. Here is an example of setting this:

~~~~ groovy
webapp.settings.jarOutputDirectory = Paths.get("output/jars")
~~~~ 

### Web Directory

Some project use a different web application directory other than **web**. You can change the location of the web application in your project by setting the **webDirectory** field on the settings object. Here is an example of setting this:

~~~~ groovy
webapp.settings.webDirectory = Paths.get("webapp")
~~~~ 

## Dependencies

This plugin will copy the project dependencies into the WEB-INF/lib directory. You can control the dependencies that are copied by setting the **dependencies** field on the settings object. Here is an example of setting this:

~~~~ groovy
webapp.settings.dependencies = [
      [group: "compile", transitive: true, fetchSource: false, transitiveGroups: ["compile", "runtime"]],
      [group: "runtime", transitive: true, fetchSource: false, transitiveGroups: ["compile", "runtime"]]
  ]
~~~~ 

This is the default setting for this property. It specifies that only the **compile** and **runtime** dependency groups should be copied along with all of their transitive dependencies in the same groups. If you want to change the dependency definitions, here are the attributes you can use:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| group | The dependency group to include | String | true |
| transitive | Determines if transitive dependencies are included or not | boolean | true |
| fetchSource | Determines if the source for the dependencies or downloaded or not | boolean | true |
| transitiveGroups | The transitive dependency groups to fetch. This is only used if transitive is set to true | List\<String> | false |


## Building the Web Application

To build the web application in your project, call the **build** method like this:

~~~~ groovy
webapp.build()
~~~~ 

## Cleaning the Web Application

To clean out the dependency JAR files and configuration files from the web application in you project, call the **clean** method like this:

~~~~ groovy
webapp.clean()
~~~~ 

## WAR

To build a WAR from your web application directory, call the **war** method like this:

~~~~ groovy
webapp.war()
~~~~ 