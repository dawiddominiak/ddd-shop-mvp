"use strict";
import { CreditCard } from '../domain/valueObject/CreditCard';
import { ITransactionService } from '../domain/service/ITransactionService';
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

      return null;
    })
    .catch((error) => { // TODO: error inheritance, catching only one type of errors
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

router.post("/products/:productId/buy", filterNotLoggedIn, (req, res, next) => {
  const productRepository = shopContainer.get<IProductRepository>(TYPES.IProductRepository);
  const cartRepository = shopContainer.get<ICartRepository>(TYPES.ICartRepository);
  const transactionService = shopContainer.get<ITransactionService>(TYPES.ITransactionService);
  const creditCard = new CreditCard(
    req.body.creditCardNumber,
    req.body.expirationMonth,
    req.body.expirationYear,
    req.body.cvv,
    req.body.owner,
  );

  productRepository
    .getById(req.param("productId"))
    .then((product: Product) => {
      const cart = new Cart(cartRepository.getNextId(), req.user);
      cart.addProduct(product);

      return transactionService.process(req.user, cart, creditCard);
    })
    .tap((transaction) => {
      res.render("summary", {
        cart: transaction.getCart(),
        user: req.user,
      });
    })
    .catch(next)
    .done()
  ;
});

function filterNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
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
