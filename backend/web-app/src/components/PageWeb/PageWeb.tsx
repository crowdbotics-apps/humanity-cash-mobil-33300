import React from 'react';
import HeaderWeb from "../HeaderWeb/HeaderWeb";
import CustomTitle from "../CustomTitle/CustomTitle";
import Lottie from "react-lottie";
import animationLoader from "../../assets/svg/animation.json";

type PageProps = {
  title?: string
  header: boolean
  header_title?: string
  loading?: boolean
  left_button_header_action?: any
};

export const PageWeb: React.FC<PageProps> = React.forwardRef((props, ref) => {
  const loaderAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationLoader,
  };

  return (
    <div >
      {props.loading === true &&<div className={"d-flex flex-column justify-content-center align-items-center position-absolute loader"}>
        <Lottie
          options={loaderAnimationOptions}
          height={100}
          width={100}
        />
        <span style={{color: "white", fontSize: 20}} className={'mt-3'}>Loading...</span>
      </div>}
      {props.header && <HeaderWeb header_title={props.header_title} left_action={props.left_button_header_action}/>}
      {/*<CustomTitle title={props.title}/>*/}
      <div>
        {props.children}
      </div>
    </div>
  )
});

export default PageWeb;
