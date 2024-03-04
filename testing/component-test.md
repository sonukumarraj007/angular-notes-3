```typescript
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { DebugElement } from '@angular/core';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const nativeEl: HTMLElement = fixture.nativeElement;
    const debugEl: DebugElement = fixture.debugElement;
    // debugEl.q
  });
});

```

### ComponentFixture
The ComponentFixture is a test harness for interacting with the created component and its corresponding element.
```typescript
const component = fixture.componentInstance;
expect(component).toBeDefined();
```

### nativeElement
The value of ComponentFixture.nativeElement has the any type. Later you'll encounter the DebugElement.nativeElement and it too has the any type.

Angular can't know at compile time what kind of HTML element the nativeElement is or if it even is an HTML element. The app might be running on a non-browser platform, such as the server or a Web Worker, where the element may have a diminished API or not exist at all.

The tests in this guide are designed to run in a browser so a nativeElement value will always be an HTMLElement or one of its derived classes.

Knowing that it is an HTMLElement of some sort, you can use the standard HTML querySelector to dive deeper into the element tree.

Here's another test that calls HTMLElement.querySelector to get the paragraph element and look for the banner text:
```typescript
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector('p');
  expect(p.textContent).toEqual('banner works!');
});
```

### DebugElement
The Angular fixture provides the component's element directly through the fixture.nativeElement.

```typescript
const bannerElement: HTMLElement = fixture.nativeElement;
// This is actually a convenience method, implemented as fixture.debugElement.nativeElement.
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```
### By.css()

The DebugElement offers query methods that work for all supported platforms. These query methods take a predicate function that returns true when a node in the DebugElement tree matches the selection criteria.

You create a predicate with the help of a By class imported from a library for the runtime platform. Here's the By import for the browser platform:

```typescript
import { By } from '@angular/platform-browser';
// The following example re-implements the previous test with DebugElement.query() and the browser's By.css method.
it('should find the <p> with fixture.debugElement.query(By.css)', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css('p'));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toEqual('banner works!');
});
```

Some noteworthy observations:

The By.css() static method selects DebugElement nodes with a standard CSS selector.
The query returns a DebugElement for the paragraph.
You must unwrap that result to get the paragraph element.

When you're filtering by CSS selector and only testing properties of a browser's native element, the By.css approach may be overkill.

**It's often easier and more clear to filter with a standard HTMLElement method such as querySelector() or querySelectorAll(), as you'll see in the next set of tests.**

### detectChanges()
You must tell the TestBed to perform data binding by calling fixture.detectChanges(). Only then does the \<h1> have the expected title.

```typescript
it('should display a different test title', () => {
  component.title = 'Test Title';
  fixture.detectChanges();
  expect(h1.textContent).toContain('Test Title');
});
```

### Change an input value with dispatchEvent()
To simulate user input, you can find the input element and set its value property.

You will call fixture.detectChanges() to trigger Angular's change detection. But there is an essential, intermediate step.

Angular doesn't know that you set the input element's value property. It won't read that property until you raise the element's input event by calling dispatchEvent(). Then you call detectChanges().

The following example demonstrates the proper sequence.

```typescript
it('should convert hero name to Title Case', () => {
  // get the name's input and display elements from the DOM
  const hostElement = fixture.nativeElement;
  const nameInput: HTMLInputElement = hostElement.querySelector('input');
  const nameDisplay: HTMLElement = hostElement.querySelector('span');

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // dispatch a DOM event so that Angular learns of input value change.
  // use newEvent utility function (not provided by Angular) for better browser compatibility
  nameInput.dispatchEvent(newEvent('input'));

  // Tell Angular to update the display binding through the title pipe
  fixture.detectChanges();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Component with a dependency

```typescript
let userServiceStub: Partial<UserService>;

