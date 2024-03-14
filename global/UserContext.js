import React, { createContext, useState, useContext } from 'react';

// Create a context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    const setUser = (data) => {
        setUserData(data);
    };

    return (
        <UserContext.Provider value={{ userData, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook to access the context
export const useUser = () => useContext(UserContext);
