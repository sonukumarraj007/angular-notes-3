  https://blog.nrwl.io/understanding-angular-ivy-incremental-dom-and-virtual-dom-243be844bf36


  How Virtual DOM Works
React was the first mainstream framework to use virtual DOM, which is defined by this key idea:
Every component creates a new virtual DOM tree every time it gets rerendered. React compares the new virtual DOM tree with the old one and then applies a series of transformations to the browser DOM to match the new virtual DOM tree.

Virtual DOM has two main advantages:
We can use any programming language to implement the component’s render function, so we don’t need to compile anything. React developers mainly uses JSX, but we can use plain JavaScript as well.
We get a value as a result of rendering component. It can be used for testing, debugging, etc..

Incremental DOM
Incremental DOM is used internally at Google, and it is defined by this key idea:
Every component gets compiled into a series of instructions. These instructions create DOM trees and update them in-place when the data changes.