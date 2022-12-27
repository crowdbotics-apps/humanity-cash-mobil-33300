import React, {ReactNode, useState} from "react"
import {Button, OverlayTrigger, Popover} from "react-bootstrap";
import CSS from 'csstype';
import "./styles.css"

type actions = {
  label: string,
  action: () => void,
  disabled: boolean
}

type Props = {
  actionList: actions[],
  children: ReactNode
}

const ButtonWithPopover: React.FC<Props> = ({actionList = [], children}) => {
  const [show, setShow] = useState(false)
  const buttonStyle: CSS.Properties = {width: "85px", borderRadius: "40px", height: "40px"}
  const buttonColor: CSS.Properties = show ? {background: "#666666"} : {background: "#3B88B6"}
  const popoverStyle: CSS.Properties = {border: "1px solid #3B88B6", borderRadius: "14px", maxWidth: "90vw"}
  const buttonContainerStyle: CSS.Properties = {display: "flex", flexDirection: "column", padding: "1rem", gap: "1rem"}
  const childrenbuttonStyle: CSS.Properties = {}
  const childrenbuttonDisabledStyle = (disabled:boolean): CSS.Properties => {
    return disabled ? {color: "white", background: "#3B88B6", opacity: "0.5"} : {}
  }

  const popoverBottom = (
    <Popover style={popoverStyle}>
      <div style={buttonContainerStyle}>
        {actionList.map((action, idx) =>
          <Button key={`key_btn_${idx}`} variant={"primary"} style={{...childrenbuttonStyle, ...childrenbuttonDisabledStyle(action.disabled)}} onClick={action.action} disabled={action.disabled}>
            {action.label}
          </Button>
        )}
      </div>
    </Popover>
  );

  return (<OverlayTrigger show={show} trigger="click" placement="bottom" overlay={popoverBottom}>
    <Button style={{...buttonStyle, ...buttonColor}} onClick={() => setShow(v => !v)} onBlur={() => setShow(false)}>
      {children}
    </Button>
  </OverlayTrigger>)
}

export default ButtonWithPopover