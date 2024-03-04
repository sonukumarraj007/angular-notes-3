# Directives overview

There are three kinds of directives in Angular:

1. Components—directives with a template.

2. Structural directives—change the DOM layout by adding and removing DOM elements.

3. Attribute directives—change the appearance or behavior of an element, component, or another directive.

## Inside *ngFor

```html
<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{hero.name}}
</div>

<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>
```

You enable these features in the string assigned to ngFor, which you write in Angular's microsyntax.

> Everything outside the ngFor string stays with the host element (the \<div>) as it moves inside the \<ng-template>. In this example, the [ngClass]="odd" stays on the \<div>.

*ngFor with trackBy

By default, when you use *ngFor without trackBy, *ngFor tracks array of objects changing through object identity. So, if new reference of array of objects is passed to the directive, even if the array is with the same values, Angular will not be able to detect that they are already drawn and presented in the current DOM. Instead, old elements will be removed and a new collection with the same values will be redrawn.

You can make this more efficient with trackBy. Add a method to the component that returns the value NgFor should track. In this case, that value is the hero's id.

## MicroSyntax

The Angular microsyntax lets you configure a directive in a compact, friendly string. The microsyntax parser translates that string into attributes on the \<ng-template>:
