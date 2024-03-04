1. How will you call your POST request in Angular2?
2. HTTP request in Angular2
3. What are the parameters to be pass to Angular POST request?

4. What is HTTP Client ? HTTP Client vs HTTP
   HttpModule is deprecated..

5. How do you handle exception in http?

# HttpClient

Modern browsers support two different APIs for making HTTP requests: the XMLHttpRequest interface and the fetch() API.

The HttpClient in @angular/common/http offers a simplified client HTTP API for Angular applications that rests on the XMLHttpRequest interface exposed by browsers. Additional benefits of HttpClient include testability features, typed request and response objects, request and response interception, Observable apis, and streamlined error handling.

eg.

```typescript
// basic get call
getConfig() {
  // now returns an Observable of Config
  return this.http.get<Config>(this.configUrl);
}
```

```typescript
// Reading the full response
getConfigResponse(): Observable<HttpResponse<Config>> {
  return this.http.get<Config>(
    this.configUrl, { observe: 'response' });
}

// reading response in comp
showConfigResponse() {
  this.configService.getConfigResponse()
    // resp is of type `HttpResponse<Config>`
    .subscribe(resp => {
      // display its headers
      const keys = resp.headers.keys();
      this.headers = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);

      // access the body directly, which is typed as `Config`.
      this.config = { ... resp.body };
    });
}
```

Requesting non-JSON data

```typescript
getTextFile(filename: string) {
  // The Observable returned by get() is of type Observable<string>
  // because a text response was specified.
  // There's no need to pass a <string> type parameter to get().
  return this.http.get(filename, {responseType: 'text'})
    .pipe(
      tap( // Log the result or error
        data => this.log(filename, data),
        error => this.logError(filename, error)
      )
    );
}
```

Error Handling in component

```typescript
showConfig() {
  this.configService.getConfig()
    .subscribe(
      (data: Config) => this.config = { ...data }, // success path
      error => this.error = error // error path
    );
}
```

Common Error handling in service

```typescript
getConfig() {
  return this.http.get<Config>(this.configUrl)
    .pipe(
      catchError(this.handleError)
    );
}

private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};
```

Retrying

```typescript
getConfig() {
  return this.http.get<Config>(this.configUrl)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
}
```

Adding and updating Headers

```typescript
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
    })
};

// at later time or in interceptors
httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');

// making http post request
/** POST: add a new hero to the database */
addHero (hero: Hero): Observable<Hero> {
  return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
    .pipe(
      catchError(this.handleError('addHero', hero))
    );
}
```

Debouncing requests

```html
<!-- package-search.component.html -->
<input (keyup)="search($event.target.value)" id="name" placeholder="Search" />

<ul>
    <li *ngFor="let package of packages$ | async">
        <b>{{package.name}} v.{{package.version}}</b> -
        <i>{{package.description}}</i>
    </li>
</ul>
```

```typescript
// package-search.component.ts
withRefresh = false;
packages$: Observable<NpmPackageInfo[]>;
private searchText$ = new Subject<string>();

search(packageName: string) {
  this.searchText$.next(packageName);
}

ngOnInit() {
  this.packages$ = this.searchText$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(packageName =>
      this.searchService.search(packageName, this.withRefresh))
  );
}

constructor(private searchService: PackageSearchService) { }
```

## Http Interceptors

### Auth Interceptor (request)

```typescript
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth token from the service.
        const authToken = this.auth.getAuthorizationToken();

        /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
        // Clone the request and set the new header in one step.
        const authReq = req.clone({ setHeaders: { Authorization: authToken } });

        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}
```

### Logging Interceptor (response)

```typescript
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

import { finalize, tap } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    constructor(private messenger: MessageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();
        let ok: string;

        // extend server response observable with logging
        return next.handle(req).pipe(
            tap(
                // Succeeds when there is a response; ignore other events
                (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
                // Operation failed; error is an HttpErrorResponse
                (error) => (ok = 'failed')
            ),
            // Log when response observable either completes or errors
            finalize(() => {
                const elapsed = Date.now() - started;
                const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
                this.messenger.add(msg);
            })
        );
    }
}
```

## Testing Http client

```typescript
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('HttpClient testing', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });

        // Inject the http service and test controller for each test
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    /// Tests begin ///

    it('can test HttpClient.get', () => {
        const testData: Data = { name: 'Test Data' };

        // Make an HTTP GET request
        httpClient.get<Data>(testUrl).subscribe((data) =>
            // When observable resolves, result should match test data
            expect(data).toEqual(testData)
        );

        // The following `expectOne()` will match the request's URL.
        // If no requests or multiple requests matched that URL
        // `expectOne()` would throw.
        const req = httpTestingController.expectOne('/data');

        // Assert that the request is a GET.
        expect(req.request.method).toEqual('GET');

        // Respond with mock data, causing Observable to resolve.
        // Subscribe callback asserts that correct data was returned.
        req.flush(testData);

        // Finally, assert that there are no outstanding requests.
        httpTestingController.verify();
    });

    // Testing for errors
    it('can test for 404 error', () => {
        const emsg = 'deliberate 404 error';

        httpClient.get<Data[]>(testUrl).subscribe(
            (data) => fail('should have failed with the 404 error'),
            (error: HttpErrorResponse) => {
                expect(error.status).toEqual(404, 'status');
                expect(error.error).toEqual(emsg, 'message');
            }
        );

        const req = httpTestingController.expectOne(testUrl);

        // Respond with mock error
        req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });
});
```
