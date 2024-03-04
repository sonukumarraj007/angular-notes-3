## 1. @Inject() and @Injectable

### @Inject()

@Inject() is a manual mechanism for letting Angular know that a parameter must be injected.
It can be used like so:

```typescript
import { Component, Inject } from '@angular/core';
import { ChatWidget } from '../components/chat-widget';

@Component({
    selector: 'app-root',
    template: `
        Encryption: {{ encryption }}
    `
})
export class AppComponent {
    encryption = this.chatWidget.chatSocket.encryption;

    constructor(@Inject(ChatWidget) private chatWidget) {}
}
```

The above example would be simplified in TypeScript to:

```typescript
constructor(private chatWidget: ChatWidget) { }
```

#### Non-class dependencies

Not all dependencies are classes. Sometimes you want to inject a string, function, or object.

Apps often define configuration objects with lots of small facts, like the title of the application or the address of a web API endpoint. These configuration objects aren't always instances of a class. They can be object literals, as shown in the following example.

```typescript
export const HERO_DI_CONFIG: AppConfig = {
  apiEndpoint: 'api.heroes.com',
  title: 'Dependency Injection'
};

// FAIL! Can't use interface as provider token
[{ provide: AppConfig, useValue: HERO_DI_CONFIG })]

// FAIL! Can't inject using the interface as the parameter type
constructor(private config: AppConfig){ }

// solution
import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
// -----------------

providers: [{ provide: APP_CONFIG, useValue: HERO_DI_CONFIG }]
// -----------------

constructor(@Inject(APP_CONFIG) config: AppConfig) {
  this.title = config.title;
}
```

### @Injectable()

@Injectable() lets Angular know that a class can be used with the dependency injector.
@Injectable() is not strictly required if the class has other Angular decorators on it or does not have any dependencies. What is important is that any class that is going to be injected with Angular is decorated. However, best practice is to decorate injectables with @Injectable(), as it makes more sense to the reader.
Here's an example of ChatWidget marked up with @Injectable:

```typescript
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { AuthWidget } from './auth-widget';
import { ChatSocket } from './chat-socket';

@Injectable()
export class ChatWidget {
    constructor(public authService: AuthService, public authWidget: AuthWidget, public chatSocket: ChatSocket) {}
}
```

In the above example Angular's injector determines what to inject into ChatWidget's constructor by using type information. This is possible because these particular dependencies are typed, and are not primitive types. In some cases Angular's DI needs more information than just types.

## 2. Services

Services in angular are classes decorated with @Injectable(). Angular create single instance of these services and provide them throughout the angular application. The main objective of service is to separate business logic from component.

```typescript
// hero.service.ts
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';

@Injectable({
    // we declare that this service should be created
    // by the root application injector.
    providedIn: 'root'
})
export class HeroService {
    getHeroes() {
        return HEROES;
    }
}

// injecting a service into component/service
// hero-list.component.ts
import { Component } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
    selector: 'app-hero-list',
    template: `
        <div *ngFor="let hero of heroes">{{ hero.id }} - {{ hero.name }}</div>
    `
})
export class HeroListComponent {
    heroes: Hero[];

    constructor(heroService: HeroService) {
        this.heroes = heroService.getHeroes();
    }
}
```

## 3. How to pass value between components without using services?

We can pass data between components by using

### 1. Using @Input() and @Output() decorators (parent child component interaction)

We can provide input properties to a component. In order to make it bindable from outside we have to decorate the property with @Input().
We can emit the values from a component. We have to decorate such properties with @Output().

```typescript
// child.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-voter',
    template: `
        <h4>{{ name }}</h4>
        <button (click)="vote(true)" [disabled]="didVote">Agree</button>
        <button (click)="vote(false)" [disabled]="didVote">Disagree</button>
    `
})
export class VoterComponent {
    @Input() name: string;
    @Output() voted = new EventEmitter<boolean>();
    didVote = false;

    vote(agreed: boolean) {
        this.voted.emit(agreed);
        this.didVote = true;
    }
}

// parent.component.ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-vote-taker',
    template: `
        <h2>Should mankind colonize the Universe?</h2>
        <h3>Agree: {{ agreed }}, Disagree: {{ disagreed }}</h3>
        <app-voter *ngFor="let voter of voters" [name]="voter" (voted)="onVoted($event)"> </app-voter>
    `
})
export class VoteTakerComponent {
    agreed = 0;
    disagreed = 0;
    voters = ['Narco', 'Celeritas', 'Bombasto'];

    onVoted(agreed: boolean) {
        agreed ? this.agreed++ : this.disagreed++;
    }
}
```

