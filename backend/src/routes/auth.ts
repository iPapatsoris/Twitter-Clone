/* eslint-disable no-multi-str */
import express, { NextFunction, Request, Response } from "express";
import { LoginUser } from "../api/auth.js";
import { NormalResponse } from "../api/common.js";
import { cookieName } from "../index.js";
import { checkCredentials } from "../services/user.js";
import { TypedRequestQuery } from "../util.js";

const router = express.Router();
router.post(
  "/login",
  async (
    req: TypedRequestQuery<{}, {}, LoginUser["request"]>,
    res: Response<LoginUser["response"]>
  ) => {
    const { email, password } = req.body.user;
    const user = await checkCredentials({ email, password });
    if (!user) {
      res.send({ ok: false });
      return;
    }

    req.session.isLoggedIn = true;
    req.session.userID = user.id;

    res.send({
      ok: true,
      data: {
        user: { username: user.username, name: user.name, avatar: user.avatar },
      },
    });
  }
);

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.session && req.session.isLoggedIn === true) {
    next();
    return;
  }
  res.status(403);
  res.send("Not permitted");
};

router.delete(
  "/logout",
  requireAuth,
  (req: TypedRequestQuery<{}>, res: Response<NormalResponse>) => {
    req.session.destroy((error) => {
      res.clearCookie(cookieName).send({ ok: !error });
    });
  }
);

export default router;
