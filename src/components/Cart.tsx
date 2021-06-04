import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "../App.css";
import { NavProps } from "../types/types";

import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Cart({ cart, removeCourse, handleOnDragEnd }: NavProps) {
	// view cart pop up window
	const [showModal, setShowModal] = useState(false);

	// message to display when cart is empty
	const message =
		"Your course cart is empty! Add courses by clicking on the 'Add Cart' button under each course. To rank courses, drag and drop to rearrange the courses in your cart.";

	return (
		<div>
			<div className="cart-button">
				<Button variant="outline-dark" onClick={() => setShowModal(true)}>
					View Cart
				</Button>
			</div>
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
										<Alert variant="info">{message}</Alert>
									) : (
										cart.map(function(course, index) {
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
