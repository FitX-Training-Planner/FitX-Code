import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import ClickableIcon from "../buttons/ClickableIcon";
import MessageInput from "../fields/MessageInput";
import Stack from "../../containers/Stack";
import styles from "./MessageForm.module.css";

function MessageForm({ chatFormContext, setChatFormContext, isChatBot, setMessageError, handleSubmit }) {
    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                direction="row"
                className={styles.message_form}
            >
                <MessageInput
                    name="message"
                    value={chatFormContext.message}
                    handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, undefined, chatFormContext, setChatFormContext, setMessageError)}
                    maxLength={isChatBot ? 100 : 1000}
                    varTextColor="--white-color"
                    placeholder="Insira sua mensagem"
                />

                <Stack
                    className={styles.send_message}
                >
                    <ClickableIcon
                        iconSrc="/images/icons/send.png"
                        name="Enviar mensagem"
                        isSubmit
                        hasTheme={false}
                    />
                </Stack>
            </Stack>
        </form>
    );
}

export default MessageForm;