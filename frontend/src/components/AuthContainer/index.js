import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {setLayout, useMaterialUIController} from "../../context";


const ImageContainer = ({children}) => {
  const [, dispatch] = useMaterialUIController();
  const { pathname } = useLocation();
  useEffect(() => {
    setLayout(dispatch, "page");
  }, [pathname]);

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      backgroundColor: '#F7F5F0',
      padding: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {children}
    </div>
  )

};

export default ImageContainer;
