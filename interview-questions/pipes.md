# Pipe

In Angular pipes are like functions which takes in data as input and transforms it to a desired output.

Angular comes with a stock of pipes such as DatePipe, UpperCasePipe, LowerCasePipe, CurrencyPipe, and PercentPipe. They are all available for use in any template.

eg. of built in date pipe use

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-hero-birthday',
    template: `
        <p>The hero's birthday is {{ birthday | date }}</p>
    `
})
export class HeroBirthdayComponent {
    birthday = new Date(1988, 3, 15); // April 15, 1988
}
```

## pass parameters to the pipe

A pipe can accept any number of optional parameters to fine-tune its output. To add parameters to a pipe, follow the pipe name with a colon ( : ) and then the parameter value (such as currency:'EUR'). If the pipe accepts multiple parameters, separate the values with colons (such as slice:1:5)

```html
<p>The hero's birthday is {{ birthday | date:"MM/dd/yy" }}</p>
```

You can chain pipes together in potentially useful combinations.

```html
<p>The chained hero's birthday is {{ birthday | date | uppercase}}</p>
```

## Custom pipes

You can write your own custom pipes

```typescript
// exponential-strength.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
 */
@Pipe({ name: 'exponentialStrength' })
export class ExponentialStrengthPipe implements PipeTransform {
    transform(value: number, exponent?: number): number {
        return Math.pow(value, isNaN(exponent) ? 1 : exponent);
    }
}

// power-booster.component.ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-power-booster',
    template: `
        <h2>Power Booster</h2>
        <p>Super power boost: {{ 2 | exponentialStrength: 10 }}</p>
    `
})
export class PowerBoosterComponent {}
```

## Pipes and change detection

Angular looks for changes to data-bound values through a change detection process that runs after every DOM event: every keystroke, mouse move, timer tick, and server response. This could be expensive. Angular strives to lower the cost whenever possible and appropriate.

Angular picks a simpler, faster change detection algorithm when you use a pipe.

## Pure and impure pipes

There are two categories of pipes: pure and impure. Pipes are pure by default.
You make a pipe impure by setting its pure flag to false.

```typescript
@Pipe({
  name: 'flyingHeroesImpure',
  pure: false
})
```

### Pure pipe

Angular executes a pure pipe only when it detects a pure change to the input value. A pure change is either a change to a primitive input value (String, Number, Boolean, Symbol) or a changed object reference (Date, Array, Function, Object).

Angular ignores changes within (composite) objects. It won't call a pure pipe if you change an input month, add to an input array, or update an input object property.

This may seem restrictive but it's also fast. An object reference check is fast—much faster than a deep check for differences—so Angular can quickly determine if it can skip both the pipe execution and a view update.

For this reason, a pure pipe is preferable when you can live with the change detection strategy. When you can't, you can use the impure pipe.

> Or you might not use a pipe at all. It may be better to pursue the pipe's purpose with a property of the component, a point that's discussed later in this page.

### Impure Pipe

Angular executes an impure pipe during every component change detection cycle. An impure pipe is called often, as often as every keystroke or mouse-move.

With that concern in mind, implement an impure pipe with great care. An expensive, long-running pipe could destroy the user experience.
