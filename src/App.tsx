import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { PuffLoader } from "react-spinners";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./helpers/db";
import {
  fetchUserDetails,
  logout,
  selectAuthenticate,
  selectLoading,
} from "./components/redux/feature/userSlice";
import { useAppDispatch, useAppSelector } from "./components/redux/hooks";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import Account from "./components/Account/Account";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isAuthenticated = useAppSelector(selectAuthenticate);
  const isLoading = useAppSelector(selectLoading);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const storeTokenInLocalStorage = (token: string, expirationTime: number) => {
    const tokenData = {
      token,
      expirationTime,
    };
    localStorage.setItem("userToken", JSON.stringify(tokenData));
  };

  useEffect(() => {
    const listener = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsDataLoaded(true);
      } else {
        dispatch(fetchUserDetails(user.uid));

        const userToken = await user.getIdToken();

        const expirationTime = new Date().getTime() + 20 * 1000;
        storeTokenInLocalStorage(userToken, expirationTime);

        setIsDataLoaded(true);

        const tokenExpirationTimeout = setTimeout(() => {
          auth.signOut();
          console.log("heyy");
          dispatch(logout());
        }, expirationTime - new Date().getTime());

        setTimeoutId(tokenExpirationTimeout);

        return () => {
          clearTimeout(tokenExpirationTimeout);
        };
      }
    });

    return () => listener();
  }, []);

  return (
    <div className="App">
      <ErrorBoundary>
        {isDataLoaded ? (
          <Routes>
            {!isAuthenticated && !isLoading && (
              <>
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth signup />} />
              </>
            )}
            <Route path="/" element={<Home />} />
            <Route
              path="/account"
              element={<Account timeoutId={timeoutId} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <div className="spinner">
            <PuffLoader color="#63b2ff" />
          </div>
        )}
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;
