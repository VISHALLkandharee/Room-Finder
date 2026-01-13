import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AddRoom from "./pages/AddRoom";
import MyRooms from "./pages/MyRooms";
import RoomDetails from "./pages/RoomDetails";
import PrivateRoute from "./components/PrivateRoute";

//context auth
import { AuthProvider } from "./context/auth";
import NotFound from "./pages/NotFound";

const App = () => {
  const router = createBrowserRouter([
    { path: "/auth", element: <Auth /> },
    {
      element: <PrivateRoute />,
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/add-room", element: <AddRoom /> },
        { path: "/my-rooms", element: <MyRooms /> },
        { path: "/room-details/:id", element: <RoomDetails /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
