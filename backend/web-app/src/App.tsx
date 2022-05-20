import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {NotFound, SynthesisExplorer, StartForm, Splash} from "./pages";
import {title_pag} from "./helpers";
import {ROUTES} from "./constants";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from 'react-dnd-touch-backend'
import {DndProvider} from "react-dnd";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {RootStore, setupRootStore} from "./models";
import {RootStoreProvider} from "./models/root-store/root-store-context";


function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
    (async () => {
      setupRootStore().then(setRootStore)
    })()
  }, [])

  if (!rootStore) return null


  const route = (path: string, title: string, component: any, exact = true) => {
    (title_pag as any)[path as any] = title
    return <Route path={path} element={component}/>
  }


  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }


  return (
    <RootStoreProvider value={rootStore}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <BrowserRouter>
          <Routes>
            {route(ROUTES.SPLASH, "", <Splash/>)}
            {route(ROUTES.START_FORM, "Start Form", <StartForm/>)}
            {route(ROUTES.SYNTHESIS_EXPLORER(":id"), "Synthesis explorer", <SynthesisExplorer/>)}
            {route('*', "", <NotFound/>)}
          </Routes>
        </BrowserRouter>
        <ToastContainer/>
      </DndProvider>
    </RootStoreProvider>
  );
}

export default App;
