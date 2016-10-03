---
layout: docs
title: File Plugin
description: The File plugin provides methods that allow you to create files, directories, ZIPs, TARs, etc.
---

The file plugin provides a number of methods that help you deal with files and archives. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](docs/) for more information.

**LATEST VERSION: 1.0.0**
## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
file = loadPlugin(id: "org.savantbuild.plugin:file:1.0.0")
~~~~ 


## FileSets

Most of the methods on the file plugin use FileSets to identify files. The fileSet and optionalFileSet methods allow you to specify files that are either required or optional. If a required FileSet references a **dir** that doesn't exist, an exception will be thrown.

You can also reduce a FileSet by supplying it with a list of patterns to include or exclude. These patterns are Regular Expressions (NOT Ant style expressions). These are specified via the **includePatterns** and **excludePatterns** parameters.

Here are the attributes you can supply to FileSets:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| dir | The directory on the local file system that is the base of the FileSet. The files in the FileSet are loaded from this directory. | String or Path | true |
| includePatterns | A list of regular expressions that reduce the files included in the FileSet. Only files that match the regular expression are included. | List\<String> or List\<Pattern> | false |
| excludePatterns | A list of regular expressions that reduce the files included in the FileSet. Files that match the regular expression are excluded. | List\<String> or List\<Pattern> | false |

## ArchiveFileSet

The **tar** and **zip** methods allow you to supply specialized FileSets in order to provide more information about how files and directories are stored inside TAR and ZIP files. Here are the attributes you can supply to the ArchiveFileSet:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| dir | The directory on the local file system that is the base of the FileSet. The files in the FileSet are loaded from this directory. | String or Path | true |
| prefix | The prefix for the files in the FileSet when they are added to the package. | String | false |
| mode | The Unix file mode for the files in the FileSet. This must be a Unix hex mask like **0x744**. This defaults to the mode of the files on the local file system. | Hex | false |
| userName | The user name to use for the files in the FileSet. Defaults to the user name of the files on the local file system. | String | false |
| groupName | The group name to use for the files in the FileSet. Defaults to the group of the files on the local file system. | String | false |
| includePatterns | A list of regular expressions that reduce the files included in the FileSet. Only files that match the regular expression are included. | List\<Pattern> or List\<String> | false |
| excludePatterns | A list of regular expressions that reduce the files included in the FileSet. Files that match the regular expression are excluded. | List\<Pattern> or List\<String> | false |

## Filter Definitions

Some methods on this plugin also take Filter definitions. A filter consists of a token and a value. The token is replaced with the value for operations like rename or filtering while copying.

Here are the attribute you can supply to Filter definitions:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| token | Defines the token to filter. | String | true |
| value | Defines the value to replace the token with. | String | true |

## Appending to a File

The **append** method allows you to append the contents of files to another file. It takes 1 or more FileSets inside its closure. It also takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| to | The name of the file to append to. This file is created it if doesn't exist. | String or Path | true |

Here is an example of calling this method:

~~~~ groovy
file.append(to: "some-file.txt") {
  fileSet(dir: "src/main/text-files", includePatterns: [~/.+.txt/])
}
~~~~ 

## Copying Files

The **copy** method on the file plugin allows you to copy files between directories. This method takes 1 or more FileSets inside its closure. It also takes these parameters:

* to - (required) The location to copy the files to. Must be an existing directory or not exist. If the location doesn't exist, it is created.

Here is an example of using this method:

~~~~ groovy
file.copy(to: "build/distributions/bin") {
  fleSet(dir: "src/main/scripts")
}
~~~~ 

This copies all of the files (recursively) from the **src/main/scripts** directory to the **build/distributions/bin** directory.

Here's an example that only copies a specific set of files.

~~~~ groovy
file.copy(to: "build/distributions/bin") {
  fleSet(dir: "src/main/scripts", includePatterns: [/.*\.sh/])
}
~~~~ 

This copies all of the files (recursively) from the **src/main/scripts** directory with an extension of **.sh** to the **build/distributions/bin** directory.

You can also filter text inside files while copying. To do this, you supply 1 or more filter definitions inside the closure. Here is an example of using filters:

~~~~ groovy
file.copy(to: "build/distributions/bin") {
  fleSet(dir: "src/main/scripts", includePatterns: [/.*\.sh/])
  filter(token: "%VERSION%", value: "${project.version}")
}
~~~~ 

## Copy a Single File

The **copyFile** allows you to copy a single file to another location. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| file | The name of the file to copy | String/Path | true |
| to | The name of the target file (NOT a directory) to copy to. | String/Path | true |

Here is an example of calling this method:

~~~~ groovy
file.copyFile(file: "some-file.txt", to: "build/some-file-renamed.txt")
~~~~ 

## Deleting Files

The **delete** method allows you to delete 0 or more files. It takes 1 or more FileSets inside its closure. Here is an example of calling this method:

~~~~ groovy
file.delete {
  fileSet(dir: "build/example", includePatterns: [~/foobar.+/])
}
~~~~ 

## Jarring Files

