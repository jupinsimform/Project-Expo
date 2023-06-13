import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import Account from "./components/Account/Account";
import { auth } from "./helpers/db";
import {
  fetchUserDetails,
  selectAuthenticate,
} from "./components/redux/feature/userSlice";
import { useAppDispatch, useAppSelector } from "./components/redux/hooks";
import { ClipLoader } from "react-spinners";

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuthenticate);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsDataLoaded(true);
      } else {
        dispatch(fetchUserDetails(user.uid));
        setIsDataLoaded(true);
      }
    });
    return () => listener();
  }, []);

  return (
    <div className="App">
      {isDataLoaded ? (
        <Routes>
          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth signup />} />
            </>
          )}
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="spinner">
          <ClipLoader color="purple" />
        </div>
      )}
    </div>
  );
}

export default App;
