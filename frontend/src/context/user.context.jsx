import React,{createContext,useState, Children} from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user,setUser] = useState(null);

    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    );
};
