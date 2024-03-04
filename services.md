# Services

``` typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
}
```

The service itself is a class that the CLI generated and that's decorated with @Injectable(). By default, this decorator has a providedIn property, which creates a provider for the service. In this case, providedIn: 'root' specifies that Angular should provide the service in the root injector.

In the basic CLI-generated app, modules are eagerly loaded which means that they are all loaded when the app launches. Angular uses an injector system to make things available between modules. In an eagerly loaded app, the root application injector makes all of the providers in all of the modules available throughout the app.

This behavior necessarily changes when you use lazy loading. Lazy loading is when you load modules only when you need them; for example, when routing. They aren’t loaded right away like with eagerly loaded modules. This means that any services listed in their provider arrays aren’t available because the root injector doesn’t know about these modules.

When the Angular router lazy-loads a module, it creates a new injector. This injector is a child of the root application injector. Imagine a tree of injectors; there is a single root injector and then a child injector for each lazy loaded module. The router adds all of the providers from the root injector to the child injector. When the router creates a component within the lazy-loaded context, Angular prefers service instances created from these providers to the service instances of the application root injector.

Any component created within a lazy loaded module’s context, such as by router navigation, gets the local instance of the service, not the instance in the root application injector. Components in external modules continue to receive the instance created for the application root.

Though you can provide services by lazy loading modules, not all services can be lazy loaded. For instance, some modules only work in the root module, such as the Router. The Router works with the global location object in the browser.

## Limiting provider scope with components

Another way to limit provider scope is by adding the service you want to limit to the component’s providers array. Component providers and NgModule providers are independent of each other. This method is helpful for when you want to eagerly load a module that needs a service all to itself. Providing a service in the component limits the service only to that component (other components in the same module can’t access it.)

``` typescript
@Component({
/* . . . */
  providers: [UserService]
})
```

Register a provider with a component when you must limit a service instance to a component and its component tree, that is, its child components.

## forRoot & forChild

Use forRoot() to separate providers from a module so you can import that module into the root module with providers and child modules without providers.

Create a static method forRoot() on the module.
Place the providers into the forRoot() method.

src/app/greeting/greeting.module.ts

``` typescript
static forRoot(config: UserServiceConfig): ModuleWithProviders {
  return {
    ngModule: GreetingModule,
    providers: [
      {provide: UserServiceConfig, useValue: config }
    ]
  };
}
```
