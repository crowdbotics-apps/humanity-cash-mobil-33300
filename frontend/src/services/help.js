import Tooltip from "@mui/material/Tooltip";
import React from "react";


export const HELP_TOOLTIP = {
  CARGAR_COSA: "Esta es una ayuda",
 }



 /* SYNTACTIC SUGAR helpers, no tocar */

 export const TooltipTextClosure = (text) => ({children, ...props}) => {
      return <Tooltip title={text} {...props}>{children}</Tooltip>
}

 export const init_help_cmps = () => {
  Object.entries(HELP_TOOLTIP).forEach(([key, text]) => {
    if (typeof text === 'string' || text instanceof String){
      HELP_TOOLTIP[key] = TooltipTextClosure(text)
  }
  })
}
