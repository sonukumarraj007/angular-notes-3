# Architecture

An app always has at least a root module that enables bootstrapping, and typically has many more feature modules.

## Decorators

Decorators are functions that modify JavaScript classes. Angular defines a number of decorators that attach specific kinds of metadata to classes, so that the system knows what those classes mean and how they should work.

Learn more about decorators on the web.
https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.x5c2ndtx0



## Introduction to modules
Angular apps are modular and Angular has its own modularity system called NgModules. NgModules are containers for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities. They can contain components, service providers, and other code files whose scope is defined by the containing NgModule. They can import functionality that is exported from other NgModules, and export selected functionality for use by other NgModules.

### NgModule metadata
An NgModule is defined by a class decorated with @NgModule(). The @NgModule() decorator is a function that takes a single metadata object, whose properties describe the module. The most important properties are as follows.

declarations: The components, directives, and pipes that belong to this NgModule.

exports: The subset of declarations that should be visible and usable in the component templates of other NgModules.

imports: Other modules whose exported classes are needed by component templates declared in this NgModule.

providers: Creators of services that this NgModule contributes to the global collection of services; they become accessible in all parts of the app. (You can also specify providers at the component level, which is often preferred.)

bootstrap: The main application view, called the root component, which hosts all other app views. Only the root NgModule should set the bootstrap property.

Here's a simple root NgModule definition.

``` typescript
@NgModule({
  declarations: [
    AppComponent,
    ChildComponent,
    C1Component,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutesModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: HomeComponent, multi: true
    },
    CounterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


## Support for the development cycle
Compilation: Angular provides just-in-time (JIT) compilation for the development environment, and ahead-of-time (AOT) compilation for the production environment.

Testing platform: Run unit tests on your application parts as they interact with the Angular framework.

Internationalization: Make your app available in multiple languages with Angular's internationalization (i18n) tools.

Security guidelines: Learn about Angular's built-in protections against common web-app vulnerabilities and attacks such as cross-site scripting attacks.