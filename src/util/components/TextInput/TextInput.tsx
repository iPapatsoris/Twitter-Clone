import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  ForwardedRef,
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
  type?: "text" | "password" | "textArea";
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

type RefType = HTMLInputElement | HTMLTextAreaElement;
const TextInput = forwardRef<RefType, InputProps>(
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
    },
    ref
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<RefType>(null);
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

    // Forward inputRef outside component
    useImperativeHandle(ref, () => inputRef.current as NonNullable<RefType>);

    useEffect(() => {
      if (autofocus && inputRef && inputRef.current) {
        inputRef.current.style.visibility = "visible";
        inputRef.current?.focus();
        setIsFocused(true);
      }
    }, [autofocus, inputRef]);

    useClickOutside({
      ref: wrapperRef,
      onMouseDown: true,
      callback: () => {
        setIsFocused(false);
      },
    });

    const handleMousedown = (e: any) => {
      if (inputRef && inputRef.current && !readonly) {
        inputRef.current.style.visibility = "visible";
        inputRef.current.focus();
        setIsFocused(true);
        // TODO: this line disables highlighting
        e.preventDefault();
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

    const inputProps = {
      name,
      // ref: inputRef,
      maxLength,
      onChange: (e: any) => {
        onChange(e.target.value);
      },
      onBlur,
      value,
      readOnly: readonly,
    };

    let input;
    if (inputType === "textArea") {
      input = (
        <textarea
          {...inputProps}
          ref={inputRef as ForwardedRef<HTMLTextAreaElement>}
        />
      );
    } else {
      input = (
        <input
          {...inputProps}
          ref={inputRef as ForwardedRef<HTMLInputElement>}
          type={inputType}
        />
      );
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
              {input}
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
