import React, { useEffect, useState } from 'react';

import {

  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import { NotFound, SynthesisExplorer, LoginPage, ResetPasswordPage, Splash, Dashboard } from "./pages";
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
import ContentsPage from "./pages/Contents/Contents";
import EmployeesPage from "./pages/Employees/Employees";
import {ForgotPasswordPage} from "./pages/ForgotPassword/ForgotPassword";
import BlockTransactionsPage from "./pages/BlockchainTransactions";
import UsersPage from "./pages/Users";
import UserDetailPage from "./pages/UserDetail";
import {SocialMediaPage} from "./pages/SocialMedia/SocialMedia";


// @ts-ignore
const ProtectedRoute = ({ isAllowed }:{isAllowed:boolean}) => {
  if (!isAllowed) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <Outlet />;
};


function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {

    if(rootStore){
      console.log("reiniciando", rootStore)

      rootStore.userStore.setUp()
    }
  },[rootStore])

  useEffect(() => {
    (async () => {
      setupRootStore().then((rootStore)=>{
        setRootStore(rootStore)

        setIsLoggedIn(rootStore.userStore.isLoggedIn)
      })
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

          <Routes>
            {route(ROUTES.SPLASH, "", <Splash />)}

            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route element={<ProtectedRoute isAllowed={rootStore && rootStore.userStore.isLoggedIn} />} >
                  <Route path={ROUTES.CONTENTS} element={<ContentsPage />} />
                  <Route path={ROUTES.SOCIAL} element={<SocialMediaPage />} />
                  <Route path={ROUTES.EMPLOYEES} element={<EmployeesPage />} />
                  <Route path={ROUTES.USERS} element={<UsersPage />} />
                  <Route path={ROUTES.USERS_DETAIL(":id")} element={<UserDetailPage />} />
                  <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                  <Route path={ROUTES.TRANSACTIONS} element={<AchTransactions />} />
                  <Route path={ROUTES.BLOCKCHAIN_TRANSACTIONS} element={<BlockTransactionsPage />} />
                  <Route path={ROUTES.TRANSACTIONS_DETAIL(":id")} element={<AchTransactionsDetail />} />

            </Route>

            <Route path={ROUTES.SYNTHESIS_EXPLORER(":id")} element={<SynthesisExplorer />} />
            <Route path={'*'} element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </DndProvider>
    </RootStoreProvider>
  );
}

export default App;
