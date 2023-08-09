import { SetStateAction, useRef, useState } from "react";

export const useHoverPopup = () => {
  const [isHoverPopupOpen, setIsHoverPopupOpen] = useState(false);
  const eventID = useRef<ReturnType<typeof setTimeout>>();

  const setHoverPopupOpenWithDelay: React.Dispatch<SetStateAction<boolean>> = (
    flag
  ) => {
    eventID.current = setTimeout(
      () => setIsHoverPopupOpen(flag),
      flag ? 600 : 300
    );
  };

  const abortHoverPopupOpen = () => {
    clearTimeout(eventID.current);
  };

  return {
    isHoverPopupOpen,
    setIsHoverPopupOpen: setHoverPopupOpenWithDelay,
    abortHoverPopupOpen,
  };
};
