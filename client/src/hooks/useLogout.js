import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";


function useLogout() {

    let { userAuthDispatch } = useContext(UserAuthContext);

    function logout() {
        localStorage.removeItem('user');
        userAuthDispatch({ type: 'LOGOUT' });
    }

    return { logout }
}

export default useLogout;