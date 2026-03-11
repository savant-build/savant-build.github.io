---
layout: docs
title: Getting Started
description: Getting Started with Savant is simple. Just download, install and go!
---

Getting started with Savant is simple. You can run the simple install command for *nix systems or WSL2 systems:

```bash

```

Follow these steps to get going:

## Step 1

[Download the latest version of Savant](https://github.com/savant-build/savant-core/releases)

## Step 2

Unpack the TAR GZ or ZIP file to a good location:

~~~~ bash
$ mkdir -p ~/dev/savant
$ cd ~/dev/savant
$ tar -xzvf savant-2.1.0.tar.gz
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
