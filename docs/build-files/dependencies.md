---
layout: docs
title: Dependencies
description: You specify your project's dependencies using the "dependencies" definition in the build file. 
---

Now, let's add some dependencies to the project

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  dependencies {
    group(name: "compile") {
      dependency(id: "org.apache.commons:commons-collections:3.1.0")
    }
  }
}
~~~~ 

This defines a single compile-time dependency on the Commons Collections library version 3.1.0. This isn't enough information for Savant to download this dependency. You need to tell Savant where to download from. This is done using a workflow definition:

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  workflow {
    fetch {
      cache()
      url(url: "http://savant.inversoft.org")
    }
    publish {
      cache()
    }
  }

  dependencies {
    group(name: "compile") {
      dependency(id: "org.apache.commons:commons-collections:3.1.0")
    }
  }
}
~~~~ 

This tells Savant to first check the local cache for dependencies. If they aren't found there, download them from http://savant.inversoft.org and cache them locally (that's what the publish section is for).

You can simplify this build file like this:

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  workflow {
    standard()
  }

  dependencies {
    group(name: "compile") {
      dependency(id: "org.apache.commons:commons-collections:3.1.0")
    }
  }
}
~~~~ 

The local cache for Savant is stored at **~/.savant/cache**

We now have given Savant enough information to download the dependency and cache it locally.


## Dependency Groups

Dependency groups are completely free-form. You can name them whatever you want, but Savant and some of its plugins might use specific dependency groups by default. Here are the default groups:

* provided - Used during compilation but provided by the container or environment at runtime
* compile - Used to compile the project
* compile-optional - Used to compile the project but are not included at runtime because they are optional
* runtime - Used to execute the project
* test-compile - Used to compile the project's tests
* test-runtime - Used to run the project's tests

### Exporting

You can select which dependency groups are exported when a project is released. Non-exported dependency groups will not be know to other projects and are effectively hidden. This is a nice way to keep dependency graphs clean. You can define a dependency group as being non-exported like this:

~~~~ groovy
dependencies {
  group(name: "test-compile", export: false) {
    dependency(id: "org.testng:testng:4.8.7")
  }
}
~~~~ 


## Artifact IDs

Savant uses a shorthand notation for declaring a project's dependencies (or plugins or any other artifact). The form of this notation is:

~~~~ 
<group>:<project>:<version>
~~~~ 

This format implies that the artifact is a JAR file that ends with **.jar**.

Since Savant does not restrict projects from publishing multiple artifacts or the type of the artifact, there are a couple of extended formats as well:

~~~~ 
<group>:<project>:<artifact>:<version>
<group>:<project>:<artifact>:<version>:<type>
~~~~ 

An example of two dependency declarations from the same project might be something like:

**com.mycompany:someproject:first-project-artifact:4.1.2:bin**
**com.mycompany:someproject:second-project-artifact:4.1.2:jar**

These definitions might map to these URLs in a Savant repository:

~~~~ 
http://mySavantRepository.mycompany.com/com/mycompany/someproject/4.1.2/first-project-artifact-4.1.2.bin
http://mySavantRepository.mycompany.com/com/mycompany/someproject/4.1.2/second-project-artifact-4.1.2.jar
~~~~ 


## Workflow Processes

There are 4 main workflow processes you can use from Savant. Each process has different parameters you can specify to control its behavior:

* cache - Fetches and stores dependencies in the local cache
  * directory - (Optional) If this is blank, Savant will use the default location of **~/.savant/cache**
* url - Fetches artifacts from an HTTP/HTTPS URL
  * url - (Required) The URL to fetch from
  * username - (Optional) The username to use when downloading from the URL. This is used with HTTP Basic Authentication
  * password - (Optional) The password to use when downloading from the URL. This is used with HTTP Basic Authentication
* svn - Fetches and publishes dependencies (or artifacts) from a Subversion repository
  * repository - (Required) The Subversion repository URL to fetch from (i.e. http://foo.example.com/svn)
  * username - (Optional) The username to use when connecting to the Subversion repository.
  * password - (Optional) The password to use when connecting to the Subversion repository.


## Version Compatibility

Savant uses Semantic Versioning to manage version compatibility for individual artifacts. Here is an example:

* Your project depends on library Foo version **1.0**
* Your project also depends on library Bar version **2.0**
* Library Bar depends on library Foo version **1.3**

In this case, Savant needs to determine which version of Foo to include in the classpath at runtime. It can pick either **1.0** or **1.3**. SemVer states that **1.0** is runtime compatible with **1.3**, therefore, Savant will choose to include version **1.3** in the classpath.

### Incompatible Versions

Let's take the case above but change one thing. Instead of depending on version **1.3**, library Bar depends on version **3.2**. In this case, SemVer states that these versions are not runtime compatible. In this case, Savant will fail the build and spit out an error message like this:

~~~~ 
The artifact [org.example:Foo] has incompatible versions in your dependencies. The versions are [1.0, 3.2]
~~~~ 

In this case, Savant is attempting to prevent your application from failing at runtime due to an incompatible library.

### Skip Compatibility Check

There are plenty of libraries in the world today that don't use SemVer or don't version correctly. Likewise, there are plenty of libraries that correctly use SemVer, but make incompatible changes freely and regularly. In some cases, you don't really have a choice but to use the latest version of a dependency, even though it might be incompatible. And in some cases you know that the versions are compatible, just have bad versions. Savant solves this problem by allowing your project to define a dependency and skip the compatibility check on that dependency. Here is how you accomplish this:

~~~~ groovy
dependencies {
  group(name: "runtime") {
    dependency(id: "org.example:Foo:3.2", skipCompatibilityCheck: true)
  }
}
~~~~ 

By setting the **skipCompatibilityCheck** flag, Savant will not fail the build when the versions of an artifact are incompatible.

This flag is not transitive. This means that projects that depend on your project will need to specify the flag on the dependency as well. This forces each project to make a informed decision about which version of the library they want to use.

[Next, we'll add some publications in our build file](publications)