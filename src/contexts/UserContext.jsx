import {
  createContext,
  useState
} from 'react'
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {

  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [user, setUser] = useState(null);

  const saveCurrentUser = (token) => {
    localStorage.setItem("userToken", token);
    setUserToken(token);

    const tokenData = jwtDecode(token);
    setUser({
      id: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      userName: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    })
  };

  const removeCurrentUser = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
    setUser(null);
  }

  const isOrganizer = () => user?.role == "Organizer";
  const isAdmin = () => user?.role == "Admin";
  const isAttendee = () => user?.role == "Attendee";
  const isAuthenticated = () => userToken != null;

  const isCurrentOrganizer = (organizerId) => isOrganizer() && user.id == organizerId;
  const isCurrentAttendee = (attendeeId) => isAttendee() && user.id == attendeeId;

  return (
    <UserContext.Provider value={{
      userToken,
      user,
      saveCurrentUser,
      removeCurrentUser,
      isAuthenticated,
      isOrganizer,
      isAttendee,
      isAdmin,
      isCurrentOrganizer,
      isCurrentAttendee
    }}>
      {children}
    </UserContext.Provider>
  );


}
