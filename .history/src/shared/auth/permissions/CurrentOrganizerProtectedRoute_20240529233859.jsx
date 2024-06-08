import { useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useGetOrganizerById } from "../../../API/organizerProfileApi";

export default function CurrentOrganizerProtectedRoute({ children }) {
  const { user, isCurrentOrganizer } = useContext(UserContext);
  const navigate = useNavigate();

  const { data: organizerData } = useGetOrganizerById(user?.id);

  useEffect(() => {
    if (!isCurrentOrganizer(organizerData?.id)) {
      navigate("/");
    }
  }, [navigate, isCurrentOrganizer, organizerData?.id]);

  return isCurrentOrganizer(user?.id) ? <>{children}</> : null;
}
