import "./Search.scss"
import searchIcon from "../../assets/icons/search.png"
const Search = () => {
	return (
		<div className="Search">
			<img src={searchIcon} />
			<input type="text" placeholder="Search Twitter" className="Search" />
		</div>
	)
}

export default Search;