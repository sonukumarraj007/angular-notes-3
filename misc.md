``` typescript
onKey(event: KeyboardEvent) { // with type info
    this.values += (event.target as HTMLInputElement).value + ' | ';
}
```

### The $any() type cast function
Sometimes a binding expression triggers a type error during AOT compilation and it is not possible or difficult to fully specify the type. To silence the error, you can use the $any() cast function to cast the expression to the any type as in the following example:

```html
<p>The item's undeclared best by date is: {{$any(item).bestByDate}}</p>
```


## Abide by the unidirectional data flow rule

use setTimeout when changing some properties in **AfterView** hooks.

**No unidirectional flow worries with AfterContent**
This component's doSomething() method update's the component's data-bound comment property immediately. There's no need to wait.

Recall that Angular calls both AfterContent hooks before calling either of the AfterView hooks. Angular completes composition of the projected content before finishing the composition of this component's view. There is a small window between the AfterContent... and AfterView... hooks to modify the host view.

``` html
template: `
  <div>-- child view begins --</div>
    <app-child-view></app-child-view>
  <div>-- child view ends --</div>`
```

``` typescript
export class AfterViewComponent implements  AfterViewChecked, AfterViewInit {
  private prevHero = '';

  // Query for a VIEW child of type `ChildViewComponent`
  @ViewChild(ChildViewComponent, {static: false}) viewChild: ChildViewComponent;

  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    this.logIt('AfterViewInit');
    this.doSomething();
  }

  ngAfterViewChecked() {
    // viewChild is updated after the view has been checked
    if (this.prevHero === this.viewChild.hero) {
      this.logIt('AfterViewChecked (no change)');
    } else {
      this.prevHero = this.viewChild.hero;
      this.logIt('AfterViewChecked');
      this.doSomething();
    }
  }
  // ...

  // This surrogate for real business logic sets the `comment`
    private doSomething() {
        let c = this.viewChild.hero.length > 10 ? `That's a long name` : '';
        if (c !== this.comment) {
            // Wait a tick because the component's view has already been checked
            this.logger.tick_then(() => this.comment = c);
        }
    }
}
```

``` typescript
import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  logs: string[] = [];
  prevMsg = '';
  prevMsgCount = 1;

  log(msg: string)  {
    if (msg === this.prevMsg) {
      // Repeat message; update last log entry with count.
      this.logs[this.logs.length - 1] = msg + ` (${this.prevMsgCount += 1}x)`;
    } else {
      // New message; log it.
      this.prevMsg = msg;
      this.prevMsgCount = 1;
      this.logs.push(msg);
    }
  }

  clear() { this.logs = []; }

  // schedules a view refresh to ensure display catches up
  tick() {  this.tick_then(() => { }); }
  tick_then(fn: () => any) { setTimeout(fn, 0); }
}
```

## View encapsulation

As discussed earlier, component CSS styles are encapsulated into the component's view and don't affect the rest of the application.

To control how this encapsulation happens on a per component basis, you can set the view encapsulation mode in the component metadata. Choose from the following modes:

ShadowDom view encapsulation uses the browser's native shadow DOM implementation (see Shadow DOM on the MDN site) to attach a shadow DOM to the component's host element, and then puts the component view inside that shadow DOM. The component's styles are included within the shadow DOM.

Native view encapsulation uses a now deprecated version of the browser's native shadow DOM implementation - learn about the changes.

Emulated view encapsulation (the default) emulates the behavior of shadow DOM by preprocessing (and renaming) the CSS code to effectively scope the CSS to the component's view. For details, see Appendix 1.

None means that Angular does no view encapsulation. Angular adds the CSS to the global styles. The scoping rules, isolations, and protections discussed earlier don't apply. This is essentially the same as pasting the component's styles into the HTML.

``` typescript
// warning: few browsers support shadow DOM encapsulation at this time
encapsulation: ViewEncapsulation.Native
```

## Service module

Service modules provide utility services such as data access and messaging. Ideally, they consist entirely of providers and have no declarations. Angular's HttpClientModule is a good example of a service module.

The root AppModule is the only module that should import service modules.

## Entry components

An entry component is any component that Angular loads imperatively, **(which means you’re not referencing it in the template)**, by type. You specify an entry component by bootstrapping it in an NgModule, or including it in a routing definition.

To contrast the two types of components, there are components which are included in the template, which are declarative. Additionally, there are components which you load imperatively; that is, entry components.

There are two main kinds of entry components:

The bootstrapped root component.
A component you specify in a route definition.

