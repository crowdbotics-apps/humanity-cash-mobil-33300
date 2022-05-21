import React from 'react'
import {useDrag} from 'react-dnd'

// @ts-ignore
export const ItemReagent = ({id, extraClass, image, text}) => {
  const [{isDragging}, dragRef] = useDrag({
    type: 'reagent',
    item: {id, extraClass, image, text},
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  return (
    <>
      {isDragging && <div
        key={'item-reage-' + id}
        className={"item-chem d-flex justify-content-center align-items-center " + extraClass + " "}
        ref={dragRef}
        style={{borderStyle: "solid", borderWidth: 1, borderColor: "red", width: 102, height: 102}}
      >
        {image !== "" && <img src={image} alt={''} />}
        {image === "" && <span style={{fontSize: 10}}>{text}</span>}
      </div>}
      {!isDragging && image !== "" &&
        <div
        key={'item-reage-' + id}
        className={"item-chem d-flex justify-content-center align-items-center " + extraClass + " "}
        ref={dragRef}
        style={{width: 102, height: 102,}}
      >
        <img src={image} alt={''} />
      </div>}
      {!isDragging && image === "" &&
        <div
          key={'item-reage-' + id}
          className={"item-chem d-flex justify-content-center align-items-center " + extraClass + " "}
          ref={dragRef}
          style={{width: 102, height: 102, borderStyle: "solid", borderWidth: 1, borderColor: "black"}}
        >
          <span style={{fontSize: 10}}>{text}</span>
        </div>}
    </>
  )
}
