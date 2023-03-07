import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useClickOutside from "../../hooks/useClickOutside";
import styles, { InputWrapperNames } from "./InputWrapper.module.scss";
import inputStyles from "./TextInput.module.scss";
import eyeIcon from "../../../assets/icons/eye.png";
import eyeStrikeIcon from "../../../assets/icons/eye-strike.png";
import verifiedIcon from "../../../assets/icons/verified.png";
import Icon from "../Icon/Icon";

interface InputProps {
  name: string;
  placeholder: string;
  type?: "text" | "password";
  maxLength?: number;
  autofocus?: boolean;
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  value: string;
  error?: string;
  helper?: React.ReactElement;
}

const TextInput = forwardRef(
  (
    {
      name,
      placeholder,
      maxLength,
      autofocus = false,
      onChange,
      onBlur,
      value,
      error,
      helper,
      type: initialType = "text",
    }: InputProps,
    ref
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [inputType, setInputType] = useState(initialType);

    const togglePasswordReveal = (e: any) => {
      e.preventDefault();
      if (inputType === "password") {
        setInputType("text");
      } else {
        setInputType("password");
      }
    };

    useImperativeHandle(ref, () => inputRef.current);

    useEffect(() => {
      if (autofocus && inputRef.current) {
        inputRef.current.style.visibility = "visible";
        inputRef.current?.focus();
        setIsFocused(true);
      }
    }, [autofocus]);

    useClickOutside({
      ref: wrapperRef,
      onMouseDown: true,
      callback: () => {
        setIsFocused(false);
      },
    });

    const handleClick = (e: any) => {
      if (inputRef.current) {
        inputRef.current.style.visibility = "visible";
        inputRef.current.focus();
        setIsFocused(true);
        // TODO: this line disables highlighting
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const wrapperStyles: styles.InputWrapperNames[] = [styles.Wrapper];
    const typingAreaStyles: inputStyles.TextInputNames[] = [
      inputStyles.TypingArea,
    ];
    const labelStyles: string[] = [inputStyles.InheritCursor];
    const helperBoxStyles: InputWrapperNames[] = [styles.HelperBox];

    if (isFocused) {
      wrapperStyles.push(styles.Focused);
      typingAreaStyles.push(inputStyles.Focused);
    }
    if (error) {
      wrapperStyles.push(styles.Error);
      helperBoxStyles.push(styles.Error);
    }
    if (!value.length) {
      wrapperStyles.push(styles.Empty);
      typingAreaStyles.push(inputStyles.Empty);
    }

    return (
      <div>
        <div
          ref={wrapperRef}
          className={wrapperStyles.join(" ")}
          onMouseDown={(e) => handleClick(e)}
        >
          {!isFocused && !value.length && (
            <div className={inputStyles.Placeholder}>
              <span>{placeholder}</span>
            </div>
          )}
          <div className={typingAreaStyles.join(" ")}>
            <div className={[styles.Info, inputStyles.Info].join(" ")}>
              <label htmlFor="input" className={labelStyles.join(" ")}>
                {placeholder}
              </label>
              {maxLength && (
                <span>
                  {value.length} / {maxLength}
                </span>
              )}
            </div>
            <div className={inputStyles.Input}>
              <input
                name={name}
                ref={inputRef}
                maxLength={maxLength}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                onBlur={onBlur}
                value={value}
                type={inputType}
              />
              {initialType === "password" && (
                <Icon
                  src={inputType === "password" ? eyeIcon : eyeStrikeIcon}
                  onClick={(e) => togglePasswordReveal(e)}
                  hover="none"
                />
              )}
            </div>
          </div>
        </div>
        <div className={helperBoxStyles.join(" ")}>
          {helper ? helper : error}
        </div>
      </div>
    );
  }
);

export default TextInput;
