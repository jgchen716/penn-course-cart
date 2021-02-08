import React, { useEffect, useState } from "react";

import courses from "../data/courses";

import "../App.css";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { FaCartPlus } from "react-icons/fa";

function Courses({ query, addCourse, cart }) {
	// search results
	const [searchResults, setSearchResults] = useState([]);

	// search filter function
	useEffect(() => {
		const results = courses.filter(function(course) {
			const code_no_space = "CIS" + course.number.toString();
			const code_with_space = "CIS " + course.number.toString();
			if (
				code_no_space.toLowerCase().includes(query) ||
				code_with_space.toLowerCase().includes(query) ||
				course.title.toLowerCase().includes(query) ||
				course.description.toLowerCase().includes(query)
			) {
				return true;
			} else if (course.hasOwnProperty("prereqs")) {
				if (typeof course.prereqs === "string") {
					if (course.prereqs.toLowerCase().includes(query)) {
						return true;
					}
				} else {
					if (Array.prototype.join.call(course.prereqs, "").includes(query)) {
						return true;
					}
				}
			} else if (
				course.hasOwnProperty("cross-listed") &&
				Array.prototype.join
					.call(course["cross-listed"], "")
					.toLowerCase()
					.includes(query)
			) {
				return true;
			}
			return false;
		});
		setSearchResults(results);
	}, [query]);

	return (
		<div className="courses">
			<Accordion defaultActiveKey="0">
				{searchResults.map(function(course, index) {
					return (
						<div
							className="course-card"
							key={`${course.dept}-${course.number}`}
						>
							<Card
								key={index}
								bg={
									Array.prototype.includes.call(cart, course) ? "warning" : ""
								}
							>
								<Accordion.Toggle as={Card.Header} eventKey={course.number}>
									<span className="course-subheading course-code">
										{course.dept} {course.number}{" "}
									</span>

									{course.title}
								</Accordion.Toggle>
								<Accordion.Collapse eventKey={course.number}>
									<Card.Body>
										{course.prereqs != null ? (
											<p>
												<span className="course-subheading">
													Prerequisites:{" "}
												</span>
												{typeof course.prereqs === "string"
													? course.prereqs
													: Array.prototype.join.call(course.prereqs, ", ")}
											</p>
										) : (
											<p>
												<span className="course-subheading">
													Prerequisites:{" "}
												</span>
												N/A
											</p>
										)}
										{course["cross-listed"] != null ? (
											<p>
												<span className="course-subheading">
													Cross-listings:{" "}
												</span>
												{Array.prototype.join.call(
													course["cross-listed"],
													", "
												)}
											</p>
										) : null}
										<p>
											<span className="course-subheading">Description: </span>
											{course.description}
										</p>
										<Button
											id={course.number}
											variant="outline-success"
											size="lg"
											block
											onClick={() => addCourse(course)}
											value={course.title}
											disabled={Array.prototype.includes.call(cart, course)}
										>
											{" "}
											<FaCartPlus />{" "}
											<span className="add-cart">Add to Cart</span>
										</Button>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
						</div>
					);
				})}
			</Accordion>
		</div>
	);
}

export default Courses;
