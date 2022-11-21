import classes from "./Icon.module.scss"

interface IconProps {
	src: string
}

const Icon = ({ src }: IconProps) => {
	return (
		<img src={src} className={classes.Icon} />
	);
}

export default Icon;