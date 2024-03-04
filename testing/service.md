## Testing services

The TestBed is the most important of the Angular testing utilities. The TestBed creates a dynamically-constructed Angular test module that emulates an Angular @NgModule.

The TestBed.configureTestingModule() method takes a metadata object that can have most of the properties of an @NgModule.

To test a service, you set the providers metadata property with an array of the services that you'll test or mock.

> Note: We used to have TestBed.get() instead of TestBed.inject(). The get method wasn't type safe, it always returned any, and this is error prone. We decided to migrate to a new function instead of updating the existing one given the large scale use that would have an immense amount of breaking changes.

```typescript
let service: ValueService;

beforeEach(() => {
  TestBed.configureTestingModule({ providers: [ValueService] });
});

it('should use ValueService', () => {
  service = TestBed.inject(ValueService);
  expect(service.getValue()).toBe('real value');
});
```

### with dependancies
When testing a service with a dependency, provide the mock in the providers array.

In the following example, the mock is a spy object.

```typescript
let masterService: MasterService;
let valueServiceSpy: jasmine.SpyObj<ValueService>;

beforeEach(() => {
  const spy = jasmine.createSpyObj('ValueService', ['getValue']);

  TestBed.configureTestingModule({
    // Provide both the service-to-test and its (spy) dependency
    providers: [
      MasterService,
      { provide: ValueService, useValue: spy }
    ]
  });
  // Inject both the service-to-test and its (spy) dependency
  masterService = TestBed.inject(MasterService);
  valueServiceSpy = TestBed.inject(ValueService);
});

it('#getValue should return stubbed value from a spy', () => {
  const stubValue = 'stub value';
  valueServiceSpy.getValue.and.returnValue(stubValue);

  expect(masterService.getValue())
    .toBe(stubValue, 'service returned stub value');
  expect(valueServiceSpy.getValue.calls.count())
    .toBe(1, 'spy method was called once');
  expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
    .toBe(stubValue);
});
```

### Give type to spy to better code completion

#### Testing HTTP services

Data services that make HTTP calls to remote servers typically inject and delegate to the Angular HttpClient service for XHR calls.

You can test a data service with an injected HttpClient spy as you would test any service with a dependency.

``` typescript
let httpClientSpy: { get: jasmine.Spy };
let heroService: HeroService;

beforeEach(() => {
  // TODO: spy on other methods too
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  heroService = new HeroService(<any> httpClientSpy);
});

it('should return expected heroes (HttpClient called once)', () => {
  const expectedHeroes: Hero[] =
    [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

  httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

  heroService.getHeroes().subscribe(
    heroes => expect(heroes).toEqual(expectedHeroes, 'expected heroes'),
    fail
  );
  expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
});

it('should return an error when the server returns a 404', () => {
  const errorResponse = new HttpErrorResponse({
    error: 'test 404 error',
    status: 404, statusText: 'Not Found'
  });

  httpClientSpy.get.and.returnValue(asyncError(errorResponse));

  heroService.getHeroes().subscribe(
    heroes => fail('expected an error, not heroes'),
    error  => expect(error.message).toContain('test 404 error')
  );
});
```
