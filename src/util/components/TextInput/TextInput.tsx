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
import successIcon from "../../../assets/icons/success.png";
import errorIcon from "../../../assets/icons/error.png";
import Icon from "../Icon/Icon";

interface InputProps {
  name: string;
  placeholder: string;
  type?: "text" | "password";
  maxLength?: number;
  autofocus?: boolean;
  readonly?: boolean;
  onClick?: (e: any) => void;
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  value: string;
  isValid?: boolean;
  error?: string;
  helper?: React.ReactElement;
  showStatusIcon?: boolean;
  leader?: React.ReactNode;
}

const TextInput = forwardRef(
  (
    {
      name,
      placeholder,
      maxLength,
      autofocus = false,
      readonly = false,
      onClick,
      onChange,
      onBlur,
      value,
      isValid = true,
      error,
      helper,
      type: initialType = "text",
      showStatusIcon = false,
      leader = "",
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

    const handleMousedown = (e: any) => {
      if (inputRef.current && !readonly) {
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
    const leaderStyles: inputStyles.TextInputNames[] = [inputStyles.Leader];

    if (isFocused) {
      wrapperStyles.push(styles.Focused);
      typingAreaStyles.push(inputStyles.Focused);
      leaderStyles.push(inputStyles.Focused);
    }
    if (error) {
      wrapperStyles.push(styles.Error);
      helperBoxStyles.push(styles.Error);
      leaderStyles.push(inputStyles.Error);
    }
    if (!value.length) {
      wrapperStyles.push(styles.Empty);
      typingAreaStyles.push(inputStyles.Empty);
    }

    let iconJSX;
    if (initialType === "password") {
      iconJSX = (
        <Icon
          src={inputType === "password" ? eyeIcon : eyeStrikeIcon}
          onClick={(e) => togglePasswordReveal(e)}
          hover="none"
        />
      );
    } else if (showStatusIcon) {
      if (error) {
        iconJSX = <Icon src={errorIcon} hover="none" />;
      } else if (isValid) {
        iconJSX = <Icon src={successIcon} hover="none" />;
      }
    }

    return (
      <div>
        <div
          ref={wrapperRef}
          className={wrapperStyles.join(" ")}
          onMouseDown={(e) => handleMousedown(e)}
          onClick={onClick}
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
              <span className={leaderStyles.join(" ")}>{leader}</span>
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
                readOnly={readonly}
              />
              {iconJSX}
            </div>
          </div>
        </div>
        <div className={helperBoxStyles.join(" ")}>
          {error ? error : helper}
        </div>
        {helper && error && <div className={styles.HelperBox}>{helper}</div>}
      </div>
    );
  }
);

export default TextInput;
