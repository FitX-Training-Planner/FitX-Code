import styles from "./SubmitFormButton.module.css";

function SubmitFormButton({ text, varBackgroundColor = "--theme-color", varColor = "--dark-color" }) {
    return (
        <button
            type="submit"
            style={{ backgroundColor: `var(${varBackgroundColor})`, color: `var(${varColor})` }}
            className={styles.submit_form_button}
        >
            {text}
        </button>
    );
}

export default SubmitFormButton;