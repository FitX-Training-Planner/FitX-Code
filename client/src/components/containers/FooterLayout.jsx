import { useNavigate } from "react-router-dom";
import Footer from "../layout/Footer";

const FooterLayout = ({ 
    children
}) => {
    const navigate = useNavigate();
    
    return (
        <>
            {children}

            <Footer 
                navigate={navigate}
            />
        </>
    );
};

export default FooterLayout;