## 4. ViewEncapsulations

It defines style encapsulation options for the component styles.
To control style encapsulation we can give encapsulation metadata in component decorator.
We have 4 options for encapsulation.

**ShadowDom** view encapsulation uses the browser's native shadow DOM implementation (see [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM) on the MDN site) to attach a shadow DOM to the component's host element, and then puts the component view inside that shadow DOM. The component's styles are included within the shadow DOM.

**Native** view encapsulation uses a now **deprecated** version of the browser's native shadow DOM implementation - learn about the changes.

**Emulated** view encapsulation (the **default**) emulates the behavior of shadow DOM by preprocessing (and renaming) the CSS code to effectively scope the CSS to the component's view. For details, see Inspecting generated CSS below.

**None** means that Angular does no view encapsulation. Angular adds the CSS to the global styles. The scoping rules, isolations, and protections discussed earlier don't apply. This is essentially the same as pasting the component's styles into the HTML.

Inspecting generated CSS

```html
<hero-details _nghost-pmm-5>
  <h2 _ngcontent-pmm-5>Mister Fantastic</h2>
  <hero-team _ngcontent-pmm-5 _nghost-pmm-6>
    <h3 _ngcontent-pmm-6>Team</h3>
  </hero-team>
</hero-detail>
```

There are two kinds of generated attributes:

-   An element that would be a shadow DOM host in native encapsulation has a generated \_nghost attribute. This is typically the case for component host elements.

-   An element within a component's view has a \_ngcontent attribute that identifies to which host's emulated shadow DOM this element belongs.

The exact values of these attributes aren't important. They are automatically generated and you never refer to them in application code. But they are targeted by the generated component styles, which are in the \<head> section of the DOM:

```css
[_nghost-pmm-5] {
    display: block;
    border: 1px solid black;
}

h3[_ngcontent-pmm-6] {
    background-color: white;
    border: 1px solid #777;
}
```

These styles are post-processed so that each selector is augmented with \_nghost or \_ngcontent attribute selectors. These extra selectors enable the scoping rules described in this page.

## 5. Change Detection Strategy

Angular performs change detection on all components (from top to bottom) every time something changes in your app from something like a user event or data received from a network request.

set the change detection strategy to OnPush on specific components. Doing this will instruct Angular to run change detection on these components and their sub-tree only when new references are passed to them versus when data is simply mutated.

https://alligator.io/angular/change-detection-strategy/

```typescript
enum ChangeDetectionStrategy {
  OnPush: 0
  Default: 1
}
```

OnPush: 0

Use the CheckOnce strategy, meaning that automatic change detection is deactivated until reactivated by setting the strategy to Default (CheckAlways). Change detection can still be explicitly invoked. This strategy applies to all child directives and cannot be overridden.

Default: 1

Use the default CheckAlways strategy, in which change detection is automatic until explicitly deactivated.

## 6. Bootstrap Component, Bootstrap Module

We can provide Bootstrap components in providers array of @NgModule decorator metadata.
Angular bootstraps this component when it finds it in index.html file.

Bootstrap module is the module which you specify in main.ts file.
main.ts is the entry point for the app.

```typescript
// app.module.ts
@NgModule({
    declarations: [],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

// app.component.ts
import { Component, OnInit } from '@angular/core';
import { WithoutInjectableService } from './services/without-injectable.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'angular-site';

    constructor() {}

    ngOnInit() {}
}

// main.ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
```

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Angular exercise</title>
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
    </head>
    <body>
        <app-root></app-root>
    </body>
