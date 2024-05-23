# Installation

::: danger
The library is still under development and hasn't been published on NPM yet. The following instructions regarding the installation via NPM or yarn do not currently work.

Use the playground or the compiled versions (see Glitch examples).
:::

## Running the playground

### Online playground (no installation)

The easiest way to get started with `coda.js` is to play around the live-coding environment. Nothing needs to be installed, you just need a **recent** browser (**Chrome** or **Firefox** are recommended). A hosted version of the playground is available online: <a href="https://playcoda.netlify.app" target="_blank">https://playcoda.netlify.app</a>

::: warning
Note that the hosted version has limitations regarding the use of movement sensors, that usually require that you run the environment on your own computer.
:::

### Installing and running the playground locally

The Coda playground requires [Node.js](https://nodejs.org/en/) v10 or later.

Download the playground [here](#)

::: danger
Put the compiled playground online and write setup instructions
:::

## Installing the full library (Direct Download / CDN)

A compiled version of the full library is available at: [https://codajs.netlify.app/coda.min.js](https://codajs.netlify.app/coda.min.js).

The following snippet gives the minimal HTML code necessary to run an application with coda.

A more complete example is available on Glitch.com: [https://glitch.com/~coda-starter](https://glitch.com/~coda-starter).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Coda Starter</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="lib/coda.min.js"></script>
  </head>
  <body>
    <h1>Coda Starter</h1>
    <p>Move the mouse</p>
    <script>
      const paragraph = document.querySelector("p");
      const m = coda.mousemove(document).tap(coords => {
        paragraph.innerText = `Mouse coordinates: [${coords}]`;
      });
      coda.runEffects(m, coda.newDefaultScheduler());
    </script>
  </body>
</html>
```

## Installing the full library (yarn/npm)

```bash
npm install @coda/all --save
# OR
yarn add @coda/all
```

Example:

```js
import * as coda from "@coda/all";

console.log(coda);

const stream = coda
  .periodic(100)
  .rand()
  .plot();
coda.runEffects(stream, coda.newDefaultScheduler());
```

## Modular installation

### Installing the core library

```bash
npm install @coda/core --save
# OR
yarn add @coda/core
```

This allows to import individual operators from the library, for example:

```js
import { periodic, rand, tap } from "@coda/core";
```

It is also possible to import the entire library:

```js
import * as coda from "@coda/core";
```

The two following snippets are equivalent and will create a stream that generates a random number every second and log it to the console:

```js
import {
  periodic,
  rand,
  tap,
  runEffects,
  newDefaultScheduler
} from "@coda/core";

const stream = tap(console.log, rand({}, periodic(1000)).rand());
runEffects(stream, newDefaultScheduler());
```

```js
import * as coda from "@coda/core";

const stream = coda
  .periodic(1000)
  .rand()
  .tap(console.log);
coda.runEffects(stream, coda.newDefaultScheduler());
```

### Using additional packages

Additional packages can provide new operators or functionalities to the live-coding environment. Their name are of the form `@coda/<package-name>`. Some packages (TODO: make a list of uniformize behavior) extend the Stream class to bind new methods to every stream with a fluent API.

The following script presents an example of using the UI package to plot some random data:

```js
import * as coda from "@coda/core";
import * as codaUi from "@coda/ui";

coda.Stream.use(codaUi, "app");

const stream = coda
  .periodic(100)
  .rand()
  .plot();

coda.runEffects(stream, coda.newDefaultScheduler());
```
