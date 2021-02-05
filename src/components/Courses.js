import React from 'react'
import courses from '../data/courses'

export default () => (
  <>
    {courses.map(({ dept, number }) => (
      <p key={`${dept}-${number}`}>
        {dept}
        {' '}
        {number}
      </p>
    ))}
  </>
)
