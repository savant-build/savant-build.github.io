---
layout: docs
title: Database Plugin
description: The database plugin allows you to create databases for testing your software.
---

The Savant Database Plugin provides the ability to work with databases. The features of the plugin are also the public methods of the plugin class so you can refer to the [Groovy Doc](docs/) for more information.

**LATEST VERSION: 1.0.0**

## Loading the Plugin

Here is how you load this plugin:

~~~~ groovy
database = loadPlugin(id: "org.savantbuild.plugin:database:1.0.0")
~~~~ 

## Configuring the Plugin

The Database Plugin has a number of configuration options that are stored in the DatabaseSettings object instance inside the plugin. There are a couple of settings that are required. Other settings have defaults that should work for you, but you can change anything you want.

### Database Type

You must specify the database type to use. This is defined using the **type** field on the settings class like this:

~~~~ groovy
database.settings.type = "mysql"
~~~~ 

Currently, this plugin supports **mysql and **postgresql** for the type. You can also change the type and re-execute the plugin methods if necessary. This allows you to setup multiple databases with different types.

### Database Name

You can change the name of the database that the plugin uses. This is specified by the **name** field on the settings class like this:

~~~~ groovy
database.settings.name = "foobar"
~~~~ 

This will cause the plugin to use the **foobar** database. The default for the name of the database is constructed using the project name. However, any dashes in the project name are replaced with underscores. For example, if your project name is ~~~~ my-project~~~~  the database name will be ~~~~ my_project~~~~ .

### Create Arguments

You can supply additional command-line arguments to the **mysql** or **psql** programs when the database is created. These are specified like this:

~~~~ groovy
database.settings.createArguments = "-f"
~~~~ 

This will pass the -f argument to the command-line when creating the database.

### Create Username

You can change the user used to create the database. This is configured like this:

~~~~ groovy
database.settings.createUsername = "superuser"
~~~~ 

The default value for **createUsername** depends on the database type you specified. For **mysql** it is **root** and for **postgresql** it is **postgres**.

### Compare Username and Password

When comparing two databases (described below), you can change the user and password that is used to connect to the database using the **compareUsername** and **comparePassword** fields on the settings object. Here is an example:

~~~~ groovy
database.settings.compareUsername = "user1"
database.settings.comparePassword = "secret"
~~~~ 

### Grant User

After the database is create, the plugin also grants permissions to the new database to a single user. The user granted permissions is controlled by the **grantUsername** and **comparePassword** fields on the session object. Here is an example:

~~~~ groovy
database.settings.grantUsername = "dbuser"
database.settings.grantPassword = "supersecret"
~~~~ 


# Creating the Database

The **createDatabase**,  **createMainDatabase** and **createTestDatabase** methods on the plugin allow you to create the project databases. The **createDatabase** method creates a database using the **name** setting. The **createTestDatabase** creates a database using the project name appended with **_test** as the name. For example, if your project is named **foo-bar** this will create a database named **foo_bar_test**.  The **createMainDatabase** creates a database using the project name appended as the name. For example, if your project is named **foo-bar** this will create a database named **foo_bar**.

Here is how you call these methods:

~~~~ groovy
database.settings.type = "mysql"
database.settings.name = "foo-bar"
database.createDatabase()

database.createMainDatabase()

database.createTestDatabase()
~~~~ 

## Executing Scripts

The **execute** method allows you to execute arbitrary SQL scripts on a database. This uses the command-line tools rather than JDBC, which means that handling stored procedures and complex SQL is much simpler. Here is how you call this method:

~~~~ groovy
database.settings.name = "foo-bar"
database.settings.type = "mysql"
database.execute(file: "foo.sql")
~~~~ 

This will use the user **dev** to execute the script since that is the **grantUsername** setting. For MySQL, it will also use the **grantPassword** setting to execute the script.

However, PostgreSQL doesn't allow passwords to be passed in via the command-line. Therefore, you must setup a **~/.pgpass** file in your home directory to configure the password to use. This file should look something like this:

~~~~ 
localhost:5432:*:postgres:password
localhost:5432:*:dev:dev
~~~~ 

## Comparing Databases

Often you need to verify that your database migrations work correctly. To accomplish this, you can compare two different database to ensure that they are identical. The Database Plugin uses Liquibase to compare databases. You can use the **compare** or **ensureEqual** methods to compare databases.

The **compare** method returns a DiffResult object that contains the results of the comparison. The **ensureEqual** method fails the build if the databases aren't equal.

Here is how you call these methods:

~~~~ groovy
database.settings.type = "mysql"
database.settings.compareUsername = "dev"
database.settings.comparePassword = "dev"
def result = database.compare(left: "database1", right: "database2")
result.areEqual()
result.getReferenceSnapshot().getDatabase().close()
result.getComparisonSnapshot().getDatabase().close()
~~~~ 

~~~~ groovy
database.settings.type = "mysql"
database.settings.compareUsername = "dev"
database.settings.comparePassword = "dev"
database.ensureEqual(left: "database1", right: "database2")
~~~~ 