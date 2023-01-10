import {useEffect, useRef, useState} from "react";

const InputField =
  ({
     type = 'checkbox',
     value = true,
     inputRef = null,
     labelStyle, inputId,
     handleChange, setFieldValue,
     formikField, labelText,
     spanClasses, labelClasses,
     checkedCondition, spanId,
     spanStyles,
     testingFunction,
     defaultValueCondition,
     item
   }) => {

  const [checkedConditionState, setCheckedConditionState] = useState(!defaultValueCondition ? null : defaultValueCondition );

    const checkboxRef = useRef(null);
    const spanRef = useRef();

    const handleChangeSpanBorder = () => {
      if(checkboxRef.current !== null) {
        if(checkboxRef.current.checked) spanRef.current.style.border = 'none';
        else spanRef.current.style.border = '1px solid black';
      }
    }
    
    useEffect(() => {
    if(testingFunction) testingFunction()
    handleChangeSpanBorder()
  }, [])

    return (
      <label
        className={`container-label ${labelClasses}`}
        style={labelStyle}
      >
        {labelText}
        <input
          ref={inputRef === null ? checkboxRef : inputRef}
          type={(type === 'checkbox' || type === 'radio') ? type : 'hidden'}
          id={inputId}
          onChange={(e) =>
            [ 
              checkboxRef.current === null ?  handleChange(inputRef) : handleChange(item, e),
              setFieldValue && setFieldValue(formikField, value),
              checkboxRef && handleChangeSpanBorder(),
              defaultValueCondition && setCheckedConditionState(!checkedConditionState),
            ]
          }
          checked={!checkedCondition ? checkedConditionState : checkedCondition}
        />

        <span className={`checkmark ${spanClasses}`} id={spanId} style={{...spanStyles}} ref={spanRef}></span>

      </label>
    )
  }

export default InputField;
