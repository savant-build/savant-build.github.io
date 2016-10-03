---
layout: docs
title: Dependency Management Library
description: The Dependency Management Library can be used from any JVM language to manage dependencies.
---

The Savant Dependency Management Library is a stand-alone library that can be used to manage Savant dependencies. You can easily embed this library in an application, IDE, or any other tool.

The dependency management library is simple to use. The main entry point is the interface **org.savantbuild.dep.DependencyService** and the default implementation **org.savantbuild.dep.DefaultDependencyService**.

This class contains 4 simple methods that perform all of the dependency management tasks a project might have.

There are two main processes for dependency management:

* Resolution
* Publication


## Resolution

Resolution is the process of downloading and caching a projects dependencies. During the resolution process, transitive dependencies might also be downloaded and cached and dependency source files might also be downloaded and cached.

There are 3 steps to to dependency resolution:

1. Build a DependencyGraph
2. Prune (reduce) the DependencyGraph into an ArtifactGraph
3. Resolve the artifacts and store the results in a ResolvedArtifactGraph


### Building The DependencyGraph

The first step of resolving dependencies is to build a DependencyGraph. This data structure models all of the dependencies of a project including all transitive dependencies and all versions. It could be that a project depends on a single artifact multiple times (through transitive dependencies) with different versions.

Here is a line drawing of a complex dependency graph:

~~~~
root(1.0.0)-->(1.0.0)multiple-versions(1.0.0)-->(1.0.0)leaf:leaf
           |            (1.1.0)       (1.1.0)-->(2.0.0)leaf:leaf
           |              ^                         (1.0.0) (2.0.0)
           |              |                           |       ^
           |->(1.0.0)intermediate                     |       |
           |              |                           |       |
           |             \/                           |       |
           |          (1.1.0)                      (1.0.0) (1.1.0)
           |->(1.0.0)multiple-versions-different-dependencies
           |
           |
           |
           |
~~~~ 

You can see that there are multiple versions of various dependencies in the graph.

To build a DependencyGraph, you must first build an Artifact object for your project. If you are embedding the dependency management library, you can mock this object out. Here's an example:

~~~~ java
Artifact project = new Artifact("com.example:my-project:1.0", MapBuilder.simpleMap(License.ApacheV2_0, null));
~~~~ 

Next, you need to construct the base set of Dependencies that will be resolved. This is done via the **org.savantbuild.dep.domain.Dependencies** class. Here is an example:

~~~~ java
Dependencies dependencies = new Dependencies(
    new DependencyGroup("compile", true,
        new Dependency("org.example:some-dep:1.0.0, false)
    )
);
~~~~ 

Lastly, you need to construct the **org.savantbuild.dep.workflow.Workflow** instance that will be used to download and cache the artifacts. This class uses the **org.savantbuild.dep.workflow.FetchWorkflow** and **org.savantbuild.dep.workflow.PublishWorkflow** classes. These classes use implementations of the **org.savantbuild.dep.workflow.Process** interface to download and cache the artifacts.

Here is a typical Workflow:

~~~~ java
Workflow workflow = new Workflow(
    new FetchWorkflow(output,
        new CacheProcess(output, cache.toString()),
        new URLProcess(output, "http://savant.inversoft.org", null, null)
    ),
    new PublishWorkflow(
        new CacheProcess(output, cache.toString())
    )
);
~~~~ 

This tells the dependency management system to first check the local cache to see if the artifacts exist. If they don't exist, check the HTTP web server located at http://savant.inversoft.org and if the artifact exists there, cache it locally (that's the PublishWorkflow part).

Now you can pass all of these objects into the **org.savantbuild.dep.DependencyService** buildGraph method like this:

~~~~ java
Output output = new SystemOutOutput(false);
DependencyService service = new DefaultDependencyService(output);
DependencyGraph dependencyGraph = service.buildGraph(project, dependencies, workflow);
~~~~ 

