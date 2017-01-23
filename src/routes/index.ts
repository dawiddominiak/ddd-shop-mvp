"use strict";
import { User } from "../domain/entity/User";
import { TYPES } from "../module/types";

import * as express from "express";
import { IUserRepository } from "../domain/entity/IUserRepository";
import { shopContainer } from "./../module/shopContainer";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  const userRepository = shopContainer.get<IUserRepository>(TYPES.IUserRepository);
  userRepository
    .getByEmail("123")
    .then((user) => {
      res.render("index", { title: user.getUuid() });
    })
  ;
});

export default router;
