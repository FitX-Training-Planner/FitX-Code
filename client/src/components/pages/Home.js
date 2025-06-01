// import styles from "./Home.module.css";

import { useEffect } from "react";

function Home() {
    useEffect(() => {
        document.title = "Início";
    }, []);

    return (
        <main>

        </main>
    );
}

export default Home;