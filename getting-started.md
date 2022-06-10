---
layout: default
title: Getting Started
description: Getting Started with Savant is simple. Just download, install and go!
---

Getting started with Savant is simple. Follow these steps to get going:

## Step 1

[Download the latest version of Savant](https://repository.savantbuild.org/org/savantbuild/savant-core/1.0.0/savant-1.0.0.tar.gz)

## Step 2

Unpack the TAR GZ file to a good location:

~~~~ bash
$ mkdir -p ~/dev/savant
$ cd ~/dev/savant
$ tar -xzvf savant-1.0.0.tar.gz
~~~~

## Step 3

Add the **bin** directory to your PATH:
 
~~~~ bash
$ export PATH=$PATH:~/dev/savant/savant-1.0.0/bin
~~~~

## Step 4

Test it out:

~~~~ bash
$ sb --version
~~~~
