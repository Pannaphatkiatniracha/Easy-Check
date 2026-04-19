import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  const fetchPermissions = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const role = sessionStorage.getItem("role");
      if (!token) return;

      // เลือก endpoint ตาม role
      let url = "";

      if (role === "admin") {
        url = "http://localhost:5000/admin/permissions";
      } else {
        url = "http://localhost:5000/users/permissions";
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("PERMISSIONS:", data);

      setPermissions(data.permissions || []);
    } catch (err) {
      console.error("โหลด permission ไม่ได้", err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        permissions,
        setPermissions,
        fetchPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);