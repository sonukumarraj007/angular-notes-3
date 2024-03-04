

https://alligator.io/angular/providers-shared-modules/

Sometimes you’ll want to create a shared module in an Angular app that defines services, pipes and directives that feature modules and lazy-loaded modules can use. The one little hiccup is that services, which are normally supposed to act as singletons, could end up being provided multiple times, especially for lazy-loaded modules. Luckily for us however, there’s an easy fix for that specific use-case by defining a static forRoot method in the shared module that returns a ModuleWithProviders object.

Here’s a sample implementation. First, our shared module:

./shared/shared.module.ts

``` typescript
import { NgModule, ModuleWithProviders } from '@angular/core';

import { MyDirective } from './my.directive';
import { FunPipe } from './fun.pipe';
import { SomeService } from './some.service';

@NgModule({
  declarations: [
    FunPipe,
    MyDirective
  ],
  exports: [
    FunPipe,
    MyDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ SomeService ]
    };
  }
}
```

Notice how we declare and export our pipes and directives as usual in the NgModule’s metadata, but we don’t provide the service. Instead, we define a static  forRoot method in the module’s class that returns an object that implements Angular’s ModuleWithProviders interface.

Now, in our app module, we can import the shared module and call forRoot on it to also provide our service:


app.module.ts

``` typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule.forRoot()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}

```

Then finally, in any feature module we can simply import the shared module without the forRoot and we’ll have access to the shared pipes and directives without providing the service again:

some-feature.module.ts

``` typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

// ...

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    // ...
  ]
})
export class SomeFeatureModule {}
```

That's it! A neat little trick to make it easier to work with shared modules and lazy-loaded feature modules.