## takeUntil(notifier)

This operator emits values emitted by the source Observable until a notifier Observable emits a value.

```ts

@Component({...})
export class AppComponent implements OnInit, OnDestroy {
    notifier = new Subject()
    ngOnInit () {
        var observable$ = Rx.Observable.interval(1000);
        observable$.pipe(takeUntil(this.notifier))
        .subscribe(x => console.log(x));
    }
    ngOnDestroy() {
        this.notifier.next()
        this.notifier.complete()
    }
}

```

We have an extra notifier Subject, this is what will emit to make the this.subscription unsubscribe. 
See, we pipe the observable to takeUntil before we subscribe. 
The takeUntil will emit the values emitted by the interval until the notifier Subject emits, it will then unsubscribe the observable$. 
The best place to make the notifier to emit so the observable$ is canceled is in the ngOnDestroy hook.
