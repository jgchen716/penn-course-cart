import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "../App.css";

import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Cart({ cart, removeCourse }) {
	// view cart pop up window
	const [showModal, setShowModal] = useState(false);
	const [courses, updateCourses] = useState(cart);

	function handleOnDragEnd(result) {
		if (!result.destination) return;

		const items = Array.from(courses);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		updateCourses(items);
	}

	return (
		<div>
			<Button variant="outline-dark" onClick={() => setShowModal(true)}>
				View Cart
			</Button>
			<Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-lg">
						Course Cart
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<DragDropContext onDragEnd={handleOnDragEnd}>
						<Droppable droppableId="courses">
							{(provided) => (
								<div
									className="courses"
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{cart.length === 0 ? (
										<Alert variant="info">
											Your course cart is empty! Add courses by clicking on the
											"Add Cart" button under each course.
										</Alert>
									) : (
										courses.map(function(course, index) {
											return (
												<Draggable
													key={`${course.dept}-${course.number}`}
													draggableId={`${course.dept}-${course.number}`}
													index={index}
												>
													{(provided) => (
														<div>
															<Alert
																variant="warning"
																onClose={() => removeCourse(course)}
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																dismissible
															>
																<Alert.Heading>
																	CIS {course.number}
																</Alert.Heading>
																<p>{course.title}</p>
															</Alert>
														</div>
													)}
												</Draggable>
											);
										})
									)}

									<div className="checkout-button">
										<Button variant="success" block>
											<Link to="/checkout">
												<h5 className="link">Checkout</h5>
											</Link>
										</Button>
									</div>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default Cart;
