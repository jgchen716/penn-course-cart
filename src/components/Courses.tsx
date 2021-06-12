import React, { useEffect, useState } from "react";

import * as data from "../data/courses.json";
import "../App.css";
import { course } from "../App";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { FaCartPlus } from "react-icons/fa";

import axios from "axios";

export type appState = {
	loading: boolean;
	courses: Map<string, any>;
}

export type instructor = {
	name: string;
	section_id: string;
	term: string;
}

type CoursesProps = {
	query: string,
	addCourse: (c: course) => void;
	cart: course[]
}

function Courses({ query, addCourse, cart }: CoursesProps) {
	let courses: course[] = JSON.parse(data);

	const [appState, setAppState] = useState<appState>({
		loading: false,
		courses: new Map<string, any>(),
	});

	useEffect(() => {
		setAppState({ loading: true, courses: new Map<string, any>() });
		const apiUrl = "https://api.pennlabs.org/registrar/search?q=cis";
		axios.get(apiUrl).then((res) => {
			const courseMap = new Map();
			const allResults = res.data.courses;
			for (var i = 0; i < allResults.length; i++) {
				const result = allResults[i];
				// create unique keys for lecture vs recitation
				const key = result.course_number.concat(result.activity);
				if (courseMap.has(key)) {
					// combine existing data in map with data of current item
					const val = courseMap.get(key);

					const newInstructors = [...val.instructors];
					const instructorsToAdd = result.instructors;
					instructorsToAdd.forEach(function(instructor: instructor) {
						// if list of instructors doesn't include instructor already, add it
						if (!newInstructors.includes(instructor.name)) {
							newInstructors.push(instructor.name);
						}
					});

					// update object value in map
					val.instructors = newInstructors;
					val.meetings = [...val.meetings, ...result.meetings];
					courseMap.set(key, val);
				} else {
					// get names from array of objects
					const instructorNames: string[] = [];
					result.instructors.forEach((instructor: instructor) =>
						instructorNames.push(instructor.name)
					);

					const val = {
						meetings: result.meetings,
						instructors: instructorNames,
						credit_and_grade_type: result.credit_and_grade_type,
					};
					courseMap.set(key, val);
				}
			}

			// remove courses not in courses.json
			const courseCodes = new Set();
			courses.forEach((courseObj: course) =>
				courseCodes.add(courseObj.number.toString())
			);

			courseMap.forEach((_, k) => {
				const code = k.substring(0, 3);
				if (!courseCodes.has(code)) {
					courseMap.delete(k);
				}
			});
			console.log(courseMap);
			setAppState({ loading: false, courses: courseMap });
		});
	}, []);

	// search results
	const [searchResults, setSearchResults] = useState([]);

	// filter by search query
	useEffect(() => {
		const results = courses.filter(function(course: course) {
			const queryLower = query.toLowerCase();
			const code = course.number.toString();
			const code_no_space = "CIS" + code;
			const code_with_space = "CIS " + code;
			if (
				code_no_space.toLowerCase().includes(queryLower) ||
				code_with_space.toLowerCase().includes(queryLower) ||
				course.title.toLowerCase().includes(queryLower) ||
				course.description.toLowerCase().includes(queryLower)
			) {
				return true;
			} else if (course.hasOwnProperty("prereqs")) {
				if (typeof course.prereqs === "string") {
					if (course.prereqs.toLowerCase().includes(queryLower)) {
						return true;
					}
				} else {
					if (course.prereqs.join("").includes(queryLower)) {
						return true;
					}
				}
			} else if (
				course.hasOwnProperty("cross-listed") &&
				course["cross-listed"]
					.join("")
					.toLowerCase()
					.includes(queryLower)
			) {
				return true;
			} else if (
				appState &&
				appState.courses &&
				appState.courses.get(code.concat("LEC")) &&
				appState.courses
					.get(code.concat("LEC"))
					.instructors.join("")
					.toLowerCase()
					.includes(queryLower)
			) {
				return true;
			}

			return false;
		});
		setSearchResults(results);
	}, [query]);

	return (
		<div>
			<div className="courses">
				<Accordion defaultActiveKey="0">
					{searchResults.map(function(course, index) {
						return (
							<div
								className="course-card"
								key={`${course.dept}-${course.number}`}
							>
								<Card key={index} bg={cart.includes(course) ? "warning" : ""}>
									<Accordion.Toggle as={Card.Header} eventKey={course.number}>
										<span className="course-subheading course-code">
											{course.dept} {course.number}{" "}
										</span>

										{course.title}
									</Accordion.Toggle>
									<Accordion.Collapse eventKey={course.number}>
										<Card.Body>
											{appState &&
												appState.courses &&
												appState.courses.get(
													course.number.toString().concat("LEC")
												) && (
													<p>
														<span className="course-subheading">Credits: </span>
														{
															appState.courses.get(
																course.number.toString().concat("LEC")
															).credit_and_grade_type
														}
													</p>
												)}
											{course.prereqs !== null &&
											course.prereqs !== undefined ? (
												<p>
													<span className="course-subheading">
														Prerequisites:{" "}
													</span>
													{typeof course.prereqs === "string"
														? course.prereqs
														: course.prereqs.join(", ")}
												</p>
											) : (
												<p>
													<span className="course-subheading">
														Prerequisites:{" "}
													</span>
													N/A
												</p>
											)}
											{course["cross-listed"] !== null &&
											course["cross-listed"] !== undefined ? (
												<p>
													<span className="course-subheading">
														Cross-listings:{" "}
													</span>
													{course["cross-listed"].join(", ")}
												</p>
											) : null}
											{appState &&
												appState.courses &&
												appState.courses.get(
													course.number.toString().concat("LEC")
												) && (
													<p>
														<span className="course-subheading">
															Instructors:{" "}
														</span>
														{appState.courses
															.get(course.number.toString().concat("LEC"))
															.instructors.join(", ")}
													</p>
												)}
											<p>
												<span className="course-subheading">Description: </span>
												{course.description}
											</p>
											<div>
												<span className="course-subheading">Lectures: </span>
												{appState &&
												appState.courses &&
												(appState.courses.get(
													course.number.toString().concat("LEC")
												) === null ||
													appState.courses.get(
														course.number.toString().concat("LEC")
													) === undefined) ? (
													<p>N/A</p>
												) : (
													<ul>
														{appState &&
															appState.courses &&
															appState.courses.get(
																course.number.toString().concat("LEC")
															) &&
															appState.courses
																.get(course.number.toString().concat("LEC"))
																.meetings.map((lec, idx) => {
																	return (
																		<li key={idx}>
																			{lec.section_id_normalized}:{"  "}
																			{lec.meeting_days}
																			{"  "}
																			{lec.start_time} - {lec.end_time}
																		</li>
																	);
																})}
													</ul>
												)}
											</div>
											<div>
												<span className="course-subheading">Recitations: </span>
												{appState &&
												appState.courses &&
												(appState.courses.get(
													course.number.toString().concat("REC")
												) === null ||
													appState.courses.get(
														course.number.toString().concat("REC")
													) === undefined) ? (
													<p>N/A</p>
												) : (
													<ul>
														{appState &&
															appState.courses &&
															appState.courses.get(
																course.number.toString().concat("REC")
															) &&
															appState.courses
																.get(course.number.toString().concat("REC"))
																.meetings.map((rec, idx) => {
																	return (
																		<li key={idx}>
																			{rec.section_id_normalized}:{"  "}
																			{rec.meeting_days}
																			{"  "}
																			{rec.start_time} - {rec.end_time}
																		</li>
																	);
																})}
													</ul>
												)}
											</div>

											<Button
												id={course.number}
												variant="outline-success"
												size="lg"
												block
												onClick={() => addCourse(course)}
												value={course.title}
												disabled={cart.includes(course)}
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
		</div>
	);
}

export default Courses;
