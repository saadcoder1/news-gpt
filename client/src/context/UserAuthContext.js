import { createContext, useReducer, useEffect } from "react";

let UserAuthContext = createContext();

function userAuthReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload
            }
        case 'LOGOUT':
            return {
                user: null
            }
        default:
            return state;
    }
}


const UserAuthProvider = ({ children }) => {

    let [userAuthState, userAuthDispatch] = useReducer(userAuthReducer, {
        user: null
    });

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            userAuthDispatch({ type: 'LOGIN', payload: user });
        }
    }, [])

    return (
        <UserAuthContext.Provider value={{ userAuthState, userAuthDispatch }}>
            {children}
        </UserAuthContext.Provider>
    );
}


export { UserAuthContext };

export default UserAuthProvider;