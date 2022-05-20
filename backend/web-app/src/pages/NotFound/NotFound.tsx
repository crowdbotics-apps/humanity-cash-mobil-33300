import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import './NotFound.css';
import {PageWeb} from "../../components";
export const NotFound: React.FC = observer(() => {

  return (
    <PageWeb header={false}>
      <div className="row mhvh100 justify-content-between align-items-center p-0 m-0">
        <div className={"col-12 p-0 m-0 d-flex justify-content-between align-items-center"}>
          <span style={{color: "white", fontSize: 35, textAlign: "center"}} className={"mx-auto"}>404 Page not found</span>
        </div>
      </div>
    </PageWeb>
  );
});

export default NotFound;
