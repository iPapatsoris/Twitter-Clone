import './HeaderMain.scss'
import sparkIcon from '../assets/icons/spark.png'
const HeaderMain = () => {
	return (
		<div className="HeaderMain">
			<div className="TitleContainer">
				<h2>Home</h2>
				<img src={sparkIcon} />
			</div>
		</div>
	)
}
export default HeaderMain;