---
layout: docs
title: Output
description: You can produce output from your build using the "output" variable inside the build file.
---

No matter where you are in Savant, you have access to the Output object. This object provides a couple of methods for outputting information from your build script or plugin. The basic methods are:

* debug - Prints out a debug message if the --debug command-line switch is provided
* info - Prints out an informational message
* warning - Prints out a warning message
* error - Prints out an error message

All of these methods take the message as a String and an optional list of values that are used to fill out the message using **printf** syntax. For example:

~~~~ groovy
output.info("some info %s", "message");

// Prints "some info message"
~~~~

There is also a specialized debug() method that takes a Throwable.

[Next, we'll talk quickly about failing a build](failing-the-build)