This will construct the DependencyGraph by fetching all of the **.amd** files from using the **Workflow** and parsing them. This process does not download the artifacts because it isn't necessary to download the artifacts to build this initial graph. The **.amd** files contain all of the transitive dependency information for each artifact and are used to build the DependencyGraph.


### Reducing the Graph

As illustrated in our graph example from above, the graph might contain multiple versions of various artifacts and extra links between artifacts that aren't necessary. You need to reduce the **DependencyGraph** before it can be used to download the artifact. Here is an example of a graph reduction:

~~~~ java
ArtifactGraph artifactGraph = service.reduce(dependencyGraph);
~~~~ 

At this point, the graph has been pruned and reduced using the process outlined by the [Semantic Versioning](http://semver.org). If the graph contains any violations of Semantic Versioning, a **org.savantbuild.dep.domain.CompatibilityException** is thrown.

#### Resolving the Artifacts

The final step that is part of dependency resolution is resolving of the artifacts. Once you have a valid ArtifactGraph, you can simply call the **resolve** method on the **DependencyService** to complete the resolution. The resolve method takes a **org.savantbuild.dep.DependencyService.ResolveConfiguration** instance that controls which artifacts are resolved.

Here is an example:

~~~~ java
ResolveConfiguration config = new ResolveConfiguration().with("compile", new TypeResolveConfiguration(true, "compile", "runtime"));
ResolvedArtifactGraph resolvedArtifactGraph = service.resolve(artifactGraph, workflow, config);
~~~~ 

This instructs the Savant dependency management system to resolve the **compile** time dependencies of the project and to also include all transitive dependencies in the **compile** and **runtime** groups. The boolean parameter on the **TypeResolveConfiguration** class instructs Savant to also download the source JAR for each artifact as well.


## Publication

Publishing artifacts is the process of copying the artifacts into a Savant repository or local cache (which is just a local Savant repository). To publish artifacts you need to define the publication and the workflow used to publish it.

The **org.savantbuild.dep.DependencyService** interface provides the **publish** method that is used to publish artifacts. Here is an example of constructing the necessary Objects and publishing an integration build of an artifact:

~~~~ java
Output output = new SystemOutOutput(false);
Artifact artifact = new Artifact("com.example:my-project:1.0.0-{integration}", MapBuilder.simpleMap(License.ApacheV2_0, null))
ArtifactMetaData amd = new ArtifactMetaData(dependencies, MapBuilder.simpleMap(License.ApacheV2_0, null));
Publication publication = new Publication(artifact, amd,
    Paths.resolve("build/jars/my-project-1.0.0.jar"),
    Paths.resolve("build/jars/my-project-1.0.0-src.jar"));
PublishWorkflow workflow = new PublishWorkflow(new CacheProcess(output));
DependencyService service = new DefaultDependencyService(output);
service.publish(publication, workflow);
~~~~

This instructs Savant to publish an integration build of the artifact **com.example:my-project:1.0.0** to the local cache (~/.savant/cache). The **Publication** object takes two files for the artifact, the main artifact file and the source file.

### Remote Publication

To publish an artifact to a remote repository, you simply need to change the PublishWorkflow like this:

~~~~ java
Output output = new SystemOutOutput(false);
Artifact artifact = new Artifact("com.example:my-project:1.0.0", MapBuilder.simpleMap(License.ApacheV2_0, null))
ArtifactMetaData amd = new ArtifactMetaData(dependencies, MapBuilder.simpleMap(License.ApacheV2_0, null));
Publication publication = new Publication(artifact, amd,
    Paths.resolve("build/jars/my-project-1.0.0.jar"),
    Paths.resolve("build/jars/my-project-1.0.0-src.jar"));
PublishWorkflow workflow = new PublishWorkflow(new SVNProcess(output, "http://svn.mycompany.com, null, null));
DependencyService service = new DefaultDependencyService(output);
service.publish(publication, workflow);
~~~~

This publishes the same artifact to a Subversion repository. This type of publication is used when a project is released.