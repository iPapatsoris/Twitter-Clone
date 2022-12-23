import "./HeaderMain.scss";
interface HeaderMainProps {
  children: React.ReactNode;
}

const HeaderMain = ({ children }: HeaderMainProps) => {
  return <div className="HeaderMain">{children}</div>;
};
export default HeaderMain;
