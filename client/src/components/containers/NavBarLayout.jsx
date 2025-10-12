import { matchPath, useLocation, useNavigate } from "react-router-dom";
import ClientNavBar from "../layout/ClientNavBar";
import TrainerNavBar from "../layout/TrainerNavBar";
import styles from "./NavBarLayout.module.css";
import { useCallback } from "react";

const NavBarLayout = ({ 
    children, 
    isClient = true 
}) => {
    const navigate = useNavigate();
    
    const location = useLocation();

    const isActive = useCallback((path) => {
        return matchPath({ path, end: true }, location.pathname);
    }, [location.pathname]);
    
    return (
        <div className={styles.nav_bar_container}>
            {isClient ? (
                <ClientNavBar
                    navigate={navigate}
                    isActive={isActive}
                />
            ) : (
                <TrainerNavBar
                    navigate={navigate}
                    isActive={isActive}
                />
            )}

            <div className={styles.main_content}>
                {children}
            </div>
        </div>
    );
};

export default NavBarLayout;
