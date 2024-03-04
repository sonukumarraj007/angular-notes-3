1. What is Rxjs? How much Rxjs have you used?
2. Have you used ReactiveJS ? What is that
3. What is observable? How we can cancel observable call ?
4. Observables and Promise
5. Subject and SubjectBehavior

## RxJS

RxJS is a library for composing asynchronous and event-based programs by using observable sequences. It provides one core type, the Observable, satellite types (Observer, Schedulers, Subjects) and operators inspired by Array#extras (map, filter, reduce, every, etc) to allow handling asynchronous events as collections.

ReactiveX combines the Observer pattern with the Iterator pattern and functional programming with collections to fill the need for an ideal way of managing sequences of events.

The essential concepts in RxJS which solve async event management are:

-   Observable: represents the idea of an invokable collection of future values or events.
-   Observer: is a collection of callbacks that knows how to listen to values delivered by the Observable.
-   Subscription: represents the execution of an Observable, is primarily useful for cancelling the execution.
-   Operators: are pure functions that enable a functional programming style of dealing with collections with operations like map, filter, concat, reduce, etc.
-   Subject: is the equivalent to an EventEmitter, and the only way of multicasting a value or event to multiple Observers.
-   Schedulers: are centralized dispatchers to control concurrency, allowing us to coordinate when computation happens on e.g. setTimeout or requestAnimationFrame or others.

### Observables compared to promises

Observables are often compared to promises. Here are some key differences:

-   Observables are declarative; computation does not start until subscription. Promises execute immediately on creation. This makes observables useful for defining recipes that can be run whenever you need the result.

-   Observables provide many values. Promises provide one. This makes observables useful for getting multiple values over time.

-   Observables differentiate between chaining and subscription. Promises only have .then() clauses. This makes observables useful for creating complex transformation recipes to be used by other part of the system, without causing the work to be executed.

-   Observables subscribe() is responsible for handling errors. Promises push errors to the child promises. This makes observables useful for centralized and predictable error handling.

e.g

```typescript
import { Observable } from 'rxjs';

const observable = new Observable(observer => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    setTimeout(() => {
        observer.next(4);
        observer.complete();
        observer.next(5); // Is not delivered because it would violate the contract
    }, 1000);
});

console.log('just before subscribe');
observable.subscribe({
    next(x) {
        console.log('got value ' + x);
    },
    error(err) {
        console.error('something wrong occurred: ' + err);
    },
    complete() {
        console.log('done');
    }
});
console.log('just after subscribe');

// -- output --
// just before subscribe
// got value 1
// got value 2
// got value 3
// just after subscribe
// got value 4
// done
```

It is a good idea to wrap any code in subscribe with try/catch block that will deliver an Error notification if it catches an exception:

```typescript
import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(observer) {
    try {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
    } catch (err) {
        observer.error(err); // delivers an error if it caught one
    }
});
```

Unsubscribe
With subscription.unsubscribe() you can cancel the ongoing execution:

> When you subscribe, you get back a Subscription, which represents the ongoing execution. Just call unsubscribe() to cancel the execution.

```typescript
import { from } from 'rxjs';

const observable = from([10, 20, 30]);
const subscription = observable.subscribe(x => console.log(x));
// Later:
subscription.unsubscribe();
```

### Subjects

What is a Subject? An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers. While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.

> A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

**Every Subject is an Observable.** Given a Subject, you can subscribe to it, providing an Observer, which will start receiving values normally. From the perspective of the Observer, it cannot tell whether the Observable execution is coming from a plain unicast Observable or a Subject.

Internally to the Subject, **subscribe does not invoke a new execution that delivers values**. It simply registers the given Observer in a list of Observers, similarly to how addListener usually works in other libraries and languages.

**Every Subject is an Observer.** It is an object with the methods next(v), error(e), and complete(). To feed a new value to the Subject, just call next(theValue), and it will be multicasted to the Observers registered to listen to the Subject.

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe({
    next: v => console.log(`observerA: ${v}`)
});
subject.subscribe({
    next: v => console.log(`observerB: ${v}`)
});