</html>
```

## 7. can we change the main.ts file to something else and how?

Yes. by changing the value of property main in angular.json file.

## 8. View child and content child

ViewChild is property decorator. It is configured with query selector. The change detector looks for the first element of the directive matching the selector in the view DOM.
If the DOM changes, and a new child matches the the selector, the property is updated.

View queries are set before the ngAfterViewInit callback is called.

View queries are set before the ngAfterViewInit callback is called.

Metadata Properties:

-   selector - The directive type or the name used for querying.
-   read - True to read a different token from the queried elements.
-   static - True to resolve query results before change detection runs, false to resolve after change detection. Defaults to false.

The following selectors are supported.

-   Any class with the @Component or @Directive decorator

-   A template reference variable as a string (e.g. query <my-component #cmp>\</my-component> with @ViewChild('cmp'))

-   Any provider defined in the child component tree of the current component (e.g. @ViewChild(SomeService) someService: SomeService)

-   Any provider defined through a string token (e.g. @ViewChild('someToken') someTokenVal: any)

-   A TemplateRef (e.g. query \<ng-template>\</ng-template> with @ViewChild(TemplateRef) template;)

ContentChild is same as ViewChild except it targets content DOM.

```typescript
import { ViewChildren, QueryList } from '@angular/core';
.
.
.
class JokeListComponent implements AfterViewInit {

  jokes: Joke[] = [
    new Joke("What did the cheese say when it looked in the mirror", "Hello-me (Halloumi)"),
    new Joke("What kind of cheese do you use to disguise a small horse", "Mask-a-pony (Mascarpone)")
  ];

  @ViewChild(JokeComponent) jokeViewChild: JokeComponent;
  @ViewChildren(JokeComponent) jokeViewChildren: QueryList<JokeComponent>; (1)

  ngAfterViewInit() {
    console.log(`ngAfterViewInit - jokeViewChild is ${this.jokeViewChild}`);
    let jokes: JokeComponent[] = this.jokeViewChildren.toArray(); (2)
    console.log(jokes);
  }
}
```

## 9. ngClass and NgStyle

These are the built in directives provided by Angular.
ngClass lets us control(adds or removes) classes based on condition.

```html
<some-element [ngClass]="'first second'">...</some-element>

<some-element [ngClass]="['first', 'second']">...</some-element>

<some-element [ngClass]="{'first': true, 'second': true, 'third': false}">...</some-element>

<some-element [ngClass]="stringExp|arrayExp|objExp">...</some-element>

<some-element [ngClass]="{'class1 class2 class3' : true}">...</some-element>
```

ngStyle updates styles of the html elements.

```html
<!-- Set the font of the containing element to the result of an expression. -->
<some-element [ngStyle]="{'font-style': styleExp}">...</some-element>

<!-- Set the width of the containing element to a pixel value returned by an expression. -->
<some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>

<!-- Set a collection of style values using an expression that returns key-value pairs. -->
<some-element [ngStyle]="objExp">...</some-element>
```

## 10 Entry components (deprecated in Angular 9)

An entry component is any component that Angular loads **imperatively**, (which means you’re not referencing it in the template), by type.
You specify an entry component by bootstrapping it in an NgModule, or including it in a routing definition.

> To contrast the two types of components, there are components which are included in the template, which are **declarative**. Additionally, there are components which you load imperatively; that is, entry components.

There are two main kinds of entry components:

-   The bootstrapped root component.
-   A component you specify in a route definition.

the Angular compiler only generates code for components which are reachable from the entryComponents; This means that adding more references to @NgModule.declarations does not imply that they will necessarily be included in the final bundle.

In fact, many libraries declare and export components you'll never use. For example, a material design library will export all components because it doesn’t know which ones you will use. However, it is unlikely that you will use them all. For the ones you don't reference, the tree shaker drops these components from the final code package.

**If a component isn't an entry component and isn't found in a template, the tree shaker will throw it away.** So, it's best to add only the components that are truly entry components to help keep your app as trim as possible.

## Angular moment (ngx-moment)

momentjs wrapper for angular

## If we have 500+ test cases, then how can I execute parallel threads at one time?

A Karma JS plugin to support sharding tests to run in parallel across multiple browsers. Now supporting code coverage!
https://www.npmjs.com/package/karma-parallel

## Angular event service

https://www.npmjs.com/package/angular-event-service
