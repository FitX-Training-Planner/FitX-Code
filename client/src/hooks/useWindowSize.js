import { useEffect, useState } from "react";

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        function handleOnResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener("resize", handleOnResize);
        return () => window.removeEventListener("resize", handleOnResize);
    }, []);

    return windowSize;
}
