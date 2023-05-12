import { useEffect, useRef, useState } from "react";
import Popup from "../../../util/components/Popup/Popup";
import Profile from "./Profile";

const TestProfilePreview = () => {
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
          setIsActive={() => null}
          targetAreaRef={popupTriggerRef}
          position={{ block: "bottom", inline: "leftCover" }}
          allowOuterEvents
        >
          <div ref={popupRef}>
            <Profile preview={{ username: "lel" }} />
          </div>
        </Popup>
      )}
      <div
        ref={popupTriggerRef}
        onMouseEnter={() => setShowProfilePreview(true)}
      >
        Hover me!
      </div>
    </>
  );
};

export default TestProfilePreview;
