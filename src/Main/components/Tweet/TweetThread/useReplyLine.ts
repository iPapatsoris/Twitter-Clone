import { useLayoutEffect } from "react";
import { toPixels } from "../../../../util/string";
import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";

type RefType = React.RefObject<HTMLDivElement>;

/* 
   Draw a vertical line from the bottom of tweet's author avatar until the end 
   of the tweet, and slightly extend it to the next tweet as well, until the top
   of the next avatar (unless noLineExtension is specified) 
*/
export const useReplyLine = (
  drawLine: boolean,
  noLineExtension: boolean,
  tweetRef: RefType,
  avatarRef: RefType,
  lineRef: RefType
) => {
  const { width, height } = useWindowDimensions();
  useLayoutEffect(() => {
    if (drawLine && avatarRef.current && tweetRef.current && lineRef.current) {
      const avatarCoordinates = avatarRef.current?.getBoundingClientRect();
      const tweetCoordinates = tweetRef.current?.getBoundingClientRect();

      // Desired gap in px
      const gapBetweenLineAndAvatar = 4;

      const tweetPadding = parseFloat(
        window.getComputedStyle(tweetRef.current).paddingBlock
      );

      lineRef.current.style.top = toPixels(
        avatarCoordinates.height + gapBetweenLineAndAvatar
      );
      lineRef.current.style.height = toPixels(
        noLineExtension
          ? tweetCoordinates.height -
              avatarCoordinates.height -
              gapBetweenLineAndAvatar -
              tweetPadding
          : tweetCoordinates.height -
              avatarCoordinates.height -
              2 * gapBetweenLineAndAvatar
      );
    }
  }, [drawLine, tweetRef, avatarRef, lineRef, noLineExtension, width, height]);
};
