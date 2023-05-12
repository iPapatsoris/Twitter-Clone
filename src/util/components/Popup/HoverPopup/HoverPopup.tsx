import { useEffect, useRef, useState } from "react";
import Popup, { PopupProps } from "../Popup";

type HoverPopupProps = {
  popupTarget: React.ReactElement | React.ReactElement[];
  children: React.ReactElement | React.ReactElement[];
  popupProps: Omit<
    PopupProps,
    "setIsActive" | "targetAreaRef" | "children" | "allowOuterEvents"
  >;
};

const HoverPopup = ({ popupTarget, children, popupProps }: HoverPopupProps) => {
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      console.log(e.target);

      if (
        e.target instanceof Node &&
        !popupRef.current?.contains(e.target) &&
        !popupTriggerRef.current?.contains(e.target)
      ) {
        setShowProfilePreview(false);
      }
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      {showProfilePreview && (
        <Popup
          /* This popup's mounting and unmounting is managed by current 
           component and not internally, thus there is no need to pass a 
           setIsActive function. However, we still keep this prop mandatory, 
           because in most use cases it is needed.
        */
          {...popupProps}
          setIsActive={() => null}
          targetAreaRef={popupTriggerRef}
          allowOuterEvents
        >
          <div ref={popupRef}>{popupTarget}</div>
        </Popup>
      )}
      <div
        ref={popupTriggerRef}
        onMouseEnter={() => setShowProfilePreview(true)}
      >
        {children}
      </div>
    </>
  );
};

export default HoverPopup;
