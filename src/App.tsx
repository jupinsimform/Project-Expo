import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import Account from "./components/Account/Account";
import { auth, getUserFromDatabase } from "./helpers/db";
import { ClipLoader } from "react-spinners";

function App() {
  const signup = true;
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchUserDetails = async (uid: string) => {
    const userDetail = await getUserFromDatabase(uid);
    // console.log(userDetail);
    if (userDetail) {
      setUserDetails(userDetail);
      setIsDataLoaded(true);
    }
    console.log(userDetails);
  };

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsDataLoaded(true);
        setisAuthenticated(false);
      } else {
        setisAuthenticated(true);
        fetchUserDetails(user.uid);
      }
    });
    return () => listener();
  }, []);

  // useEffect(() => {
  //   console.log(userDetails);
  // }, [userDetails]);

  return (
    <>
      {isDataLoaded ? (
        <Routes>
          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth signup />} />
            </>
          )}
          <Route path="/" element={<Home authenticate={isAuthenticated} />} />
          <Route path="/account" element={<Account />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="spinner">
          <ClipLoader color="purple" />
        </div>
      )}
    </>
  );
}

export default App;
