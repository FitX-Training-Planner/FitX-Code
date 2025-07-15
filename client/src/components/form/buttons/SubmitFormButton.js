import styles from "./SubmitFormButton.module.css";

function SubmitFormButton({ text, varBgColor = "--theme-color" }) {
    return (
        <button
            type="submit"
            className={`
                ${styles.submit_form_button} 
                ${varBgColor !== "--theme-color" || varBgColor !== "--dark-theme-color" ? styles.transitioned : undefined}
            `}
            style={{ backgroundColor: `var(${varBgColor})` }}
        >
            {text}
        </button>
    );
}

export default SubmitFormButton;