import { useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const { isAdmin } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  return isAdmin() ? <>{children}</> : null;
}
