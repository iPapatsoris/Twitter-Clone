import './HeaderMain.scss'
import * as classes from '../../util/Icon/Icon.module.scss'
import sparkIcon from '../../assets/icons/spark.png'
const HeaderMain = () => {
	return (
		<div className="HeaderMain">
			<h2>Home</h2>
			<img src={sparkIcon} title="Top Tweets" className={classes.Icon} />
		</div>
	)
}
export default HeaderMain;