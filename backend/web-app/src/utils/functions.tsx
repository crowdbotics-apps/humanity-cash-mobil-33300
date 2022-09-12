import * as Yup from "yup";
import {ValidationErrorMsg} from "./messages";
import {useState} from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import useConstant from "use-constant";
import {useAsync} from "react-async-hook";


export const getErrorMessages = (err:any)=>{
  console.log("error", err)
  let message = ""
  for (let k of Object.keys(err)){
    message +=  err[k].join(". ")
  }
  return message
}

// Generic reusable hook
export const useDebouncedSearch = (searchFunction:any) => {

  // Handle the input text state
  const [inputText, setInputText] = useState('');

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 300)
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(
    async () => {
      if (inputText.length === 0) {
        return [];
      } else {
        return debouncedSearchFunction(inputText);
      }
    },
    [debouncedSearchFunction, inputText]
  );

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  };
};
