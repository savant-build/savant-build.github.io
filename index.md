---
layout: homepage
title: Savant Build System
description: Savant is a modern build tool that you don't have to battle with. It just works!
---

## What is Savant?

Savant is a modern build tool that uses a Groovy DSL for the build files. Savant is fully SemVer compliant and
handles the most complex dependency graphs easily. Savant uses a plugin approach to quickly add complex build
logic to a project.

The main difference between Savant and other build systems is that Savant does not allow plugins to add targets
to the build. This decision makes Savant declarative and simplifies the entire system by removing the need to
manage inter-plugin dependencies (i.e. the JUnit plugin depends on the Java plugin).

If you are interested in learning more about this design decision, check out the [Plugin Doc Page](/docs/plugins/)
