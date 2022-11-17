import "./Search.scss"
import searchIcon from "../../assets/icons/search.png"
import { useRef } from 'react';

const Search = () => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}

	return (
		<div className="Search" onClick={handleClick}>
			<img src={searchIcon} />
			<input 
				ref={inputRef}
				type="text" 
				placeholder="Search Twitter" 
				className="Search" 
			/>
		</div>
	)
}

export default Search;