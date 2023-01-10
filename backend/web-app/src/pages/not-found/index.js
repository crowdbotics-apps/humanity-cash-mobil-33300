import React, {useEffect} from 'react';
import {setLayout, useMaterialUIController} from "../../context";
import {useLocation} from "react-router-dom";
import ImageContainer from "../../components/AuthContainer";


const NotFound = () => {
  const [, dispatch] = useMaterialUIController();
  const { pathname } = useLocation();
  useEffect(() => {
    setLayout(dispatch, "page");
  }, [pathname]);

  return <ImageContainer><div style={{
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  }}>
    <h1>404 Page not found</h1>
  </div>
  </ImageContainer>
};

export default NotFound;
