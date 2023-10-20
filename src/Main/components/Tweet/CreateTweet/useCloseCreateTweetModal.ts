import { SetStateAction, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const useCloseCreateTweetModal = (
  setModalActive: React.Dispatch<SetStateAction<boolean>>
) => {
  const { state: routerState } = useLocation();

  useLayoutEffect(() => {
    if (routerState && routerState.closeCreateTweetModal) {
      setModalActive(false);
    }
  }, [routerState, setModalActive]);
};

export default useCloseCreateTweetModal;
