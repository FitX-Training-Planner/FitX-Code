import { useEffect, useRef, useState } from "react";
import styles from "./AnimatedInViewItem.module.css";

function AnimatedInViewItem({ children }) {
    const [status, setStatus] = useState("hidden"); 
    const ref = useRef();
    const prevY = useRef(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const currentY = entry.boundingClientRect.y;

                    if (entry.isIntersecting) {
                        setStatus("visible");
                    } else {
                        if (currentY < prevY.current) {
                            setStatus("up");
                        } else {
                            setStatus("down");
                        }
                    }

                    prevY.current = currentY;
                });
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${styles.animated_item} ${
                status === "visible"
                ? styles.is_visible
                : status === "up"
                ? styles.is_up
                : status === "down"
                ? styles.is_down
                : styles.is_hidden
            }`}
        >
            {children}
        </div>
    );
}

export default AnimatedInViewItem;
