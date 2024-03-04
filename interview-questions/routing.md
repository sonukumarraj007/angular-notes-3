# Routing

Routing is navigating from one page(component) to another.

## 1. Lazy loading

How do you combat this problem? With asynchronous routing, which loads feature modules lazily, on request. Lazy loading has multiple benefits.

You can load feature areas only when requested by the user.
You can speed up load time for users that only visit certain areas of the application.
You can continue expanding lazy loaded feature areas without increasing the size of the initial load bundle.

### Lazy loading in angular 7 and below

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'lazymodule', loadChildren: './lazymodule/lazymodule.module#LazyModuleModule' },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Lazy loading in angular 8

```typescript
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
},
```

## 2. Route guards

At the moment, any user can navigate anywhere in the application anytime. That's not always the right thing to do.

Perhaps the user is not authorized to navigate to the target component.
Maybe the user must login (authenticate) first.
Maybe you should fetch some data before you display the target component.
You might want to save pending changes before leaving a component.
You might ask the user if it's OK to discard pending changes rather than save them.
You add guards to the route configuration to handle these scenarios.

A guard's return value controls the router's behavior:

If it returns true, the navigation process continues.
If it returns false, the navigation process stops and the user stays put.
If it returns a UrlTree, the current navigation cancels and a new navigation is initiated to the UrlTree returned.

Here are the 4 types of routing guards available:

1. **CanActivate**: Controls if a route can be activated.
2. **CanActivateChild**: Controls if children of a route can be activated.
3. **CanLoad**: Controls if a route can even be loaded. This becomes useful for feature modules that are lazy loaded. They won’t even load if the guard returns false.
4. **CanDeactivate**: Controls if the user can leave a route. Note that this guard doesn’t prevent the user from closing the browser tab or navigating to a different address. It only prevents actions from within the application itself.
5. **Resolve** is used to fetch dynamic data before navigating.

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        let url = `/${route.path}`;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.authService.isLoggedIn) {
            return true;
        }

        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;

        // Create a dummy session id
        let sessionId = 123456789;

        // Set our navigation extras object
        // that contains our global query params and fragment
        let navigationExtras: NavigationExtras = {
            queryParams: { session_id: sessionId },
            fragment: 'anchor',
        };

        // Navigate to the login page with extras
        this.router.navigate(['/login'], navigationExtras);
        return false;
    }
}

