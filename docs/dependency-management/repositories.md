---
layout: docs
title: Repositories
description: Learn how to setup your own Savant repository.
---

Savant's dependency management system uses repositories to download the artifacts a project depends on. These repositories are usually HTTP web servers.

In most commercial environments, project's will use 2 different repositories:

1. A public repository for all of the open source artifacts
2. A internal repository for all of the companies artifacts

Company artifacts are usually IP and therefore most companies put these artifacts into a secure HTTP server that only their employees have access to.


## Inversoft's Public Repository

Inversoft provides a free Savant repository for you to use. This repository is not like Maven Central in that it only contains the open source libraries and frameworks that Inversoft has added. If you want to help grow this repository, contact Brian Pontarelli at (brian@inversoft.com).

The URL for the Inversoft repository is: https://repository.savantbuild.org

This repository is also the default repository that Savant will use when you specify the **standard()** set in your workflow like this:

~~~~ groovy
workflow {
  standard()
}
~~~~ 

## Adding Artifacts to a Repository

Whether you are a contributor to the Inversoft repository or setup your own repository using the instructions below, you will likely need to add a lot of artifacts to it. Savant provides a command-line tool that allows you to pull artifacts from a Maven repository and add them to a Savant repository. This tool is call Savant-Maven-Bridge and you can download it here:

http://savant.inversoft.org/org/savantbuild/savant-maven-bridge/0.2.0/savant-maven-bridge-0.2.0.tar.gz

This tool is interactive and will ask you a bunch of questions about each artifact you are importing into your Savant repository. This questions attempt to fill in the gaps between Maven and Savant. Here is a list of some of the major differences between Maven and Savant that this tool fixes:

## Referencing a Private Repository

A private repository will house anything an organization uses but doesn't wish to publish publicly.

~~~~ groovy
workflow {
  standard() // for the Savant public repo
  fetch {
      url(url: "http://example.com/internal/", username: "repo-username", password: "repo-password")
  }
}
~~~~ 
### SemVer

Maven is not SemVer compliant, Savant is. If a Maven artifact has an invalid version, you will need to fix it.

> It should be noted that some Maven artifacts have incorrect SemVer versions that are compliant, but malformed. An example is that some projects put meta as pre-release information.
> For example, the PostgreSQL JDBC driver uses a Maven version like ~~~~ 9.3.1102-jdbc41~~~~ . This is actually a SemVer pre-release version. In SemVer, this version should really be ~~~~ 9.3.1102+jdbc41~~~~  because the JDBC implementation version is meta-data NOT pre-release data.

### Licenses

Maven doesn't require license information and the license information is not 100% standardized. Savant uses a strict set of licenses for artifacts and all artifacts must have 1 or more licenses. Therefore, you will need to specify the license(s) for each artifact you are importing.

Also, some licenses require the full license text because the default license text is merely a template for the project to start from. The licenses that require license text are:

* BSD
* BSD_2_Clause
* BSD_3_Clause
* BSD_4_Clause
* Commercial
* MIT
* Other
* OtherDistributableOpenSource
* OtherNonDistributableOpenSource

In these cases, you must provide the license text to the command line tool.

### Exclusions

Maven allows an artifact to exclude transitive dependencies. Technically this is a broken dependency graph. It often indicates that the transitive dependency was defined in the wrong scope. In most cases, the transitive dependency should be marked as optional or provided, but instead was put in the compile or runtime scope. Likewise, Maven projects often put test dependencies in the **compile** scope, forcing developers to exclude those dependencies.

Savant does not support exclusions. Therefore, you must selectively choose whether or not to include a transitive dependency in the dependency graph. You can also select to move a dependency into the correct scope.

### Optional Dependencies

Maven allows a dependency in any scope to be marked as optional. This is somewhat unnecessary for the **test** and **provided** scope, but very useful for the **compile** scope. Savant doesn't provide this same ability. Instead, Savant uses a dependency group name **compile-optional**. These dependencies are included at compile-time, but not at runtime. This is almost the exactly same thing as the **provided** scope, but Savant breaks them into two separate groups.

## Repository Layout

The standard repository layout uses the artifact group, project, name, version and type to store artifacts. Here is the layout for the Commons Collection artifact:

~~~~ 
org/apache/commons/commons-collections/3.2.1/commons-collections-3.2.1.jar
org/apache/commons/commons-collections/3.2.1/commons-collections-3.2.1.jar.md5
org/apache/commons/commons-collections/3.2.1/commons-collections-3.2.1.jar.amd
org/apache/commons/commons-collections/3.2.1/commons-collections-3.2.1.jar.amd.md5
org/apache/commons/commons-collections/3.2.1/commons-collections-3.2.1-src.jar
org/apache/commons/commons-collections/3.2.1/commons-collections-3.2.1-src.jar.md5
~~~~ 

Project's can publish multiple artifacts, which changes only the file name. The directory name remains the same.

