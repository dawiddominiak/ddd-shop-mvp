"use strict";
import * as Promise from "bluebird";
import * as bodyParser from "body-parser";
import * as connectSessionSequelize from "connect-session-sequelize";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as session from "express-session";
import * as logger from "morgan";
import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as path from "path";
import * as sequelize from "sequelize";
import * as favicon from "serve-favicon";
import { IUserRepository } from "./domain/entity/IUserRepository";
import { User } from "./domain/entity/User";
import { fixtures } from "./fixtures/fixtures";
import { Persistance } from "./module/Persistance";
import { shopContainer } from "./module/shopContainer";
import { TYPES } from "./module/types";
import index from "./routes/index";

const app: express.Express = express();
const SequelizeStore = connectSessionSequelize(session.Store);
const LocalStrategy = passportLocal.Strategy;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname,"public","favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// TODO: CSRF protection
app.use(session({
  secret: process.env.APPLICATION_SECRET || "default secret",
  store: new SequelizeStore({
    db: shopContainer.get<sequelize.Sequelize>(TYPES.Sequelize),
  }),
}));

passport.serializeUser((user: User, done) => {
  Promise.resolve(user.getUuid()).asCallback(done);
});

passport.deserializeUser((id: string, done) => {
  const userReposiotry = shopContainer.get<IUserRepository>(TYPES.IUserRepository);

  userReposiotry
    .getById(id)
    .asCallback(done)
  ;
});

passport.use(new LocalStrategy({
  usernameField: "email",
}, (email, password, done) => {
  const userReposiotry = shopContainer.get<IUserRepository>(TYPES.IUserRepository);
  userReposiotry
    .login(email, password)
    .asCallback(done)
  ;
}));

app.use(passport.initialize());
app.use(passport.session());

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

  // create database schema
  const persistance = shopContainer.get<Persistance>(TYPES.Persistance);
  persistance
    .sync(true, console.log)
    .then(fixtures)
    .done()
  ;
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