beforeEach(() => {
  // stub UserService for test purposes
  userServiceStub = {
    isLoggedIn: true,
    user: { name: 'Test User'}
  };

  TestBed.configureTestingModule({
     declarations: [ WelcomeComponent ],
     providers:    [ {provide: UserService, useValue: userServiceStub } ]
  });

  fixture = TestBed.createComponent(WelcomeComponent);
  comp    = fixture.componentInstance;

  // UserService from the root injector
  userService = TestBed.get(UserService);

  //  get the "welcome" element by CSS selector (e.g., by class name)
  el = fixture.nativeElement.querySelector('.welcome');
});

it('should welcome the user', () => {
  fixture.detectChanges();
  const content = el.textContent;
  expect(content).toContain('Welcome', '"Welcome ..."');
  expect(content).toContain('Test User', 'expected name');
});

it('should welcome "Bubba"', () => {
  userService.user.name = 'Bubba'; // welcome message hasn't been shown yet
  fixture.detectChanges();
  expect(el.textContent).toContain('Bubba');
});

it('should request login if not logged in', () => {
  userService.isLoggedIn = false; // welcome message hasn't been shown yet
  fixture.detectChanges();
  const content = el.textContent;
  expect(content).not.toContain('Welcome', 'not welcomed');
  expect(content).toMatch(/log in/i, '"log in"');
});
```

> The second parameter to the Jasmine matcher (e.g., 'expected name') is an optional failure label. If the expectation fails, Jasmine appends this label to the expectation failure message. In a spec with multiple expectations, it can help clarify what went wrong and which expectation failed.

## Async test with fakeAsync()
The following test confirms the expected behavior when the service returns an ErrorObservable.
```typescript
it('should display error when TwainService fails', fakeAsync(() => {
  // tell spy to return an error observable
  getQuoteSpy.and.returnValue(
    throwError('TwainService test failure'));

  fixture.detectChanges(); // onInit()
  // sync spy errors immediately after init

  tick(); // flush the component's setTimeout()

  fixture.detectChanges(); // update errorMessage within setTimeout()

  expect(errorMessage()).toMatch(/test failure/, 'should display error');
  expect(quoteEl.textContent).toBe('...', 'should show placeholder');
}));

// Note that the it() function receives an argument of the following form.
fakeAsync(() => { /* test body */ })`
```
The fakeAsync() function enables a linear coding style by running the test body in a special fakeAsync test zone. The test body appears to be synchronous. There is no nested syntax (like a Promise.then()) to disrupt the flow of control.

## The tick() function

You do have to call tick() to advance the (virtual) clock.

Calling tick() simulates the passage of time until all pending asynchronous activities finish. In this case, it waits for the error handler's setTimeout().

The tick() function accepts milliseconds as a parameter (defaults to 0 if not provided). The parameter represents how much the virtual clock advances. For example, if you have a setTimeout(fn, 100) in a fakeAsync() test, you need to use tick(100) to trigger the fn callback.

```typescript
it('should run timeout callback with delay after call tick with millis', fakeAsync(() => {
    let called = false;
    setTimeout(() => { called = true; }, 100);
    tick(100);
    expect(called).toBe(true);
  }));
```
> The tick() function is one of the Angular testing utilities that you import with TestBed. It's a companion to fakeAsync() and you can only call it within a fakeAsync() body.

## Routing component
Providing a router spy for this component test suite happens to be as easy as providing a HeroService spy.
```typescript
const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes']);

TestBed.configureTestingModule({
  providers: [
    { provide: HeroService, useValue: heroServiceSpy },
    { provide: Router,      useValue: routerSpy }
  ]
})
// The following test clicks the displayed hero and confirms that Router.navigateByUrl is called with the expected url.
it('should tell ROUTER to navigate when hero clicked', () => {

  heroClick(); // trigger click on first inner <div class="hero">

  // args passed to router.navigateByUrl() spy
  const spy = router.navigateByUrl as jasmine.Spy;
  const navArgs = spy.calls.first().args[0];

  // expecting to navigate to id of the component's first hero
  const id = comp.heroes[0].id;
  expect(navArgs).toBe('/heroes/' + id,
    'should nav to HeroDetail for first hero');
});
```
