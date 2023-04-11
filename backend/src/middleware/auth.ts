import { NextFunction, Request, Response } from "express";
import { cookieName } from "../index.js";
import { NormalResponse } from "../api/common.js";
import { loginPath, logoutPath } from "../routes/auth.js";

export const checkSession = (
  req: Request,
  res: Response<NormalResponse>,
  next: NextFunction
): void => {
  if (
    req.path !== loginPath &&
    req.path !== logoutPath &&
    (!req.session || !req.session.isLoggedIn)
  ) {
    res.clearCookie(cookieName);
    const oldJSON = res.json;
    res.json = (data) => {
      data!.loggedOut = true;
      return oldJSON.call(res, data);
    };
  }
  next();
};

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
