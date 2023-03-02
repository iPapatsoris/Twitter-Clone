import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useClickOutside from "../../hooks/useClickOutside";
import styles from "./InputWrapper.module.scss";
import inputStyles from "./Input.module.scss";

interface InputProps {
  name: string;
  placeholder: string;
  maxLength?: number;
  autofocus?: boolean;
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  value: string;
  error?: string;
}

const Input = forwardRef(
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
    }: InputProps,
    ref
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);

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
    const typingAreaStyles: inputStyles.InputNames[] = [inputStyles.TypingArea];
    const labelStyles: string[] = [inputStyles.InheritCursor];

    if (isFocused) {
      wrapperStyles.push(styles.Focused);
      typingAreaStyles.push(inputStyles.Focused);
    }
    if (error) {
      wrapperStyles.push(styles.Error);
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
            <input
              name={name}
              ref={inputRef}
              maxLength={maxLength}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              onBlur={onBlur}
            />
          </div>
        </div>
        <div className={styles.ErrorBox}>{error}</div>
      </div>
    );
  }
);

export default Input;
