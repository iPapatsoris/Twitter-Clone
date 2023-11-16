import { ComponentProps } from "react";
import { Link as RouterLink } from "react-router-dom";

interface LinkConditionProps {
  condition?: boolean;
  linkProps: ComponentProps<typeof RouterLink>;
  children: JSX.Element;
}

const LinkCondition = ({
  condition = true,
  linkProps,
  children,
}: LinkConditionProps) =>
  condition ? <RouterLink {...linkProps}>{children}</RouterLink> : children;

export default LinkCondition;
