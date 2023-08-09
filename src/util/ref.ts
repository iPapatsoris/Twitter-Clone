export const refsExist = (refs: React.RefObject<any>[]) =>
  refs.every((ref) => refExists(ref));

export const refExists = (ref: React.RefObject<any>) => ref && ref.current;

export const elementIsContainedInRefs = (
  e: React.UIEvent,
  refs: React.RefObject<any>[]
) => refs.some((ref) => ref.current.contains(e.target));
