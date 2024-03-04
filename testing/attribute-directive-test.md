## Attribute directive testing

The sample application's HighlightDirective sets the background color of an element based on either a data bound color or a default color (lightgray). It also sets a custom property of the element (customProperty) to true for no reason other than to show that it can.

```typescript
// app/shared/highlight.directive.ts

import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[highlight]' })
/** Set backgroundColor for the attached element to highlight color
 *  and set the element's customProperty to true */
export class HighlightDirective implements OnChanges {

  defaultColor =  'rgb(211, 211, 211)'; // lightgray

  @Input('highlight') bgColor: string;

  constructor(private el: ElementRef) {
    el.nativeElement.style.customProperty = true;
  }

  ngOnChanges() {
    this.el.nativeElement.style.backgroundColor = this.bgColor || this.defaultColor;
  }
}

// app/about/about.component.ts
import { Component } from '@angular/core';
@Component({
  template: `
  <h2 highlight="skyblue">About</h2>
  <h3>Quote of the day:</h3>
  <twain-quote></twain-quote>
  `
})
export class AboutComponent { }

// Testing the specific use of the HighlightDirective within the AboutComponent requires only the techniques explored above (in particular the "Shallow test" approach).

// app/about/about.component.spec.ts
beforeEach(() => {
  fixture = TestBed.configureTestingModule({
    declarations: [ AboutComponent, HighlightDirective],
    schemas:      [ NO_ERRORS_SCHEMA ]
  })
  .createComponent(AboutComponent);
  fixture.detectChanges(); // initial binding
});

it('should have skyblue <h2>', () => {
  const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
  const bgColor = h2.style.backgroundColor;
  expect(bgColor).toBe('skyblue');
});
```

A better solution is to create an artificial test component that demonstrates all ways to apply the directive.

```typescript
// app/shared/highlight.directive.spec.ts (TestComponent)
@Component({
  template: `
  <h2 highlight="yellow">Something Yellow</h2>
  <h2 highlight>The Default (Gray)</h2>
  <h2>No Highlight</h2>
  <input #box [highlight]="box.value" value="cyan"/>`
})
class TestComponent { }

// app/shared/highlight.directive.spec.ts (selected tests)
beforeEach(() => {
  fixture = TestBed.configureTestingModule({
    declarations: [ HighlightDirective, TestComponent ]
  })
  .createComponent(TestComponent);

  fixture.detectChanges(); // initial binding

  // all elements with an attached HighlightDirective
  des = fixture.debugElement.queryAll(By.directive(HighlightDirective));

  // the h2 without the HighlightDirective
  bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));
});

// color tests
it('should have three highlighted elements', () => {
  expect(des.length).toBe(3);
});

it('should color 1st <h2> background "yellow"', () => {
  const bgColor = des[0].nativeElement.style.backgroundColor;
  expect(bgColor).toBe('yellow');
});

it('should color 2nd <h2> background w/ default color', () => {
  const dir = des[1].injector.get(HighlightDirective) as HighlightDirective;
  const bgColor = des[1].nativeElement.style.backgroundColor;
  expect(bgColor).toBe(dir.defaultColor);
});

it('should bind <input> background to value color', () => {
  // easier to work with nativeElement
  const input = des[2].nativeElement as HTMLInputElement;
  expect(input.style.backgroundColor).toBe('cyan', 'initial backgroundColor');

  // dispatch a DOM event so that Angular responds to the input value change.
  input.value = 'green';
  input.dispatchEvent(newEvent('input'));
  fixture.detectChanges();

  expect(input.style.backgroundColor).toBe('green', 'changed backgroundColor');
});


it('bare <h2> should not have a customProperty', () => {
  expect(bareH2.properties['customProperty']).toBeUndefined();
});
```