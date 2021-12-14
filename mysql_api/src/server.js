"use strict";
const app = require("./app");
const port = 8080;

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught exception: 
    name: ${err?.name} message: ${err?.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled promise rejection: 
    name: ${err?.name} message: ${err?.message}`);
  server.close(() => {
    process.exit(1);
  });
});