// app-routing.module.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DirectiveAndPipeComponent } from './directives-and-pipes/directive-and-pipe/directive-and-pipe.component';
import { AuthGuard } from './auth.guard';
import { PathNotFoundComponent } from './path-not-found/path-not-found.component';
import { LazyLoadParentComponent } from './lazy-loading-comp/lazy-load-parent/lazy-load-parent.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'directives-and-pipes', component: DirectiveAndPipeComponent },
    { path: 'lazy-load-comp', component: LazyLoadParentComponent },
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
        canLoad: [AuthGuard],
    },
    {
        path: 'rxjs',
        loadChildren: () => import('./observables/observables.module').then((m) => m.ObservablesModule),
    },
    { path: '**', component: PathNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Can deactivate guard

```typescript
// can-deactivate-user.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserComponent } from './user/user.component';

@Injectable({
    providedIn: 'root',
})
export class CanDeactivateUserGuard implements CanDeactivate<UserComponent> {
    canDeactivate(
        component: UserComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return component.canDeactivate();
    }
}

// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { CanDeactivateUserGuard } from './users/can-deactivate-user.guard';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            { path: 'users', component: UsersComponent },
            {
                path: 'user/:id',
                component: UserComponent,
                canDeactivate: [CanDeactivateUserGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
```

## 3.Resolve Guard (Fetch data before navigating)

```typescript
// crisis-center/crisis-detail-resolver.service.ts
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { CrisisService } from './crisis.service';
import { Crisis } from './crisis';

@Injectable({
    providedIn: 'root',
})
export class CrisisDetailResolverService implements Resolve<Crisis> {
    constructor(private cs: CrisisService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> | Observable<never> {
        let id = route.paramMap.get('id');

        return this.cs.getCrisis(id).pipe(
            take(1),
            mergeMap((crisis) => {
                if (crisis) {
                    return of(crisis);
                } else {
                    // id not found
                    this.router.navigate(['/crisis-center']);
                    return EMPTY;
                }
            })
        );
    }
}

// crisis-center-routing.module.ts (resolver)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrisisCenterHomeComponent } from './crisis-center-home/crisis-center-home.component';
import { CrisisListComponent } from './crisis-list/crisis-list.component';
import { CrisisCenterComponent } from './crisis-center/crisis-center.component';
import { CrisisDetailComponent } from './crisis-detail/crisis-detail.component';

import { CanDeactivateGuard } from '../can-deactivate.guard';
import { CrisisDetailResolverService } from './crisis-detail-resolver.service';

const crisisCenterRoutes: Routes = [
    {
        path: '',
        component: CrisisCenterComponent,
        children: [
            {
                path: '',
                component: CrisisListComponent,
                children: [
                    {
                        path: ':id',
                        component: CrisisDetailComponent,
                        canDeactivate: [CanDeactivateGuard],
                        resolve: {
                            crisis: CrisisDetailResolverService,
                        },
                    },
                    {
                        path: '',
                        component: CrisisCenterHomeComponent,
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(crisisCenterRoutes)],
    exports: [RouterModule],
})
export class CrisisCenterRoutingModule {}
```

## 4. Navigation using Router Link directive.

```html
<h3>ADMIN</h3>
<nav>
    <a routerLink="./" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
    <a routerLink="./crises" routerLinkActive="active">Manage Crises</a>
    <a routerLink="./heroes" routerLinkActive="active">Manage Heroes</a>
</nav>
<router-outlet></router-outlet>
```

## 5. Navigation using Router Service

```typescript
// eg 1

// Set our navigation extras object
// that contains our global query params and fragment
let navigationExtras: NavigationExtras = {
    queryParams: { session_id: sessionId },
    fragment: 'anchor',
};

// Navigate to the login page with extras
this.router.navigate(['/login'], navigationExtras);

// eg 2
// Set our navigation extras object
// that passes on our global query params and fragment
let navigationExtras: NavigationExtras = {
    queryParamsHandling: 'preserve',
    preserveFragment: true,
};

// Redirect the user
this.router.navigate([redirectUrl], navigationExtras);

// eg 3
let crisisId = this.crisis ? this.crisis.id : null;
// Pass along the crisis id if available
// so that the CrisisListComponent can select that crisis.
// Add a totally useless `foo` parameter for kicks.
// Relative navigation back to the crises
this.router.navigate(['../', { id: crisisId, foo: 'foo' }], { relativeTo: this.route });

// eg 4
let heroId = hero ? hero.id : null;
// Pass along the hero id if available
// so that the HeroList component can select that hero.
// Include a junk 'foo' property for fun.
this.router.navigate(['/superheroes', { id: heroId, foo: 'foo' }]);
```

## 6. ActivatedRoute to extract params, query params, fragments, data

```typescript
constructor(
    private route: ActivatedRoute,
    private router: Router,
) {}

// eg 1
this.route.data
    .subscribe((data: { crisis: Crisis }) => {
        this.editName = data.crisis.name;
    t   his.crisis = data.crisis;
    });

// eg 2
// Capture the session ID if available
this.sessionId = this.route
    .queryParamMap
    .pipe(map(params => params.get('session_id') || 'None'));

// Capture the fragment if available
this.token = this.route
    .fragment
    .pipe(map(fragment => fragment || 'None'));

// eg 3
this.crises$ = this.route.paramMap.pipe(
    switchMap(params => {
        this.selectedId = +params.get('id');
        return this.service.getCrises();
    }
)
// ---
this.hero$ = this.route.paramMap.pipe(
    switchMap((params: ParamMap) =>
    this.service.getHero(params.get('id')))
);
```
