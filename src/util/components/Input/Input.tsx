import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  ForwardedRef,
  HTMLProps,
} from "react";
import useClickOutside from "../../hooks/useClickOutside";
import styles from "./InputWrapper.module.scss";
import inputStyles from "./Input.module.scss";
import eyeIcon from "../../../assets/icons/eye.png";
import eyeStrikeIcon from "../../../assets/icons/eye-strike.png";
import successIcon from "../../../assets/icons/success.png";
import errorIcon from "../../../assets/icons/error.png";
import Icon from "../Icon/Icon";
import useForwardRef from "../../hooks/useForwardRef";

interface InputProps {
  name: string;
  placeholder: string;
  type?: "text" | "password" | "textArea";
  maxLength?: number;
  autofocus?: boolean;
  readonly?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  isValid?: boolean;
  error?: string;
  helper?: React.ReactElement;
  showStatusIcon?: boolean;
  leader?: React.ReactNode;
}

export type RefType = HTMLInputElement | HTMLTextAreaElement;
const Input = forwardRef<RefType, InputProps>(
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
    fref
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<RefType>(null);
    const ref = useForwardRef(fref, inputRef);
    const [isFocused, setIsFocused] = useState(false);
    const [inputType, setInputType] = useState(initialType);

    const togglePasswordReveal = (e: React.MouseEvent) => {
      e.preventDefault();
      if (inputType === "password") {
        setInputType("text");
      } else {
        setInputType("password");
      }
    };

    useEffect(() => {
      if (autofocus && ref && ref.current) {
        ref.current.style.visibility = "visible";
        ref.current?.focus({ preventScroll: true });
        setIsFocused(true);
      }
    }, [autofocus, ref]);

    useClickOutside({
      ref: wrapperRef,
      onMouseDown: true,
      enabled: isFocused,
      callback: () => {
        setIsFocused(false);
      },
    });

    /* We have an input element nested within a wrapper for custom styling.
       Wrapper initially holds a placeholder div, and on wrapper mouse down,
       we remove the placeholder, make the input visible and manually focus on
       it.
    */
    useEffect(() => {
      if (isFocused) {
        ref.current.style.visibility = "visible";
        ref.current.focus();
      }
    }, [ref, isFocused]);

    const handleWrapperMousedown = (e: React.MouseEvent) => {
      if (ref && ref.current && !readonly) {
        // Mouse down on wrapper div would blur the inner input that we are
        // trying to manually focus on, prevent this behavior.
        e.preventDefault();
        /* 
           Mouse down on wrapper removes input placeholder div (this is intended
           behavior). Then, the mousedown handler in useClickOutside checks if 
           the clicked area is within the wrapper, to decide if we should 
           unfocus from the input or not. Because placeholder element has been 
           removed, it is perceived as a click outside the wrapper, and so 
           undesirably removes focus. Stop propagation to skip the 
           useClickOutside handler.
           */
        e.stopPropagation();
        setIsFocused(true);
      }
    };

    const wrapperStyles: styles.ClassNames[] = [styles.Wrapper];
    const typingAreaStyles: inputStyles.ClassNames[] = [inputStyles.TypingArea];
    const labelStyles: string[] = [inputStyles.InheritCursor];
    const helperBoxStyles: styles.ClassNames[] = [styles.HelperBox];
    const leaderStyles: inputStyles.ClassNames[] = [inputStyles.Leader];

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

    const inputProps: HTMLProps<HTMLInputElement | HTMLTextAreaElement> = {
      name,
      maxLength,
      onChange: (e: React.ChangeEvent<any>) => {
        // TODO: fix any TS
        onChange(e.target.value);
      },
      onBlur,
      value,
      readOnly: readonly,
      onMouseDown: (e: React.MouseEvent) => {
        setIsFocused(true);
        // Parent calls preventDefault() on onMouseDown. We need to stop
        // propagation, because otherwise text highlighting (mouse down
        // default behavior) will not work.
        e.stopPropagation();
      },
    };

    let input;
    if (inputType === "textArea") {
      input = (
        <textarea
          {...inputProps}
          ref={ref as ForwardedRef<HTMLTextAreaElement>}
        />
      );
    } else {
      input = (
        <input
          {...inputProps}
          ref={ref as ForwardedRef<HTMLInputElement>}
          type={inputType}
        />
      );
    }

    return (
      <div>
        <div
          ref={wrapperRef}
          className={wrapperStyles.join(" ")}
          onMouseDown={(e) => handleWrapperMousedown(e)}
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

export default Input;
