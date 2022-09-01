import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { NotFound, SynthesisExplorer, Login, Splash, Dashboard } from "./pages";
import AchTransactions from './pages/AchTransactions'
import AchTransactionsDetail from './pages/AchTransactions/Details'
import { title_pag } from "./helpers";
import { ROUTES } from "./constants";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from "react-dnd";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RootStore, setupRootStore } from "./models";
import { RootStoreProvider } from "./models/root-store/root-store-context";
import AdminPanelContainer from "./containers"
import ContentsPage from "./pages/Contents";

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

    return <Route path={path} element={component} />
  }


  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }


  return (
    <RootStoreProvider value={rootStore}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <BrowserRouter>
          {false ?
            //Rutas Publicas
            <Routes>
              {route(ROUTES.SPLASH, "", <Splash />)}
              {route(ROUTES.LOGIN, "Login", <Login />)}
            </Routes>
            :
            //Rutas privadas
            <>            <Routes>
              <Route path={ROUTES.CONTENTS} element={<ContentsPage />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.AchTransactions} element={<AchTransactions />} />
              <Route path={ROUTES.TRANSACTIONS(":id")} element={<AchTransactionsDetail />} />
              <Route path={ROUTES.SYNTHESIS_EXPLORER(":id")} element={<SynthesisExplorer />} />
              <Route path={'*'} element={<NotFound />} />

            </Routes>

            </>

          }
        </BrowserRouter>
        <ToastContainer />
      </DndProvider>
    </RootStoreProvider>
  );
}

export default App;
