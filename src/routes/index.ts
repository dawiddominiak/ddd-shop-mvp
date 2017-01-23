"use strict";
import * as express from "express";
import * as passport from "passport";
import { Cart } from "../domain/entity/Cart";
import { ICartRepository } from "../domain/entity/ICartRepository";
import { IProductRepository } from "../domain/entity/IProductRepository";
import { IUserRepository } from "../domain/entity/IUserRepository";
import { Product } from "../domain/entity/Product";
import { User } from "../domain/entity/User";
import { TYPES } from "../module/types";
import { shopContainer } from "./../module/shopContainer";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  const productRepository = shopContainer.get<IProductRepository>(TYPES.IProductRepository);

  productRepository
    .list()
    .tap((products) => {
      console.log('user', req.user);
      res.render("index", {
        user: req.user,
        products,
      });
    })
    .catch(next)
    .done()
  ;
});

router.get("/register", filterLoggedIn, (req, res, next) => {
  res.render("register");
});

router.post("/register", filterLoggedIn, (req, res, next) => {
  const userRepository = shopContainer.get<IUserRepository>(TYPES.IUserRepository);
  const userId = userRepository.getNextId();
  const user = new User(userId, req.body.email);

  userRepository
    .add(user, req.body.password)
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      res.render("register");
    })
    .done()
  ;
});

router.get("/login", filterLoggedIn, (req, res, next) => {
  res.render("login");
});

router.post("/login", filterLoggedIn, passport.authenticate("local", {
  successRedirect: "/",
  // tslint:disable-next-line:object-literal-sort-keys
  failureRedirect: "/login",
}));

router.patch("/products/:productId/buy", filterNotLoggedIn, (req, res, next) => {
  const productRepository = shopContainer.get<IProductRepository>(TYPES.IProductRepository);
  const cartRepository = shopContainer.get<ICartRepository>(TYPES.ICartRepository);

  productRepository
    .getById(req.param("productId"))
    .tap((product: Product) => {
      const cart = new Cart(cartRepository.getNextId(), req.user);
      cart.addProduct(product);
    })
    .catch(next)
    .done()
  ;
});

function filterNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect();
  }
}

function filterLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
}

export default router;