subject.next(1);
subject.next(2);

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
```

### Variants of Subjects

#### BehaviorSubject

One of the variants of Subjects is the BehaviorSubject, which has a notion of "the current value". It stores the latest value emitted to its consumers, and whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.

In the following example, the BehaviorSubject is initialized with the value 0 which the first Observer receives when it subscribes. The second Observer receives the value 2 even though it subscribed after the value 2 was sent.

```typescript
import { BehaviorSubject } from 'rxjs';
const subject = new BehaviorSubject(0); // 0 is the initial value

subject.subscribe({
    next: v => console.log(`observerA: ${v}`)
});

subject.next(1);
subject.next(2);

subject.subscribe({
    next: v => console.log(`observerB: ${v}`)
});

subject.next(3);

// Logs
// observerA: 0
// observerA: 1
// observerA: 2
// observerB: 2
// observerA: 3
// observerB: 3
```

#### ReplaySubject

A ReplaySubject is similar to a BehaviorSubject in that it can send old values to new subscribers, but it can also record a part of the Observable execution.

> A ReplaySubject records multiple values from the Observable execution and replays them to new subscribers.

When creating a ReplaySubject, you can specify how many values to replay:

```typescript
import { ReplaySubject } from 'rxjs';
const subject = new ReplaySubject(3); // buffer 3 values for new subscribers

subject.subscribe({
    next: v => console.log(`observerA: ${v}`)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
    next: v => console.log(`observerB: ${v}`)
});

subject.next(5);

// Logs:
// observerA: 1
// observerA: 2
// observerA: 3
// observerA: 4
// observerB: 2
// observerB: 3
// observerB: 4
// observerA: 5
// observerB: 5
```

#### AsyncSubject

The AsyncSubject is a variant where only the last value of the Observable execution is sent to its observers, and only when the execution completes.

```typescript
import { AsyncSubject } from 'rxjs';
const subject = new AsyncSubject();

subject.subscribe({
    next: v => console.log(`observerA: ${v}`)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
    next: v => console.log(`observerB: ${v}`)
});

subject.next(5);
subject.complete();

// Logs:
// observerA: 5
// observerB: 5
```

The AsyncSubject is similar to the last() operator, in that it waits for the complete notification in order to deliver a single value.

### Observable to promise

RxJs operator ‘toPromise’ waits for your observable to complete!

It turns out that the observable operator toPromise waits for the observable to complete (or error) before actually resolving itself!

Turning an observable into a promise i.e. turning a stream into a value — you need to wait for the last one. But it might never complete, you say. Ah, and you are indeed right. Then your promise will never get resolved — just be pending.

```typescript
const source = from([1, 2, 3]);

source.subscribe(
    x => console.log('observable', x),
    null,
    () => console.info('completed')
);
// observable 1
// observable 2
// observable 3
// completed
source.toPromise().then(x => console.log('toPromise', x));
// toPromise 3
```

## Rxjs Operators

### forkJoin

#### Use forkJoin with a dictionary of observable inputs

```typescript
import { forkJoin, of, timer } from 'rxjs';

const observable = forkJoin({
    foo: of(1, 2, 3, 4),
    bar: Promise.resolve(8),
    baz: timer(4000)
});
observable.subscribe({
    next: value => console.log(value),
    complete: () => console.log('This is how it ends!')
});

// Logs:
// { foo: 4, bar: 8, baz: 0 } after 4 seconds
// "This is how it ends!" immediately after
```

#### Use forkJoin with an array of observable inputs

```typescript
import { forkJoin, of, timer } from 'rxjs';

const observable = forkJoin([timer(4000), of(1, 2, 3, 4), Promise.resolve(8)]);
observable.subscribe({
    next: value => console.log(value),
    complete: () => console.log('This is how it ends!')
});

// Logs:
// [0, 4, 8] after 4 seconds
// "This is how it ends!" immediately after
```
