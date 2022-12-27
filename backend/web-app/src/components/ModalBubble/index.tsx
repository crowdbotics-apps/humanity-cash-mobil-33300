import React, {ReactNode, useState} from "react";
import {buttonContainer, modalBox} from "./styles";


interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
}

function useModal() {
  const initialPositionValues = {x: 0, y: 0, right: 0, bottom: 0}
  const [isOpen, setisOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(initialPositionValues)

  function getScreenCordinates(obj: any) {
    const p = {x: 0, y: 0, right:0, bottom:0};
    p.x = obj.offsetLeft;
    p.y = obj.offsetTop;
    while (obj.offsetParent) {
      p.x = p.x + obj.offsetParent.offsetLeft;
      p.y = p.y + obj.offsetParent.offsetTop;
      p.right = p.x + obj.getBoundingClientRect().width
      p.bottom = p.y + obj.getBoundingClientRect().height
      if (obj == document.getElementsByTagName("body")[0]) {
        break;
      } else {
        obj = obj.offsetParent;
      }
    }
    return p;
  }

  const getPositionProperty = (htmlElement: any) => {
    setButtonPosition(getScreenCordinates(htmlElement))
    toggle()
  }

  const toggle = () => {
    setisOpen(!isOpen);
  };

  function ModalBubble(props: ModalType) {
    const [position, setPosition] = useState(initialPositionValues)

    const hideShow = () => {
      toggle();
      setPosition({...buttonPosition});
    };

    return (
      <>
        {props.isOpen &&
          <div onClick={() => hideShow()}
               style={{...modalBox, top: 0, left: 0}}
          >
            <div style={buttonContainer}>
              {props.children}
            </div>
          </div>}
      </>
    );
  }

  return {
    ModalBubble,
    isOpen,
    getPositionProperty
  };
}

export {useModal}