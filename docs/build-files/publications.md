---
layout: docs
title: Publications
description: Publications are the artifacts produced by your project that can be used by other projects. 
---

Publications are the artifacts produced by your project that can be used by other projects. These are defined in the build file inside the `project` definition.

Any project can have zero or more publications. This means that a single project might produce multiple artifacts that can be used by other projects.

Publications are split into two groups **main** and **test**. Main publications are generally used at runtime and test publications are generally used at test time. Each publication is specified by a **name**, **type** and **file**. Publications can also optionally have a source file specified (i.e. a source JAR). Here's how you define publications:

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  workflow {
    standard()
  }
  
  publications {
    main {
      publication(name: "my-project", type: "tar.gz", file: "build/my-project.tar.gz")
      publication(name: "my-project", type: "jar", file: "build/jars/my-project-${project.version}.jar", source: "build/jars/my-project-${project.version}-src.jar")
    }
    test {
      publication(name: "my-project-test", type: "tar.gz", file: "build/my-project-test.tar.gz")
      publication(name: "my-project-test", type: "jar", file: "build/jars/my-project-test-${project.version}.jar", source: "build/jars/my-project-test-${project.version}-src.jar")
    }
  }
}
~~~~

To reduce the amount of repeated code, Savant provides a shortcut for Java projects that adds a test and main publication for the projects JAR files. Here is the shorthand for that:

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  workflow {
    standard()
  }
  
  publications {
    standard()
  }
}
~~~~

You can still add additional publications to the **standard** definition above like this:

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  workflow {
    standard()
  }
  
  publications {
    standard()
    main {
      publication(name: "my-project", type: "tar.gz", file: "build/my-project.tar.gz")
    }
    test {
      publication(name: "my-project-test", type: "tar.gz", file: "build/my-project-test.tar.gz")
    }
  }
}
~~~~

## Publish Workflow

When projects are released, the **publishWorkflow** is used to transfer the project's publications to a location that other project's can find them. This is different than an **integration** build for a project. Integration builds use the main **workflow** of the project and not the **publishWorkflow**.
  
Here's how you define a **publishWorkflow**:

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  workflow {
    standard()
  }
  
  publishWorkflow {
    subversion(repository: "http://svn.my-company.com/savant-repository")
  }
  
  publications {
    standard()
  }
}
~~~~

This **publishWorkflow** will add the project's publications to the companies private Savant repository by adding them to the SubVersion repository at the given URL. 

You can also use any of the following publish workflow types:

* scp - Publishes the project's artifacts to a server via SCP
  * server - (Required) The server to fetch from (i.e. foo.example.com)
  * location - (Required) The location on the server server to fetch from (i.e. /home/foobar/artifacts)
  * username - (Required) The username to use when connecting to the server via SCP.
  * password - (Optional) The password to use when connecting to the server via SCP. If this is not specified, then Savant will attempt to use public/private keys for authentication.
* svn - Publishes the project's artifacts to a Subversion repository
  * repository - (Required) The Subversion repository URL to fetch from (i.e. http://foo.example.com/svn)
  * username - (Optional) The username to use when connecting to the Subversion repository.
  * password - (Optional) The password to use when connecting to the Subversion repository.

[Next, we'll add some targets to our build file](targets)