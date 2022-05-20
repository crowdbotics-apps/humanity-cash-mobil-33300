import React from 'react'
import {useDrag} from 'react-dnd'

// @ts-ignore
export const Item = ({id, extraClass, image, smiles}) => {
  const [{isDragging}, dragRef] = useDrag({
    type: 'reactant',
    item: {id, extraClass, image, smiles},
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  return (
    <>
      {isDragging && (
        <div
          style={{borderStyle: "solid", borderWidth: 1, borderColor: "red", width: 102, height: 102}}
          key={'item-' + id}
          className={"item-chem d-flex justify-content-center align-items-center " + extraClass + " "}
          ref={dragRef}
        >
          <img src={image} alt={""}/>
        </div>
      )}
      {!isDragging && (
        <div
          key={'item-' + id}
          className={"item-chem d-flex justify-content-center align-items-center " + extraClass + " "}
          ref={dragRef}
          style={{width: 102, height: 102}}
        >
          <img src={image} alt={""}/>
        </div>
      )}
    </>
  )
}
