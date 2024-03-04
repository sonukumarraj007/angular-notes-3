
# hierarchical- injector


https://angular.io/guide/hierarchical-dependency-injection#self

https://medium.com/frontend-coach/self-or-optional-host-the-visual-guide-to-angular-di-decorators-73fbbb5c8658


@Host() decorator makes Angular to look for the injector on the component itself, so in that regard it may look similar to the @Self() decorator (7.). But that’s actually not the end: if the injector is not found there, it looks for the injector up to its host component.

Wait, what?
There are two common scenarios where said host component is something different than our current class.

We’ve been looking at a Component as our example, but we may just as well have a Directive here instead. In that case it can be used on a Component that defines its injector and that component would be the directive’s host.

Or we can have our KidComponent projected into ParentComponent(by that <ng-content></ng-content> thingy). Then we also say that our component is being hosted by ParentComponent — and if ParentComponent provides ToyService and KidComponent does not, the @Host() decorator of that inner component would still get that service’s instance (8.)