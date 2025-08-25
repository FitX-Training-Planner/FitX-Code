// import styles from "./Home.module.css";

import { useEffect } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import { useSelector } from "react-redux";
import FooterLayout from "../containers/FooterLayout";
import { useTranslation } from "react-i18next";

function TrainerHome() {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    useEffect(() => {
        document.title = t("home");
    }, [t]);

    return (
        <NavBarLayout
            isClient={user.config.isClient}
        >
            <FooterLayout>
                <main>
                    vBVUYBUEYBIVIdvBYUIvbiebBUY
                </main>
            </FooterLayout>
        </NavBarLayout>
    );
}

export default TrainerHome;