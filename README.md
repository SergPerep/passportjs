# Error handler for API built with express

## Throw errors
### Inside sync route handler

> Just throw error without catching it

```javascript
app.get("/", (req, res) => {
    // console.error("some error!");
    // res.send({ message: "some error!"});
    throw new Error("some error!"); // for developer and user
    // interrupts
    res.send("Hello World"); // will never see that
});
```

If you throw `Error` inside sync route handler, express will catch it automatically, meaning it will:

- stop execution of a current function
- display `Error` in console for developer
- send `Error` to the user as html

### Inside middleware

Feed `Error` to `next()`. That way default error handler will catch it later.

```javascript
const middleware(req, res, next) => {
    next(new Error("Error message"));
    // interrupts
    res.send("Hello World"); // will never see that
}
```

Throw error with this method and it will:

- interrupt a function
- display `Error` in console for developer
- send `Error` to user as html

### Inside async
With async you have to always `try-catch`. To send error to default error handler, feed it to `next()` in `catch`.

Note that you don’t have to specify next as one of the arguments.

```javascript
app.get("/", async(req, res) => {
    try {
        // something with await
    } catch (err) {
        next(err)
    }
})
```

## Mount error handler

Mount error handler after all routes, so that it could catch errors after they being thrown.

```javascript
app.get("/", (req, res) => ...);
app.post("/", (req, res) => ...);
app.delete("/:id", (req, res) => ...);

app.use(handleErrors);
```
