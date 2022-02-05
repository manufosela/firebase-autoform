# firebase-autoform

Generador automático de un formulario para insertar o editar elementos en Firebase a partir de la estructura del json del primero de ellos indicado por un path

## Demo

```
<h2>Basic firebase-autoform Demo</h2>
<h3>Demo</h3>
<firebase-autoform></firebase-autoform>

```
<!---
```
<custom-element-demo>
  <template>
    <link rel="import" href="firebase-autoform.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

```html
<!-- EDICIÓN -->
<firebase-autoform path="/peliculas" el-id="5"></firebase-autoform>

<!-- INSERCIÓN DE NUEVOS ELEMENTOS-->
<firebase-autoform path="/peliculas"></firebase-autoform>
```

## Dependencies
Is mandatory has login token from firebase.
You can use [firebase-loginbutton](https://github.com/manufosela/firebase-loginbutton) component to do it.

Yo can use [firebase-autolist](https://github.com/manufosela/firebase-autolist) to show the list of elements to access o edit them.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

## Build
```
$ npm run build
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## Author
**user**

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details

## Generated

**generator-lit-element-base** - *yeoman npm package* - by [@manufosela](https://github.com/manufosela/generator-litelement-webcomponent)
