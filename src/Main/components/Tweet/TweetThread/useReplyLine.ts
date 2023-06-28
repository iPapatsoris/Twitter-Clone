import { useLayoutEffect } from "react";
import { toPixels } from "../../../../util/string";

type RefType = React.RefObject<HTMLDivElement>;
export const useReplyLine = (
  drawLine: boolean,
  tweetRef: RefType,
  avatarRef: RefType,
  lineRef: RefType
) => {
  useLayoutEffect(() => {
    if (drawLine && avatarRef.current && tweetRef.current && lineRef.current) {
      const avatarCoordinates = avatarRef.current?.getBoundingClientRect();
      const tweetCoordinates = tweetRef.current?.getBoundingClientRect();
      const avatarBottom = avatarCoordinates?.bottom + window.scrollY;
      const tweetBottom = tweetCoordinates?.bottom + window.scrollY;
      const lineHeight = tweetBottom - avatarBottom;

      lineRef.current.style.height = toPixels(lineHeight + 3);
      lineRef.current.style.left = toPixels(avatarCoordinates.width / 2);
    }
  }, [drawLine, tweetRef, avatarRef, lineRef]);
};