Savant uses MD5 files to ensure that the artifacts are valid when they are downloaded.

## Manually Building AMD Files

Sometimes you have no option but to manually build the AMD file for an artifact. The AMD file is the **Artifact Meta Data** that tells Savant but an artifact's dependencies and licenses. If you need to manually edit or create an AMD file, here is an example AMD file (solr-core's AMD) for you to work from:

~~~~ xml
<?xml version="1.0" encoding="UTF-8"?>
<artifact-meta-data>
  <license type="ApacheV2_0"/>
  <dependencies>
    <dependency-group name="compile">
      <dependency group="org.slf4j" project="jcl-over-slf4j" name="jcl-over-slf4j" version="1.6.4" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-queries" name="lucene-queries" version="4.0.0" type="jar"/>
      <dependency group="org.apache.commons" project="commons-fileupload" name="commons-fileupload" version="1.2.1" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-grouping" name="lucene-grouping" version="4.0.0" type="jar"/>
      <dependency group="org.apache.commons" project="commons-codec" name="commons-codec" version="1.7.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-memory" name="lucene-memory" version="4.0.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-suggest" name="lucene-suggest" version="4.0.0" type="jar"/>
      <dependency group="org.slf4j" project="slf4j-jdk14" name="slf4j-jdk14" version="1.6.4" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-queryparser" name="lucene-queryparser" version="4.0.0" type="jar"/>
      <dependency group="org.slf4j" project="slf4j-api" name="slf4j-api" version="1.6.4" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-misc" name="lucene-misc" version="4.0.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-analyzers-kuromoji" name="lucene-analyzers-kuromoji" version="4.0.0" type="jar"/>
      <dependency group="org.apache.commons" project="commons-cli" name="commons-cli" version="1.2.0" type="jar"/>
      <dependency group="org.apache.solr" project="solr-solrj" name="solr-solrj" version="4.0.0" type="jar"/>
      <dependency group="org.apache.httpcomponents" project="httpclient" name="httpclient" version="4.1.3" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-spatial" name="lucene-spatial" version="4.0.0" type="jar"/>
      <dependency group="com.google.guava" project="guava" name="guava" version="0.5.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-analyzers-common" name="lucene-analyzers-common" version="4.0.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-analyzers-phonetic" name="lucene-analyzers-phonetic" version="4.0.0" type="jar"/>
      <dependency group="org.apache.commons" project="commons-io" name="commons-io" version="2.1.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-highlighter" name="lucene-highlighter" version="4.0.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-analyzers-morfologik" name="lucene-analyzers-morfologik" version="4.0.0" type="jar"/>
      <dependency group="org.apache.lucene" project="lucene-core" name="lucene-core" version="4.0.0" type="jar"/>
      <dependency group="org.apache.commons" project="commons-lang" name="commons-lang" version="2.6.0" type="jar"/>
      <dependency group="org.apache.httpcomponents" project="httpmime" name="httpmime" version="4.1.3" type="jar"/>
    </dependency-group>
    <dependency-group name="runtime">
      <dependency group="org.codehaus.woodstox" project="wstx-asl" name="wstx-asl" version="3.2.7" type="jar"/>
    </dependency-group>
    <dependency-group name="provided">
      <dependency group="javax.servlet" project="servlet-api" name="servlet-api" version="2.4.0" type="jar"/>
    </dependency-group>
  </dependencies>
</artifact-meta-data>
~~~~ 

Additionally, some licenses require license text. For these licenses, you must provide the license text inside the AMD file like this (this is the SLF4j AMD file):

~~~~ xml
<?xml version="1.0" encoding="UTF-8"?>
<artifact-meta-data>
  <license type="MIT">
<![CDATA[Copyright (c) 2004-2013 QOS.ch
 All rights reserved.

 Permission is hereby granted, free  of charge, to any person obtaining
 a  copy  of this  software  and  associated  documentation files  (the
 "Software"), to  deal in  the Software without  restriction, including
 without limitation  the rights to  use, copy, modify,  merge, publish,
 distribute,  sublicense, and/or sell  copies of  the Software,  and to
 permit persons to whom the Software  is furnished to do so, subject to
 the following conditions:

 The  above  copyright  notice  and  this permission  notice  shall  be
 included in all copies or substantial portions of the Software.

 THE  SOFTWARE IS  PROVIDED  "AS  IS", WITHOUT  WARRANTY  OF ANY  KIND,
 EXPRESS OR  IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE  WARRANTIES OF
 MERCHANTABILITY,    FITNESS    FOR    A   PARTICULAR    PURPOSE    AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE,  ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.]]>
  </license>
  <dependencies>
  </dependencies>
</artifact-meta-data>
~~~~ 

## Build your Own Repository

You can build your own repository to use with Savant. The way that the Inversoft repository is setup is via Apache and Subversion. Using Subversion has a lot of advantages over SCP or Git. The main advantages are:

