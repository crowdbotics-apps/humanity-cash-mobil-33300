import React from 'react';
import {observer} from "mobx-react-lite";
import {Helmet} from "react-helmet";
import {useMatch} from "react-router-dom";
import {getTitlePag} from "../../helpers";

type CustomTitileProps = {
  title?: string
};

export const TituloCustom: React.FC<CustomTitileProps> = observer((props) => {
  return (
    <Helmet>
      <title>{props.title ? ("EWS | " + props.title) : getTitlePag(useMatch)}</title>
    </Helmet>
  )
});

export default TituloCustom;
