import React, { useState } from "react";
import Courses from "./Courses";
import { courseType } from "../types/types";
import "../App.css";

type HomeProps = {
	addCourse: (c: courseType) => void;
	cart: courseType[];
}

// contains search bar and course listings
export default function Home({ addCourse, cart }: HomeProps) {
	// current search query state
	const [searchQuery, setSearchQuery] = useState<string>("");

	return (
		<div>
			<div className="search-bar">
				<form>
					<input
						className="search"
						autoCapitalize="none"
						autoComplete="off"
						spellCheck="false"
						type="text"
						tabIndex={0}
						placeholder="Search for a course"
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
					/>
				</form>
			</div>
			<Courses query={searchQuery} cart={cart} addCourse={addCourse} />
		</div>
	);
}
