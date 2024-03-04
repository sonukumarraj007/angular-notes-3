# Routing

## Lazy loading in angular 7 and below

``` typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'lazymodule', loadChildren: './lazymodule/lazymodule.module#LazyModuleModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Lazy loading in angular 8
``` typescript
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
},
```
