import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProContextType {
  isProUser: boolean;
  setIsProUser: (value: boolean) => void;
  checkProStatus: () => Promise<void>;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProUser, setIsProUser] = useState(false);

  const checkProStatus = async () => {
    try {
      const proStatus = await AsyncStorage.getItem('proStatus');
      setIsProUser(proStatus === 'true');
    } catch (error) {
      console.error('Failed to check pro status:', error);
      setIsProUser(false);
    }
  };

  useEffect(() => {
    checkProStatus();
  }, []);

  return (
    <ProContext.Provider value={{ isProUser, setIsProUser, checkProStatus }}>
      {children}
    </ProContext.Provider>
  );
};

export const useProStatus = () => {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error('useProStatus must be used within a ProProvider');
  }
  return context;
};