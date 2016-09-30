---
layout: docs
title: Project Information
description: Savant project information is defined the using the "project" definition in the build file.
---

Savant build files must be placed at the root of the project and they should be named **build.savant**. Build files will define the project information, dependencies, workflow, and targets.

Let's start out by looking at a simple Savant build file that defines a project. Edit the file build.savant in your IDE or favorite text editor. Put this in your build file.

~~~~ groovy
project(group: "org.example", name: "my-project", version: "1.0", licenses: ["ApacheV2_0"]) {
  // More info here
}
~~~~ 

You define your project details using the project method. This method takes a block, that allows you to define additional details about your project like dependencies. The key here is that the project requires these attributes:

* group - The group identifier for your organization (usually a reverse domain name)
* name - The name of the project
* version - A semantic version http://semver.org
* licenses - The license(s) of your project

One of the most important details is that Savant requires that everything uses Semantic Versions. This is vitally important when Savant calculates dependencies of your project. You should read the Semantic Version specification by visiting http://semver.org.

You also need to specify one or more licenses for your project. All projects must specify at least one license. This helps Savant determine if your project is in compliance with organizational requirements about software licensing.

Savant currently supports these licenses:

* ApacheV1_0 - Apache version 1.0
* ApacheV1_1 - Apache version 1.1
* ApacheV2_0 - Apache version 2.0
* BSD - BSD
* BSD_2_Clause - BSD 2 clause
* BSD_3_Clause - BSD 3 clause
* BSD_4_Clause - BSD 4 clause
* CDDLV1_0 - Common Development and Distribution License version 1.0
* Commercial - Commercial license
* EclipseV1_0 - Eclipse version 1.0
* GPLV1_0 - GPL version 1.0
* GPLV2_0 - GPL version 2.0
* GPLV2_0_CE - GPL version 2.0 with the classpath exception
* GPLV3_0 - GPL verison 3.0
* LGPLV2_1 - LGPL version 2.1
* LGPLV3_0 - LGPL version 3.0
* MIT - MIT
* Other - Other license
* OtherDistributableOpenSource - Other open source license that allows the code to be freely distributed
* OtherNonDistributableOpenSource - Other open source license that doesn't allow the code to be freely distributed (i.e. GPL)
* Public_Domain - Public domain (also known as license-less)

Some of these licenses require that the project supply their own license text. For example, the standard BSD license is a template and each project must change the license to include their name and assignee. Savant supports providing custom license texts using a text file at the root of the project. You can also override any of these licenses with custom text using this file. The file must follow this naming convention:

~~~~ 
license-<type>.txt
~~~~ 

So, if your project is using a Commercial license, you need to create a file named: **license-Commercial.txt** at the root of your project.

Here are the licenses that require a license text file:

* BSD - BSD
* BSD_2_Clause - BSD 2 clause
* BSD_3_Clause - BSD 3 clause
* BSD_4_Clause - BSD 4 clause
* Commercial - Commercial license
* MIT - MIT
* Other - Other license
* OtherDistributableOpenSource - Other open source license that allows the code to be freely distributed
* OtherNonDistributableOpenSource - Other open source license that doesn't allow the code to be freely distributed (i.e. GPL)

[Next, we'll add some dependencies to our build file](dependencies)