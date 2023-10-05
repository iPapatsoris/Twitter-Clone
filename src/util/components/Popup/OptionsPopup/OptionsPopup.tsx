import Popup, { PopupProps } from "../Popup";
import {
  OptionWithNested,
  addClickHandlerToNonExpandableOptions,
} from "./Option";
import OptionsList from "./OptionsList";

// Note: If OptionsPopup is placed as the child of the element that opens it
// onClick, the onClick event handler passed to the individual options
// should call stopPropagation(), to prevent it from re-opening after it closes.
export interface OptionsPopupProps {
  // Options for the popup. Nested options are supported that expand it
  options: OptionWithNested[];
  extraOptionStyles?: string[];
  popupProps: Omit<PopupProps, "children">;
}

const OptionsPopup = ({
  options,
  extraOptionStyles,
  popupProps,
}: OptionsPopupProps) => {
  const closePopup = () => popupProps.setIsActive(false);

  const optionsWithPopupHandling = addClickHandlerToNonExpandableOptions(
    options,
    closePopup
  );

  return (
    <Popup {...popupProps}>
      <OptionsList
        options={optionsWithPopupHandling}
        extraOptionStyles={extraOptionStyles}
      />
    </Popup>
  );
};

export default OptionsPopup;
