import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfo {
	email?: string;
	family_name?: string;
	given_name?: string;
	id?: string;
	name?: string;
	picture?: string;
	verified_email?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
  login: (userData: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userString = await AsyncStorage.getItem("@user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserInfo(user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to check login status", error);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (userData: UserInfo) => {
    try {
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
      setUserInfo(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      setUserInfo(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn, 
      userInfo, 
      setUserInfo,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};