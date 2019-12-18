# Installation

## Installing the full library (yarn/npm)

```bash
npm install @coda/all --save
# OR
yarn add @coda/all
```

::: danger
Is this broken?
:::

```js
import * as coda from '@coda/all';

console.log(coda);

const stream = coda.periodic(100).rand().plot();
coda.runEffects(stream, coda.newDefaultScheduler());
```

## Installing the full library (Direct Download / CDN)

[https://unpkg.com/@coda/all](https://unpkg.com/@marcelle/all)

The above link will always point to the latest release on NPM.

marcelle relies on a number of packages that are not included in the build.
The following codes HTML template includes all the necessary dependencies to run a marcelle application.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Marcelle Example : Mobilenet + KNN</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/vuex@3.1.1/dist/vuex.js"></script>
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <script src="https://unpkg.com/element-ui/lib/umd/locale/en.js"></script>
  <script>ELEMENT.locale(ELEMENT.lang.en);</script>
  <script src="https://cdn.jsdelivr.net/npm/pouchdb@7.1.1/dist/pouchdb.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts@3.10.0/dist/apexcharts.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2.11/dist/tf.min.js"> </script>
  <script src="https://unpkg.com/@marcelle/all"></script>
</head>
<body>
  <noscript>
    <strong>
      We're sorry but this application doesn't work properly without JavaScript enabled.
      Please enable it to continue.
    </strong>
  </noscript>
  <div class="title" style="margin-left: 20px; margin-bottom: -30px;"><h4>Marcelle Example : Mobilenet + KNN</h4></div>
  <div id="app"></div>
  <script defer src="script.js"></script>
</body>
</html>
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
import { periodic, rand, tap } from '@coda/core';
```

It is also possible to import the entire library:
```js
import * as coda from '@coda/core';
```

The two following snippets are equivalent and will create a stream that generates a random number every second and log it to the console:

```js
import { periodic, rand, tap, runEffects, newDefaultScheduler } from '@coda/core';

const stream = tap(console.log, rand({}, periodic(1000)).rand());
runEffects(stream, newDefaultScheduler());
```

```js
import * as coda from '@coda/core';

const stream = coda.periodic(1000).rand().tap(console.log);
coda.runEffects(stream, coda.newDefaultScheduler());
```

### Using additional packages

Additional packages can provide new operators or functionalities to the live-coding environment. Their name are of the form `@coda/<package-name>`. Some packages (TODO: make a list of uniformize behavior) extend the Stream class to bind new methods to every stream with a fluent API.

The following script presents an example of using the UI package to plot some random data:

```js
import * as coda from '@coda/core';
import * as codaUi from '@coda/ui';

coda.Stream.use(codaUi, 'app');

const stream = coda.periodic(100).rand().plot();

coda.runEffects(stream, coda.newDefaultScheduler());
```
