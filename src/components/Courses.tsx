import React, { useEffect, useState } from "react";

import * as data from "../data/courses.json";
import "../App.css";
import * as types from "../types/types";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { FaCartPlus } from "react-icons/fa";

import axios from "axios";


type CoursesProps = {
	query: string,
	addCourse: (c: types.courseType) => void;
	cart: types.courseType[]
}

function Courses({ query, addCourse, cart }: CoursesProps) {
	let courses: types.courseType[] = JSON.parse(JSON.stringify(data)).default;

	const [appState, setAppState] = useState<types.appStateType>({
		loading: false,
		courses: new Map<string, types.apiCourse>(),
	});

	useEffect(() => {
		setAppState({ loading: true, courses: new Map<string, types.apiCourse>() });
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
					instructorsToAdd.forEach(function(inst: types.instructor) {
						// if list of instructors doesn't include instructor already, add it
						if (!newInstructors.includes(inst.name)) {
							newInstructors.push(inst.name);
						}
					});

					// update object value in map
					val.instructors = newInstructors;
					val.meetings = [...val.meetings, ...result.meetings];
					courseMap.set(key, val);
				} else {
					// get names from array of objects
					const instructorNames: string[] = [];
					result.instructors.forEach((inst: types.instructor) =>
						instructorNames.push(inst.name)
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
			courses.forEach((courseObj: types.courseType) =>
				courseCodes.add(courseObj.number.toString())
			);

			courseMap.forEach((_, k) => {
				const code = k.substring(0, 3);
				if (!courseCodes.has(code)) {
					courseMap.delete(k);
				}
			});
			setAppState({ loading: false, courses: courseMap });
		});
	}, []);

	// search results
	const [searchResults, setSearchResults] = useState<types.courseType[]>([]);

	// filter by search query
	useEffect(() => {
		const results = courses.filter(function(course: types.courseType) {
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
				
				if (course.prereqs && Array.isArray(course.prereqs) && Array.prototype.join.call(course.prereqs, " ").toLowerCase().includes(queryLower)) {
					return true;
				} else {
					if (course.prereqs && Array.isArray(course.prereqs) && course.prereqs.join(" ").includes(queryLower)) {
						return true;
					}
				}
			} else if (
				course.hasOwnProperty("cross-listed") && course["cross-listed"] && 
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
					{searchResults.map(function(course: types.courseType, index: number) {
						return (
							<div
								className="course-card"
								key={`${course.dept}-${course.number}`}
							>
								<Card key={index} bg={cart.includes(course) ? "warning" : ""}>
									<Accordion.Toggle as={Card.Header} eventKey={course.number.toString()}>
										<span className="course-subheading course-code">
											{course.dept} {course.number}{" "}
										</span>

										{course.title}
									</Accordion.Toggle>
									<Accordion.Collapse eventKey={course.number.toString()}>
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
																.meetings.map((lec: any, idx: number) => {
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
																.meetings.map((rec: any, idx: number) => {
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
												id={course.number.toString()}
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
