---
layout: docs
title: Dependency Plugin
description: The Dependency plugin allows you to manage, copy, and download the project's dependencies.
---

The Savant Dependency Management Plugin provides the ability to work with project dependencies. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](/docs/plugins/dependency/docs/) for more information.

**LATEST VERSION: 1.0.0**


## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
dependency = loadPlugin(id: "org.savantbuild.plugin:dependency:1.0.0")
~~~~ 


## Dependencies

All of the features of the plugin use a shorthand dependency reference notation. The notation for referencing dependencies looks like this:

~~~~ groovy
dependencies(group: "compile", transitive: true, fetchSource: true, transitiveGroups: ["compile", "runtime"])
~~~~ 

This **dependencies** block states that all of the project's **compile** dependencies should be included AND all of the transitive dependencies in the groups **compile** and **runtime** should also be included. Additionally, the source JAR for each of the dependencies should also be downloaded.

Here are the attributes for the dependencies definitions:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| group | The dependency group to include | String | true |
| transitive | Determines if transitive dependencies are included or not | boolean | true |
| fetchSource | Determines if the source for the dependencies or downloaded or not | boolean | true |
| transitiveGroups | The transitive dependency groups to fetch. This is only used if transitive is set to true | List\<String> | false |

## Copying Dependencies

The **copy** method on the plugin allows you to copy dependencies to a directory. You must specify a **to** directory and one or more **dependencies**.

Here is an example:

~~~~ groovy
dependency.copy(to: "build/distributions/lib") {
  dependencies(group: "compile", transitive: true, fetchSource: true, transitiveGroups: ["compile", "runtime"])
}
~~~~ 

This will copy all of the **compile** dependencies (and transitively their **compile** and **runtime** dependencies) to the **build/distributions/lib** directory.

## Classpaths

The **classpath** method on the plugin allows you to build a classpath from the project's dependencies. Here is an example of using this method:

~~~~ groovy
Classpath classpath = dependency.classpath {
 dependencies(group: "compile", transitive: true, fetchSource: true, transitiveGroups: ["compile", "runtime"])
}
~~~~ 

Once you have the Classpath object, you can convert it to a String or iterate through the elements of the classpath.

## Resolving

The **resolve** method on the plugin allows you to resolve the project's dependencies. Here is an example of using this method:

~~~~ groovy
ResolvedArtifactGraph graph = dependency.resolve {
 dependencies(group: "compile", transitive: true, fetchSource: true, transitiveGroups: ["compile", "runtime"])
}
~~~~ 

The **ResolvedArtifactGraph** instance is a graph that also contains the location of each artifact file on disk. You can use the graph to build Classpaths or iterate over the dependencies.

## Integration Builds

The **integrate** method on the plugin performs an integration build of the project. This uses the Publications that are defined in the build.savant build script and the publish part of the project's main Workflow. Here is an example of using this method:

~~~~ groovy
dependency.integrate()
~~~~ 

After the project has published integration versions of its publications, other projects can use those versions to continue development. You can include integration dependencies for your project like this:

~~~~ groovy
project(...) {
  dependencies {
    group(name: "compile") {
      dependency(id: "com.example:my-other-project:1.1-{integration}")
    }
  }
}
~~~~ 

## Listing Un-used Dependencies

The **listUnusedDependencies** method on the plugin allows you to determine which of your project's direct dependencies might not be used anymore. This currently makes a good effort at figuring this out, but doesn't handle inheritance all that well. The best way to use this method is to call it and comment out un-used dependencies and try running all your tests.

Here is how you can use this method:

~~~~ groovy
dependency.listUnusedDependencies()
~~~~ 

This method takes these optional parameters as well:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| mainBuildDirectory | The location of the output directory where the main .class files are compiled to. Defaults to **build/classes/main** | String or Path | false |
| mainDependencyGroups | The dependency groups used during compilation of the main classes. Defaults to **["compile", "provided"]** | List\<String> | false |
| testBuildDirectory | The location of the output directory where the test .class files are compiled to. Defaults to **build/classes/test** | String or Path | false |
| testDependencyGroups | The dependency groups used during compilation of the test classes. Defaults to **["test-compile"]** | List\<String> | false |

Here's how it is called with optional parameters:

~~~~ groovy
dependency.listUnusedDependencies(mainBuildDirectory: "build/output/main", mainDependencyGroups: ["compile"],
    testBuildDirectory: "build/output/test", testDependencyGroups: ["test"])
~~~~ 

## Finding a Single Dependency

The **path** method on the plugin allows you to find the path on disk for a single dependency. Here are the parameters to this method:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| id | The dependency ID for the single dependency to find the file for | String | true |
| group | The is the dependency group that the dependency is in | String | true |

Here is how you can use this method:

~~~~ groovy
Path path = dependency.path(id: "org.apache.commons:commons-collection:3.1", group: "compile")
~~~~ 

This will return the location of the Commons Collection JAR file on disk.

## Printing the Dependency Tree

The **printFull** method on the plugin allows you to output the dependencies of your project in an ascii tree to the console. This method does not take any parameters.

Here is how you can use this method:

~~~~ groovy
dependency.printFull()
~~~~ 

## Writing out Licenses

One of the best features of the Dependency Plugin is the ability to output the licenses for all of your dependencies. This is extremely powerful for compliance purposes. The **writeLicenses** method on the plugin will output all of the license texts for all of your project's dependencies including transitive dependencies. Here are the attributes for this method:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| to | The directory to write the licenses to. | String or Path | true |

Here is how you call this method:

~~~~ groovy
dependency.writeLicenses(to: "build/licenses")
~~~~ 

This will output all of the license to the **build/licenses** directory. The output will look similar to the Savant repository structure. For example, the license text for the Commons Collection project will be output to the directory:

~~~~ 
build/licenses/org/apache/commons/commons-collections/3.1/license-ApacheV2_0.txt
~~~~ 
