import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import './NotFound.css';
import {PageWeb} from "../../components";
export const NotFound: React.FC = observer(() => {

  return (
    <PageWeb header={false}>
      <div className="row mhvh100 justify-content-between align-items-center p-0 m-0">
        <div className={"col-12 p-0 m-0 d-flex justify-content-between align-items-center"}>
          <h1 style={{color: "#3B88B6", fontSize: 35, textAlign: "center"}} className={"mx-auto"}>404 Page not found</h1>
        </div>
      </div>
    </PageWeb>
  );
});

export default NotFound;
