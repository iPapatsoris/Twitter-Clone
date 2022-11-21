import classes from "./Icon.module.scss"

interface IconProps {
	src: string;
	title: string;
}

const Icon = ({ src, title }: IconProps) => {
	return (
		<img src={src} title={title} className={classes.Icon} />
	);
}

export default Icon;