import style from "./HeaderMain.module.scss";
interface HeaderMainProps {
  children: React.ReactNode;
}

const HeaderMain = ({ children }: HeaderMainProps) => {
  return (
    <div
      className={[
        style.HeaderMain,
        style.Sticky,
        style.HeaderMainGridArea,
      ].join(" ")}
    >
      {children}
    </div>
  );
};
export default HeaderMain;
