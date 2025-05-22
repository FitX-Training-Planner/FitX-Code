import styles from "./SubmitFormButton.module.css";

function SubmitFormButton({ text }) {
    return (
        <button
            type="submit"
            className={styles.submit_form_button}
        >
            {text}
        </button>
    );
}

export default SubmitFormButton;