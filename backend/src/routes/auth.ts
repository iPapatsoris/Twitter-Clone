/* eslint-disable no-multi-str */
import express, { Response } from "express";
import { LoginUser } from "../api/auth.js";
import { NormalResponse } from "../api/common.js";
import { cookieName } from "../index.js";
import { requireAuth } from "../middleware/auth.js";
import { checkCredentials } from "../services/user.js";
import { TypedRequestQuery } from "../util.js";

export const authPath = "/auth";
const loginSubpath = "/login";
const logoutSubpath = "/logout";

export const loginPath = authPath + loginSubpath;
export const logoutPath = authPath + logoutSubpath;

const router = express.Router();
router.post(
  loginSubpath,
  async (
    req: TypedRequestQuery<{}, {}, LoginUser["request"]>,
    res: Response<LoginUser["response"]>
  ) => {
    const { username, password } = req.body.user;
    const user = await checkCredentials({ username, password });
    if (!user) {
      res.send({ ok: false });
      return;
    }

    req.session.isLoggedIn = true;
    req.session.userID = user.id;

    res.send({
      ok: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          avatar: user.avatar,
        },
      },
    });
  }
);

router.delete(
  logoutSubpath,
  requireAuth,
  (req: TypedRequestQuery<{}>, res: Response<NormalResponse>) => {
    req.session.destroy((error) => {
      res.clearCookie(cookieName).send({ ok: !error });
    });
  }
);

export default router;
