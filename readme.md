# hexnut-router

`hexnut-router` is a <a href="https://github.com/francisrstokes/hexnut">hexnut</a> middleware for processing connections and messages established on a particular connection route.

## Installing

```bash
npm i hexnut-router
```

## Usage

`hexnut-router` works in mostly the same way to routers you may be familiar with in express or koa.

### Handling middleware on a particular route

Using the `route` function, you can construct middleware that only run on particular routes, and are able to extract parameters from the defined path.

```javascript
const {route} = require('hexnut-router');

app.use(route('/v1/:userId', ctx => {
  ctx.send(`This is v1 of the API, and your userId = ${ctx.params.userId}`);
}));
```

### Grouping routes

Since for a web socket, you only connect *one time*, it makes sense to only define the high level routes once. For this purpose, there is a `createRoute` function. This can be a convenient mechanism for API versioning.

```javascript
const {createRoute} = require('hexnut-router');
const handle = require('hexnut-handle');

const v1 = createRoute('/v1');
const v2 = createRoute('/v2');

app.use(v1(handle.connect(ctx => {
  ctx.send('Connected to v1 of the API');
  ctx.apiVersion = 1;
}));

app.use(v1(handle.message(
  msg => msg.startsWith('blah blah')
  ctx => {
    ctx.send('Messaging on v1 of the API');
    ctx.apiVersion = 1;
  }
));

app.use(v2(handle.connect(ctx => {
  ctx.send('This is v2 of the API');
  ctx.apiVersion = 2;
})));
```
