"use strict";

import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as favicon from "serve-favicon";
import index from "./routes/index";

const app: express.Express = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname,"public","favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  // tslint:disable-next-line:no-string-literal
  err["status"] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === "development") {
  app.use((err: Error, req, res, next) => {
    // tslint:disable-next-line:no-string-literal
    res.status(err["status"] || 500);
    res.render("error", {
      error: err,
      message: err.message,
      title: "error",
    });
  });
}

// production error handler
//  no stacktrace leaked to user
app.use((err: Error, req, res, next) => {
  // tslint:disable-next-line:no-string-literal
  res.status(err["status"] || 500);
  res.render("error", {
    error: {},
    message: err.message,
    title: "error",
  });
});

export default app;
