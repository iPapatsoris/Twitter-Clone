import {
  ComponentProps,
  RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./TextArea.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import { toPixels } from "../../string";

const TextArea = ({
  textareaProps,
  refToAlignTopRowWith,
  extraStyles,
}: {
  /*
  Use this prop if we want to center align only the top row of the textarea with 
  another element, and let it grow downwards from there. Without it, the whole 
  textarea would be aligned after it would expand to 2+ lines, no longer having
  the first row center aligned (for example by using align-items: center)
  */
  textareaProps: ComponentProps<typeof TextareaAutosize>;
  refToAlignTopRowWith: RefObject<HTMLElement>;
  extraStyles: string[];
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const dummyRef = useRef<HTMLTextAreaElement>(null);
  const [renderDummy, setRenderDummy] = useState(true);

  /* 
    We initially render a hidden dummy TextareaAutosize component just to 
    calculate the exact height of textarea with only a single row of input. We 
    need this to manually center only the first row of the text area with 
    another element.
  */
  useLayoutEffect(() => {
    if (
      renderDummy &&
      ref &&
      ref.current &&
      dummyRef &&
      dummyRef.current &&
      refToAlignTopRowWith &&
      refToAlignTopRowWith.current
    ) {
      const topRowHeight = dummyRef.current?.getBoundingClientRect().height;
      ref.current.style.marginTop = toPixels(
        refToAlignTopRowWith.current.getBoundingClientRect().height / 2 -
          topRowHeight / 2
      );
      setRenderDummy(false);
    }
  }, [renderDummy, ref, dummyRef, refToAlignTopRowWith]);

  const classes = [...extraStyles, styles.TextArea];

  return (
    <>
      <TextareaAutosize
        ref={ref}
        className={classes.join(" ")}
        {...textareaProps}
      />
      {renderDummy && (
        <TextareaAutosize
          ref={dummyRef}
          className={[...classes, styles.Dummy].join(" ")}
        />
      )}
    </>
  );
};
export default TextArea;