The **jar** method on the file plugin allows you to create Jar files. It takes 1 or more FileSets inside its closure. It also takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| file | The name of the target JAR file to create. If this file already exists it is replaced. | String or Path | true |

Here is an example of using this method:

~~~~ groovy
file.jar(file: "build/jars/foobar.jar") {
  fileSet(dir: "src/main/java")
  optionalFileSet(dir: "build/output")
}
~~~~ 

This add all of the files in the **src/main/java** directory to the jar file **build/jars/foobar.jar**. It also optionally adds all of the files from the **build/output** directory to the jar file if that directory exists.

## Making a Directory

The **mkdir** allows you to create a directory. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| dir | The name of the directory to create. | String or Path | true |

Here is an example of calling this method:

~~~~ groovy
file.mkdir(dir: "build/test")
~~~~ 

## Pruning

The **prune** method on the file plugin allows you to delete a directory and everything inside it. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| dir | The name of the directory to delete. | String or Path | true |

Here is an example of using this method:

~~~~ groovy
file.prune(dir: "build/classes/main")
~~~~ 

**NOTE**: This method correctly handles symlinks by removing the link. This DOES NOT traverse symlinks.

## Renaming Files

The **rename** method allows you to rename multiple files at the same time. This takes 1 or more FileSets inside its closure. It renames based on 1 or more Filter definitions that are also provided inside the closure. Here is an example of calling this method:

~~~~ groovy
file.rename {
  fileSet(dir: "build/classes/main")
  filter(token: "foobar", value: "baz")
}
~~~~ 

## Creating Symlinks

The **symlink** method allows you to create symlinks. You almost never need to unlink a symlink because Savant almost never traverses symlinks. This method takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| target | The target for the symlink. | String or Path | true |
| link | The link name | String or Path | true |

Here is an example of calling this method:

~~~~ groovy
file.symlink(target: "build/classes/main", link: "/tmp/foo/bar")
~~~~ 

## Tarring Files

The **tar** method on the file plugin allows you to create Tarballs. This method takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| file | The name of the TAR file to create.  | String or Path | true |
| compress | Determines if the TAR file is GZip compressed as well. If you don't specify this parameter, the compress is inferred from the name of the tar file. If it ends in .gz compress will be used.  | boolean | false |

Here is an example of using this method:

~~~~ groovy
file.tar(file: "build/tars/foobar.tar.gz", compress: true) {
  fileSet(dir: "src/main/java")
}
~~~~ 

This adds all of the files in the **src/main/java** directory to the tarball **build/tars/foobar.tar.gz**. This also compresses the tarball.

You can also supply ArchiveFileSets to the **tar** method. These are called tarFileSets. Here is an example of using tarFileSets:

~~~~ groovy
file.tar(file: "build/tars/foobar.tar.gz", compress: true) {
  tarFileSet(dir: "src/main/java", prefix: "/usr/local/foobar", mode: 0x744, userName: "root", groupName: "root")
}
~~~~ 

## Unjar Files

The **unjar** method allows you to extract a JAR file. This method takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| file | The JAR file to extract.  | String or Path | true |
| to | The directory to extract the JAR file to.  | String or Path | true |

Here is an example of calling this method;

~~~~ groovy
file.unjar(file: "build/jars/foobar.jar", to: "build/output")
~~~~ 

## Untar Files

The **untar** method allows you to extract a TAR file. This method takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| file | The TAR file to extract. | String or Path | true |
| to | The directory to extract the TAR file to. | String or Path | true |

Here is an example of calling this method;

~~~~ groovy
file.untar(file: "build/tars/foobar.tar.gz", to: "build/output")
~~~~ 

## Unzip Files

The **unzip** method allows you to extract a ZIP file. This method takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| file | The ZIP file to extract. | String or Path | true |
| to | The directory to extract the ZIP file to. | String or Path | true |

Here is an example of calling this method;

~~~~ groovy
file.unzip(file: "build/zips/foobar.zip", to: "build/output")
~~~~ 

## Zipping Files

The **zip** method on the file plugin allows you to create ZIP files. The files in the ZIP retain the mode of the original file, but not the owner and group. This method takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| file | The name of the ZIP file to create. | String or Path | true |

Here is an example of using this method:

~~~~ groovy
file.tar(file: "build/zips/foobar.zip") {
  fileSet(dir: "src/main/java")
}
~~~~ 

This adds all of the files in the **src/main/java** directory to the ZIP  **build/tars/foobar.zip**.

You can also supply ArchiveFileSets to the **zip** method. These are called zipFileSets. Here is an example of using zipFileSets:

~~~~ groovy
file.zip(file: "build/zips/foobar.zip") {
  zipFileSet(dir: "src/main/java", prefix: "/usr/local/foobar", mode: 0x744)
}
~~~~ 

The **userName** and **groupName** attributes for ArchiveFileSets are allowed here but the ZIP method does not support them yet. The JDK implementation for ZIP files does support them, but lacks support for Unix mode. Likewise, the Ant ZIP implementation supports Unix file mode, but lacks support for ownership. We opted to use the Ant implementation until we can afford the time to write our own that supports everything in modern ZIP files.