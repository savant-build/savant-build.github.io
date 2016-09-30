---
layout: docs
title: Releasing
description: Releasing project's is simple with the Git Release plugin.
---

Releasing a project involves a number of steps, depending on the type of project and how the project is version controlled. For this example, we will assume that the project is a Java project and managed in Git. For this, we will use the [Release Git Plugin](https://github.com/inversoft/savant-release-git-plugin/wiki/Home).

The steps required to release a Java/Git project are:

1. Check for dependencies on integration builds of other projects, libraries, etc.
2. Check for plugins that are integration builds
3. Ensure the project is a Git project
4. Perform a **git pull**
5. Ensure the project has no local changes
6. Ensure the project changes have been pushed to the remote
7. Ensure there isn't a tag in the Git repository for the version being released
8. Creates a tag whose name is the version being released (i.e. 1.0.8)
9. Publishes the project's artifacts (publications) using the publishWorkflow of the project

Luckily, the [Release Git Plugin](/plugins/release-git/) does most of the work. All you need to do is add a few things to your build file and you will be able to release projects quickly and easily.

## Publish Workflow

First, add the publish workflow. This is the process that Savant uses to publish the project's artifacts. Here's a sample publish workflow:

~~~~ groovy
project(...) {
  publishWorkflow {
    subversion(repository: "http://svn.mycompany.com/savant-repository")
  }
}
~~~~ 

This workflow instructs Savant to publish the project's artifacts to the Subversion repository located at **http://svn.mycompany.com/savant-repository**.

## Release Git Plugin

Next, include the [Release Git Plugin](/plugins/release-git/) in the build file:

~~~~ groovy
release = loadPlugin(id: "org.savantbuild.plugin:release-git:0.1.0")
~~~~ 

## Target

Finally, add a target to the build file that will run the release:

~~~~ groovy
target(name: "release", description: "Releases a full version of the project", dependsOn: ["test"]) {
  release.release()
}
~~~~ 

That's it! Your project should now be setup to be released using the process described above.