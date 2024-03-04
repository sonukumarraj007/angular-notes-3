# Component & Templates

## Display data

Interpolation with double curly braces to display a component property.

The template is a multi-line string within ECMAScript 2015 backticks (\`). The backtick (\`)—which is not the same character as a single quote (')—allows you to compose a string over several lines, which makes the HTML more readable.

## Template Syntax

HTML is the language of the Angular template. Almost all HTML syntax is valid template syntax. The \<script> element is a notable exception; it is forbidden, eliminating the risk of script injection attacks. In practice, \<script> is ignored and a warning appears in the browser console. See the Security page for details.

Some legal HTML doesn't make much sense in a template. The \<html>, \<body>, and \<base> elements have no useful role. Pretty much everything else is fair game.

### HTML attribute vs. DOM property

This general rule can help you build a mental model of attributes and DOM properties: Attributes initialize DOM properties and then they are done. Property values can change; attribute values can't.

There is one exception to this rule. Attributes can be changed by setAttribute(), which re-initializes corresponding DOM properties.

### ngModel

Before using the ngModel directive in a two-way data binding, you must import the FormsModule and add it to the NgModule's imports list. Learn more about the FormsModule and ngModel in Forms.

You could achieve the same result with separate bindings to the \<input> element's value property and input event:

``` html
<label for="without">without NgModel:</label>
<input [value]="currentItem.name" (input)="currentItem.name=$event.target.value" id="without">
```

To streamline the syntax, the ngModel directive hides the details behind its own ngModel input and ngModelChange output properties:

``` html
<label for="example-change">(ngModelChange)="...name=$event":</label>
<input [ngModel]="currentItem.name" (ngModelChange)="currentItem.name=$event" id="example-change">
```

The ngModel data property sets the element's value property and the ngModelChange event property listens for changes to the element's value.

#### NgModel and value accessors

The details are specific to each kind of element and therefore the NgModel directive only works for an element supported by a ControlValueAccessor that adapts an element to this protocol. Angular provides value accessors for all of the basic HTML form elements and the Forms guide shows how to bind to them.

You can't apply [(ngModel)] to a non-form native element or a third-party custom component until you write a suitable value accessor. For more information, see the API documentation on DefaultValueAccessor.

You don't need a value accessor for an Angular component that you write because you can name the value and event properties to suit Angular's basic two-way binding syntax and skip NgModel altogether. The sizer in the Two-way Binding section is an example of this technique.

``` html
<app-sizer [size]="fontSizePx" (sizeChange)="fontSizePx=$event"></app-sizer>

<app-sizer [(size)]="fontSizePx"></app-sizer>
```

This [(ngModel)] syntax can only set a data-bound property. If you need to do something more, you can write the expanded form; for example, the following changes the \<input> value to uppercase:

``` html
<input [ngModel]="currentItem.name" (ngModelChange)="setUppercaseName($event)" id="example-uppercase">
```


## Lifecycle Hooks

### OnChanges

Angular calls its ngOnChanges() method whenever it detects changes to input properties of the component (or directive).
****
Angular only calls the hook when the value of the input property changes. The value of the hero property is the reference to the hero object. **Angular doesn't care that the hero's own name property changed. The hero object reference didn't change so, from Angular's perspective, there is no change to report!**

### ngAfterViewInit

``` typescript
ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    this.logIt('AfterViewInit');
    this.doSomething();
}

// This surrogate for real business logic sets the `comment`
private doSomething() {
  let c = this.viewChild.hero.length > 10 ? `That's a long name` : '';
  if (c !== this.comment) {
    // Wait a tick because the component's view has already been checked
    this.logger.tick_then(() => this.comment = c);
  }
}
```

#### Abide by the unidirectional data flow rule

The doSomething() method updates the screen when the hero name exceeds 10 characters.

Angular's unidirectional data flow rule forbids updates to the view after it has been composed. Both of these hooks fire after the component's view has been composed.

Angular throws an error if the hook updates the component's data-bound comment property immediately (try it!). The LoggerService.tick_then() postpones the log update for one turn of the browser's JavaScript cycle and that's just long enough.

``` typescript
@ViewChild(CountdownTimerComponent, {static: false})
private timerComponent: CountdownTimerComponent;

seconds() { return 0; }

ngAfterViewInit() {
    // Redefine `seconds()` to get from the **`CountdownTimerComponent**.seconds` ...
    // but wait a tick first to avoid one-time devMode
    // unidirectional-data-flow-violation error
    setTimeout(() => this.seconds = () => this.timerComponent.seconds, 0);
}
```

The ngAfterViewInit() lifecycle hook is an important wrinkle. The timer component isn't available until after Angular displays the parent view. So it displays 0 seconds initially.

Then Angular calls the ngAfterViewInit lifecycle hook at which time it is too late to update the parent view's display of the countdown seconds. Angular's unidirectional data flow rule prevents updating the parent view's in the same cycle. The app has to wait one turn before it can display the seconds.

Use setTimeout() to wait one tick and then revise the seconds() method so that it takes future values from the timer component.

### AfterContent hooks

``` typescript
ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    this.logIt('AfterContentInit');
    this.doSomething();
}

// This surrogate for real business logic sets the `comment`
private doSomething() {
    this.comment = this.contentChild.hero.length > 10 ? `That's a long name` : '';
}
```

#### No unidirectional flow worries with AfterContent

This component's doSomething() method update's the component's data-bound comment property immediately. There's no need to wait.

Recall that Angular calls both AfterContent hooks before calling either of the AfterView hooks. Angular completes composition of the projected content before finishing the composition of this component's view. There is a small window between the AfterContent... and AfterView... hooks to modify the host view.

## Attribute Directives and Structural Directives

There are two other kinds of Angular directives, described extensively elsewhere: (1) components and (2) attribute directives.

A component manages a region of HTML in the manner of a native HTML element. Technically it's a directive with a template.

An attribute directive changes the appearance or behavior of an element, component, or another directive. For example, the built-in NgStyle directive changes several element styles at the same time.

>You can apply many attribute directives to one host element. You can only apply one structural directive to a host element.

### Structural Directives

Structural directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, or manipulating elements.

The asterisk is "syntactic sugar" for something a bit more complicated. Internally, Angular translates the *ngIf attribute into a \<ng-template> element, wrapped around the host element, like this.

``` html
<ng-template [ngIf]="hero">
  <div class="name">{{hero.name}}</div>
</ng-template>
```

#### Inside *ngFor

Angular transforms the *ngFor in similar fashion from asterisk (*) syntax to \<ng-template> element.

``` html
<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{hero.name}}
</div>

<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>
```
