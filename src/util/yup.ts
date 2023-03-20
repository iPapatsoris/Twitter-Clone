import * as yup from "yup";

// Sequential yup validation instead of parallel, useful for async validation
// Taken from https://github.com/jquense/yup/issues/851#issuecomment-1135881029
export function yupSequentialStringSchema(schemas: yup.StringSchema[]) {
  return yup.string().test(async (value, context) => {
    try {
      for (const schema of schemas) {
        await schema.validate(value);
      }
    } catch (error: unknown) {
      const message = (error as yup.ValidationError).message;
      return context.createError({ message });
    }

    return true;
  });
}

export default yup;
