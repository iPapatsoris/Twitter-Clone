/* eslint-disable no-multi-str */
import express, { Request, Response } from "express";
import { CreateEmailCode, VerifyEmailCode } from "../api/email.js";
import {
  addEmailCode,
  codesMatch,
  emailHasCode,
  updateEmailCode,
} from "../services/email.js";
const router = express.Router();

router
  .route("/")
  // Generate code for an email or update it if it already exists
  .post(
    async (
      req: Request<{}, {}, CreateEmailCode["request"]>,
      res: Response<CreateEmailCode["response"]>
    ) => {
      const { email } = req.body;
      console.log(req.body);

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
  .route("/verify")
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
