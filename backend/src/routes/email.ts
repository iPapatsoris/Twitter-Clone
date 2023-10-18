/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { CreateEmailCode, GetEmail, VerifyEmailCode } from "../api/email.js";
import {
  addEmailCode,
  codesMatch,
  emailExists,
  emailHasCode,
  updateEmailCode,
} from "../services/email.js";
import { TypedRequestQuery } from "../util.js";
const router = express.Router();

router.get(
  "/:email",
  async (
    req: TypedRequestQuery<{ email: string }>,
    res: Response<GetEmail["response"]>
  ) => {
    const { email } = req.params;

    res.send({
      ok: true,
      data: {
        emailExists: await emailExists(email),
      },
    });
  }
);

router
  .route("/code")
  // Generate code for an email or update it if it already exists
  .post(
    async (
      req: Request<{}, {}, CreateEmailCode["request"]>,
      res: Response<CreateEmailCode["response"]>
    ) => {
      const { email } = req.body;

      const code = (await emailHasCode(email))
        ? await updateEmailCode(email)
        : await addEmailCode(email);

      res.send({
        ok: true,
        data: {
          code,
        },
      });
    }
  )
  .patch(
    // Regenerate code for an email
    async (
      req: Request<{}, {}, CreateEmailCode["request"]>,
      res: Response<CreateEmailCode["response"]>
    ) => {
      const { email } = req.body;

      const code = await updateEmailCode(email);

      res.send({
        ok: true,
        data: {
          code,
        },
      });
    }
  );

router
  .route("/code/verify")
  .post(
    async (
      req: Request<{}, {}, VerifyEmailCode["request"]>,
      res: Response<VerifyEmailCode["response"]>
    ) => {
      const { email, code } = req.body;

      const match = await codesMatch({ email, code });

      res.send({
        ok: true,
        data: {
          codesMatch: match,
        },
      });
    }
  );

export default router;
