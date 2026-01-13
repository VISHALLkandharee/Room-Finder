import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/auth";

const PrivateRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (!user) return <Navigate to={"/auth"} />;

  return <Outlet />;
};

export default PrivateRoute;
