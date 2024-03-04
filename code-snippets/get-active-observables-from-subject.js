getActiveObservablesFromSubject = function(subject) {
    const observers = subject.observers;
    for (let index = 0; index < observers.length; index++) {
        const observer = observers[index];
        console.log(observer.destination._next);
    }
}
