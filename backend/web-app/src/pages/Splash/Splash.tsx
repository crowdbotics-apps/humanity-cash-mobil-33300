import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import Lottie from 'react-lottie';
import './Splash.css';
import {useNavigate} from "react-router-dom";
import animation from '../../assets/svg/animation.json';
import { ROUTES } from '../../constants';

export const Splash: React.FC = observer(() => {
  const navigate = useNavigate();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
  };

  useEffect(() => {
    setTimeout(() => {
      navigate(ROUTES.LOGIN)
    }, 3000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
        />
        <span style={{color: "white", fontSize: 20}} className={'mt-3'}>Humanity Cash</span>
    </div>
  );
});

export default Splash;
