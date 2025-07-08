// import styles from "./Home.module.css";

import { useEffect } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import { useSelector } from "react-redux";

function Home() {
    const user = useSelector(state => state.user);

    useEffect(() => {
        document.title = "Início";
    }, []);

    return (
        <NavBarLayout
            isClient={user.config.isClient}
        >
            <main>
                vBVUYBUEYBIVIdvBYUIvbiebBUY
            </main>
        </NavBarLayout>
    );
}

export default Home;