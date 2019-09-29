import React from 'react'
import styles from './DivisionBlob.scss'

function DivisionBlob({division}) {
  return (
    <div className={`divisionBlob bg-${division.category}`}>
      <span>{division.labelLocal}</span>
    </div>
  )
}

export default DivisionBlob
