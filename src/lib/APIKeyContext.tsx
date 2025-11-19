// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from './amplify-client';
import { useAuth } from './AuthContext';

interface APIKey {
  id: string;
  api_id: string;
  key: string;
  status: string;
  requests_made: number;
  requests_this_month: number;
  total_spent: number;
  last_used?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface APIKeyContextType {
  apiKeys: APIKey[];
  isLoadingKeys: boolean;
  hasKeyForAPI: (apiId: string) => boolean;
  getKeyForAPI: (apiId: string) => APIKey | undefined;
  addAPIKey: (apiKey: APIKey) => void;
  refreshAPIKeys: () => Promise<void>;
  removeAPIKey: (apiKeyId: string) => void;
}

const APIKeyContext = createContext<APIKeyContextType | undefined>(undefined);

export const APIKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load API keys when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshAPIKeys();
    } else {
      setApiKeys([]);
      setIsLoadingKeys(false);
    }
  }, [isAuthenticated, user]);

  const refreshAPIKeys = async () => {
    try {
      setIsLoadingKeys(true);
      const keys = await apiClient.apiKeys.list();
      setApiKeys(keys || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
      setApiKeys([]);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const hasKeyForAPI = (apiId: string): boolean => {
    return apiKeys.some(key => key.api_id === apiId && key.status === 'active');
  };

  const getKeyForAPI = (apiId: string): APIKey | undefined => {
    return apiKeys.find(key => key.api_id === apiId && key.status === 'active');
  };

  const addAPIKey = (apiKey: APIKey) => {
    setApiKeys(prev => {
      // Remove any existing keys for this API (enforce one key per API)
      const filtered = prev.filter(k => k.api_id !== apiKey.api_id);
      return [...filtered, apiKey];
    });
  };

  const removeAPIKey = (apiKeyId: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== apiKeyId));
  };

  return (
    <APIKeyContext.Provider value={{ 
      apiKeys,
      isLoadingKeys,
      hasKeyForAPI,
      getKeyForAPI,
      addAPIKey,
      refreshAPIKeys,
      removeAPIKey
    }}>
      {children}
    </APIKeyContext.Provider>
  );
};

export const useAPIKeys = () => {
  const context = useContext(APIKeyContext);
  if (!context) {
    throw new Error('useAPIKeys must be used within an APIKeyProvider');
  }
  return context;
};

