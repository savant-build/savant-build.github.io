---
layout: docs
title: Release Git Plugin
description: The Release Git plugin allows release a full version of your project that stored in a Git repository.
---

The Release Git plugin allows you to perform a full release of a project stored in a Git repository. This plugin has no settings. Everything that is required to release a Git project comes from the .git directory or the project build file. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](docs/) for more information.

**LATEST VERSION: 1.0.0**


## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
release = loadPlugin(id: "org.savantbuild.plugin:release-git:1.0.0")
~~~~ 


## The Release Process

This plugin takes a number of steps to perform a full release of a project. Here are the steps:

1. Check for dependencies on integration builds of other projects, libraries, etc. If there are any integration dependencies, the release is halted.
2. Check for plugins that are integration builds. If there are any integration dependencies, the release is halted.
3. Ensure the project is a Git project.
4. Perform a **git pull**.
5. Ensure the project has no local changes.
6. Ensure the project changes have been pushed to the remote.
7. Ensure there isn't a tag in the Git repository for the version being released.
8. Execute all of the project's tests.
9. Creates a tag whose name is the version being released (i.e. 1.0.8).
10. Publishes the project's artifacts (publications) using the publishWorkflow of the project.

After the release is completed, you should have a Git tag and the project's artifacts should be publish to a Savant repository.


## Executing Tests

This plugin provides a single method to perform the release. Here is how you call this method:

~~~~ groovy
release.release()
~~~~ 
