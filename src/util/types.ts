export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

interface Constructable {
  new (): any;
}

export const getClassFieldsToArray = <Class extends Constructable>(
  myClass: Class
) => Object.keys(new myClass()) as Array<keyof InstanceType<Class>>;
