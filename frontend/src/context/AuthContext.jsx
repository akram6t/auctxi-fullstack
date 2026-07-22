import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage first, then local storage
    const storedUser = sessionStorage.getItem('auctxi_user') || localStorage.getItem('auctxi_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, rememberMe = false) => {
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem('auctxi_user', JSON.stringify(userData));
      sessionStorage.removeItem('auctxi_user');
    } else {
      sessionStorage.setItem('auctxi_user', JSON.stringify(userData));
      localStorage.removeItem('auctxi_user');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auctxi_user');
    sessionStorage.removeItem('auctxi_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