* Artifacts are backed up and new repositories can be created quickly from the Subversion repository. If something happens to the server or the directory that stores your Savant repository, it can be recreated from the Subversion repository.
* Subversion allows for single files to be added to a repository without the need to checkout the entire repository. When you release a project, this allows your project artifacts to be publish to the Subversion repository quickly.

Here is how to setup a custom repository using these two systems.

### Install Apache

Install Apache on your repository server. Usually Apache comes with or is available on most Linux servers. If you are running Ubuntu, you can install Apache like this:

~~~~ shell
$ sudo apt-get install apache2
~~~~ 

### Configure Apache

Determine the domain name you will want to use for you repository and configure Apache to respond to that domain name. You will also need to create a directory that will host the Savant repository that Apache will be serving. You can put this directory anywhere on the server you want, but a good place is **/var/savant/savant.mycompany.com**. Therefore, you will need to create this directory.

Usually, Apache requires site files be created in the **/etc/apache2/sites-available** directory. Here is an example of the Apache configuration file **/etc/apache2/sites-available/savant.mycompany.com.conf**:

~~~~ xml
<VirtualHost *:80>
  ServerName savant.mycompany.com
  ServerSignature On

  DocumentRoot /var/savant/savant.mycompany.com
  <Directory /var/savant/savant.mycompany.com>
    Options +FollowSymLinks +Indexes
    AllowOverride None
    Order allow,deny
    allow from all
    Require all granted
  </Directory>

  ErrorLog ${APACHE_LOG_DIR}/error.log

  # Possible values include: debug, info, notice, warn, error, crit,
  # alert, emerg.
  LogLevel warn

  CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
~~~~ 

Finally, enable your new Apache site like this:

~~~~ 
$ sudo a2ensite savant.mycompany.com
~~~~ 

### Install Subversion

Install Subversion on your repository server and configure it to work through Apache using webdav like this:

~~~~ 
$ sudo apt-get install subversion
$ sudo apt-get install libapache-webdav
$ sudo apt-get install libapache-subversion
~~~~ 

### Initialize Subversion

Create a Subversion repository that will hold your Savant repository. You can place this anywhere on the server that you want. A good spot is usually **/var/svn**. To setup a Subversion repository execute this command:

~~~~ 
$ sudo svnadmin create /var/svn/svn.mycompany.com/repository
~~~~ 

### Configure Subversion

Next, determine the domain name that Subversion will be available on via HTTP and create an Apache configuration file for Subversion in a file named after you domain name, like **/etc/apache2/sites-available/svn.mycompany.com.conf**. Finally, edit the file and configure Subversion. Here is an example Subversion configuration file:

~~~~ xml
<VirtualHost *:80>
  ServerName svn.mycompany.com

  <Location />
    Options +FollowSymLinks
    Order allow,deny
    Allow from all
    DAV svn
    SVNPath /var/svn/svn.mycompany.com/repository
    SVNPathAuthz off

    AuthType Basic
    AuthName "Subversion repository"
    AuthUserFile /var/svn/svn.mycompany.com/repository.auth
    Require valid-user
  </Location>

  ErrorLog ${APACHE_LOG_DIR}/error.log

  # Possible values include: debug, info, notice, warn, error, crit,
  # alert, emerg.
  LogLevel warn

  CustomLog ${APACHE_LOG_DIR}/access.log combined

</VirtualHost>
~~~~ 

You will need to create the **htpasswd** file that contains the credentials for your private Subversion repository. To do this, execute this command with the username and password you want to add:

~~~~ shell
$ htpasswd -b /var/svn/svn.mycompany.com/repository.auth <username> <password>
~~~~ 

### Check-out the Subversion Repository

Make sure that you create the Savant repository www document root directory we configured above like this:

~~~~ shell
$ mkdir /var/savant/savant.mycompany.com
~~~~ 

Next, checkout the Subversion repository to this directory like this:

~~~~ shell
$ cd /var/savant/savant.mycompany.com
$ svn co file:///var/svn/svn.mycompany.com/repository repository
$ chown -R www-data:www-data repository
~~~~ 

The most important parts here are that you are checking out the Subversion repository using a **file:///** URL. This will ensure that you don't have to battle with passwords and authentication since the repository is on the local server. Also, you MUST change the ownership of this directory to the user that is running Apache. On many Linux distros this user is named www-data.

### Subversion Hook

Finally, you will need to add a Subversion hook to your Subversion repository. This will tell Subversion to update a working copy each time a commit is made. This is how the files in the Subversion repository end up in the Savant repository directory. Here is an example **post-commit** hook file that you need to put in the **/var/svn/svn.mycompany.com/repository/hooks/post-commit** file.

~~~~ 
#!/bin/bash

svn up /var/savant/savant.mycompany.com
~~~~ 

### Start it all up

Finally, you need to start everything up by restarting Apache. Execute this command to restart Apache

~~~~ 
$ sudo service apache2 restart
~~~~ 
