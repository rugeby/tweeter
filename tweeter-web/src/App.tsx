import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfoListener from "./components/userInfo/UserInfoHook";
import { FeedScroller, FollowersScroller, FollowingScroller, StoryScroller } from "./components/mainLayout/ItemScroller";

const App = () => {
  const { currentUser, authToken } = useUserInfoListener();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route path="feed" element={
          //Generic ItemScroller
          <FeedScroller />
        }
        />
        <Route path="story" element={
          //Generic ItemScroller
          <StoryScroller />
        }
        />

        <Route
          path="following"
          element={
            //Generic ItemScroller
            <FollowingScroller />
          }
        />
        <Route
          path="followers"
          element={
            //Generic ItemScroller
            <FollowersScroller />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;