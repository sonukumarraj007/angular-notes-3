https://immerjs.github.io/immer/docs/introduction

Immer (German for: always) is a tiny package that allows you to work with immutable state in a more convenient way. It is based on the copy-on-write mechanism.

The basic idea is that you will apply all your changes to a temporary draftState, which is a proxy of the currentState. Once all your mutations are completed, Immer will produce the nextState based on the mutations to the draft state. This means that you can interact with your data by simply modifying it while keeping all the benefits of immutable data.

immer-hd.png

Using Immer is like having a personal assistant; he takes a letter (the current state) and gives you a copy (draft) to jot changes onto. Once you are done, the assistant will take your draft and produce the real immutable, final letter for you (the next state).

Quick Example
```js
import produce from "immer"

const baseState = [
    {
        todo: "Learn typescript",
        done: true
    },
    {
        todo: "Try immer",
        done: false
    }
]

const nextState = produce(baseState, draftState => {
    draftState.push({todo: "Tweet about it"})
    draftState[1].done = true
})

```
The interesting thing about Immer is that the baseState will be untouched, but the nextState will be a new immutable tree that reflects all changes made to draftState (and structurally sharing the things that weren't changed).


Benefits
- Immutability with normal JavaScript objects, arrays, Sets and Maps. No new APIs to learn!
- Strongly typed, no string based paths selectors etc.
- Structural sharing out of the box
- Object freezing out of the box
- Deep updates are a breeze
- Boilerplate reduction. Less noise, more concise code.
- First class support for patches
- Small: 3KB gzipped
