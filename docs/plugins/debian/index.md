---
layout: docs
title: Debian Plugin
description: The Debian plugin allows you to build DEB packages for your project.
---

The Savant Debian Package Management Plugin provides the ability to build Debian package files (.deb). The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](/docs/plugins/debian/docs/) for more information.

**LATEST VERSION: 1.0.0**

## Building a Debian Package

The **build** method on the plugin allows you to build Debian package files. There are a number of parameters you pass to this method and also a number of closure methods that you can call to control how the Debian package is built. Here are the parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| to | The output directory for the .deb file | String | true |
| package | The name of the package | String | true |
| architecture | The architecture for the package. Default to **all** | String | false |
| conflicts | The package(s) this package conflicts with | String | false |
| depends | The list of dependent packages | String | false |
| enhances | The package(s) this package enhances | String | false |
| homepage | The homepage for the package | String | false |
| postInst | The location of the postInst script for the package | String or Path | false |
| postRm | The location of the postRm script for the package | String or Path | false |
| preDepends | The list of pre-dependencies for the package | String | false |
| preInst | The location of the preInst script for the package | String or Path | false |
| preRm | The location of the preRm script for the package | String or Path | false |
| priority | The priority of the package | String | false |
| provides | The features this package provides | String | false |
| recommends | The list of packages this package recommends | String | false |
| replaces | The package(s) this package replaces | String | false |
| section | The section of the package | String | false |
| suggests | The package(s) this package suggests | String | false |

For more information on these parameters, consult the Debian package documentation here: https://www.debian.org/doc/manuals/debian-faq/ch-pkg_basics.en.html

### Configuration Files

The **configuration** method defines a FileSet that specifies the configuration files for the package. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| dir | The directory on the local file system that is the base of the FileSet. The files in the FileSet are loaded from this directory. | String or Path | true |
| prefix | The prefix for the files in the FileSet when they are added to the package. | String | false |
| mode | The Unix file mode for the files in the FileSet. This must be a Unix hex mask like **0x744**. This defaults to the mode of the files on the local file system. | Hex | false |
| userName | The user name to use for the files in the FileSet. Defaults to the user name of the files on the local file system. | String | false |
| groupName | The group name to use for the files in the FileSet. Defaults to the group of the files on the local file system. | String | false |
| includePatterns | A list of regular expressions that reduce the files included in the FileSet. Only files that match the regular expression are included.  | List\<Pattern> or List\<String> | false |
| excludePatterns | A list of regular expressions that reduce the files included in the FileSet. Files that match the regular expression are excluded. | List\<Pattern> or List\<String> | false |

Here is an example of using this method:

~~~~ groovy
confFileSet(dir: "src/scripts", prefix: "etc/init.d", mode: 0x744, userName: "root", groupName: "root", includePatterns: [~/.+\.sh/], excludePatterns: [~/do-not-ship\.sh/])
~~~~ 

### Description

The **description** method sets the description of the package. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| synopsis | The synopsis of the package | String | true |
| extended | The extended description of the package | String | true |

Here is an example of using this method:

~~~~ groovy
description(synopsis: "Short description", extended: "Long description of the package")
~~~~ 

### Directories

The **directory** method includes an empty directory in the Debian package. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| name | The name of the directory as it will exist in the package. | String | true |
| mode | The Unix file mode for the directory in the package. This must be a Unix hex mask like **0x744**. | Hex | false |
| userName | The user name for the directory in the package. | String | false |
| groupName | The group name to the directory in the package. | String | false |

Here is an example of using this method:

~~~~ groovy
directory(name: "usr/local/logs", mode: 0x744, userName: "root", groupName: "root")
~~~~ 

### Maintainer

The **maintainer** method defines the maintainer of the package. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| name | The name of the company or person that maintains the package. | String | false |
| email | The email of the company or person that maintains the package. | String | false |

Here is an example of using this method:

~~~~ groovy
maintainer(name: "Brian Pontarelli", email: "brian@inversoft.com")
~~~~ 

### Main Files

The **tarFileSet** method defines a FileSet that contains the main files of the Debian Package. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| dir | The directory on the local file system that is the base of the FileSet. The files in the FileSet are loaded from this directory. | String or Path | true |
| prefix | The prefix for the files in the FileSet when they are added to the package. | String | false |
| mode | The Unix file mode for the files in the FileSet. This must be a Unix hex mask like **0x744**. This defaults to the mode of the files on the local file system. | Hex | false |
| userName | The user name to use for the files in the FileSet. Defaults to the user name of the files on the local file system. | String | false |
| groupName | The group name to use for the files in the FileSet. Defaults to the group of the files on the local file system. | String | false |
| includePatterns | A list of regular expressions that reduce the files included in the FileSet. Only files that match the regular expression are included. | List\<Pattern> or List\<String> | false |
| excludePatterns | A list of regular expressions that reduce the files included in the FileSet. Files that match the regular expression are excluded. | List\<Pattern> or List\<String> | false |

Here is an example of using this method:

~~~~ groovy
tarFileSet(dir: "build/classes/main", prefix: "usr/local/my-cool-package", mode: 0x744, userName: "root", groupName: "root", includePatterns: [~/.+\.class/], excludePatterns: [~/.+do-not-ship\.class/])
~~~~ 

### Version

The **version** method defines the version of the package. It takes these parameters:

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| upstream | The upstream version of the package. | String | true |
| debian | The Debian version of the package. | String | true |

Here is an example of using this method:

~~~~ groovy
version(upstream: "3.0.0", debian: "1")
~~~~ 


## Example

Here is a complete example of using this plugin to build a Debian package:

~~~~ groovy
plugin.build(to: "build/packages", package: "my-cool-package", architecture: "x86",
    homepage: "http://www.inversoft.com", priority: "required", section: "web",
    preInst: "src/scripts/preinst", preRm: "src/scripts/prerm",
    postInst: "src/scripts/postinst", postRm: "src/scripts/postrm") {
  version(upstream: "3.0.0-M4", debian: "1")
  description(synopsis: "My Package rocks", extended: "This package rocks pretty hard. You really should use it.")
  maintainer(name: "Inversoft", email: "brian@inversoft.com")
  tarFileSet(dir: "build/distribution/", prefix: "usr/local/my-package")
  confFileSet(dir: "src/conf", prefix: "etc/init.d")
  directory(name: "usr/local/my-package/logs", mode: 0x755)
}
~~~~ 