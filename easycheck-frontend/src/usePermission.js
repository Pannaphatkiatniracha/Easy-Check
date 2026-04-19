import { useAuth } from "./AuthContext.jsx";

export const usePermission = () => {
    const { permissions } = useAuth();

    const can = (action) => {
        console.log("permissions:", permissions);
        return permissions.includes(action);

    };

    return { can };
};