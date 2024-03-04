1.  ServerSide Events
    Developing a web application that uses server-sent events is easier than with websockets. You'll need a bit of code on the server to stream events to the front-end, but the client side code works almost identically to handling any other event.

    > Traditionally, a web page has to send a request to the server to receive new data; that is, the page requests data from the server. With server-sent events, it's possible for a server to send new data to a web page at any time, by pushing messages to the web page. These incoming messages can be treated as Events + data inside the web page.

    1.  Receiving events from the server
        The server-sent event API is contained in the EventSource interface; to open a connection to the server to begin receiving events from it, create a new EventSource object with the URL of a script that generates the events. For example:

        ```typescript
        const evtSource = new EventSource('ssedemo.php');

        evtSource.onmessage = function (event) {
            const newElement = document.createElement('li');
            const eventList = document.getElementById('list');

            newElement.innerHTML = 'message: ' + event.data;
            eventList.appendChild(newElement);
        };

        // error handling
        evtSource.onerror = function (err) {
            console.error('EventSource failed:', err);
        };

        // closing event stream
        evtSource.close();
        ```

2.  Session Management

    1. using cookies
    2. using storage api (session storage/ local storage)

3.  Alternative for Dependency Injection

    ES6 Modules

    What is a module?

    A module is just a file. One script is one module.

    Modules can load each other and use special directives export and import to interchange functionality, call functions of one module from another one:

    -   export keyword labels variables and functions that should be accessible from outside the current module.
    -   import allows the import of functionality from other modules.

    e.g.

    ```typescript
    // 📁 sayHi.js
    export function sayHi(user) {
        alert(`Hello, ${user}!`);
    }
    // …Then another file may import and use it:
    import { sayHi } from './sayHi.js';

    alert(sayHi); // function...
    sayHi('John'); // Hello, John!
    ```

    Each module has its own top-level scope. In other words, top-level variables and functions from a module are not seen in other scripts.

    **A module code is evaluated only the first time when imported**
    If the same module is imported into multiple other places, its code is executed only the first time, then exports are given to all importers.

4.  babel

    Babel is a JavaScript compiler
    Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. Here are the main things Babel can do for you:

    -   Transform syntax
    -   Polyfill features that are missing in your target environment (through @babel/polyfill)
    -   Source code transformations (codemods)
    -   And more! (check out these videos for inspiration)

    Babel is a tool that helps you write code in the latest version of JavaScript. When your supported environments don't support certain features natively, Babel will help you compile those features down to a supported version.

    Babel is a free and open-source JavaScript transcompiler that is mainly used to convert ECMAScript 2015+ (ES6+) code into a backwards compatible version of JavaScript that can be run by older JavaScript engines. Babel is a popular tool for using the newest features of the JavaScript programming language.[3]

    > A source-to-source translator, source-to-source compiler (S2S compiler), transcompiler or transpiler[1][2] is a type of translator that takes the source code of a program written in a programming language as its input and produces an equivalent source code in the same or a different programming language. A source-to-source translator converts between programming languages that operate at approximately the same level of abstraction, while a traditional compiler translates from a higher level programming language to a lower level programming language.

5.  closure compilers (like uglify js)
    The Closure Compiler is a tool for making JavaScript download and run faster. Instead of compiling from a source language to machine code, it compiles from JavaScript to better JavaScript. It parses your JavaScript, analyzes it, removes dead code and rewrites and minimizes what's left. It also checks syntax, variable references, and types, and warns about common JavaScript pitfalls.

    What are the benefits of using Closure Compiler?

    -   Efficiency. The Closure Compiler reduces the size of your JavaScript files and makes them more efficient, helping your application to load faster and reducing your bandwidth needs.

    -   Code checking. The Closure Compiler provides warnings for illegal JavaScript and warnings for potentially dangerous operations, helping you to produce JavaScript that is less buggy and easier to maintain.

    https://developers.google.com/closure/compiler

6.  XHTML

    -   XHTML stands for EXtensible HyperText Markup Language
    -   XHTML is almost identical to HTML
    -   XHTML is stricter than HTML
    -   XHTML is HTML defined as an XML application
    -   XHTML is supported by all major browsers

The Most Important Differences from HTML:

-   Document Structure

```text
- XHTML DOCTYPE is mandatory
- The xmlns attribute in <html> is mandatory
- <html>, <head>, <title>, and <body> are mandatory
```

-   XHTML Elements

```text
- XHTML elements must be properly nested
- XHTML elements must always be closed
- XHTML elements must be in lowercase
- XHTML documents must have one root element
```

-   XHTML Attributes

```text
- Attribute names must be in lower case
- Attribute values must be quoted
- Attribute minimization is forbidden
```
