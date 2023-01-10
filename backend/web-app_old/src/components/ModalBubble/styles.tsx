import CSS from 'csstype';

const modalBox: CSS.Properties = {
  position: "absolute",
  background: "white",
  padding: "1rem",
  border: "1px solid #3B88B6",
  borderRadius: "1rem",
}


const buttonContainer: CSS.Properties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
}


export {modalBox, buttonContainer}
