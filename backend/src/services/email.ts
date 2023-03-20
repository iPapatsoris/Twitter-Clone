import { runQuery } from "../util.js";

const generateCode = () => {
  const codeLength = 6;
  return Math.random()
    .toString()
    .slice(2, codeLength + 2);
};

export const updateEmailCode = async (email: string) => {
  const code = generateCode();
  await runQuery<{ email: string; code: string }>(
    "UPDATE email_code SET code = ? WHERE email = ?",
    [code, email]
  );
  return code;
};

export const addEmailCode = async (email: string) => {
  const code = generateCode();
  await runQuery<{ email: string; code: string }>(
    "INSERT INTO email_code (email, code) VALUES (?, ?)",
    [email, code]
  );
  return code;
};

export const emailHasCode = async (email: string) => {
  return (
    (
      await runQuery<{ count: number }>(
        "SELECT count(*) as count FROM email_code WHERE email = ?",
        [email]
      )
    )[0].count > 0
  );
};

export const codesMatch = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const savedCode = (
    await runQuery<{ code: string }>(
      "SELECT code from email_code WHERE email = ?",
      [email]
    )
  )[0].code;
  return code === savedCode;
};

export const emailExists = async (email: string) => {
  const count = (
    await runQuery<{ count: number }>(
      "SELECT count(*) as count FROM user WHERE email = ?",
      [email]
    )
  )[0].count;
  return count > 0;
};
