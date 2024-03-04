## Useful commands 
https://angular.io/cli/generate

### Create app with specific prefix , routing, default style  
ng new my-app --prefix=my --routing --style=scss


### Create a lazy loaded module with routing and put lazy loaded route in app routing module
ng g m heroes/heroes --module=app --flat --routing --route=heroes

--flat=true|false	
When true, creates the new files at the top level of the current project.

Default: false

### Dry run --> Add -d or --dryRun
ng g c comp1 -d

### Skip tests
--skipTests=true|false	
When true, does not create "spec.ts" test files for the new class.

Default: false
