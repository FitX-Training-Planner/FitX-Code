import { handleOnChangeDocument } from "../../../utils/handlers/changeHandlers";
import ClickableIcon from "../buttons/ClickableIcon";
import FileInput from "../fields/FileInput";

function SendDocumentForm({ 
    chatFormContext, 
    setChatFormContext, 
    setDocumentError, 
    handleSubmit 
}) {
    return (
        <form
            onSubmit={handleSubmit}
        >
            <FileInput
                name="document"
                placeholder="Selecione o PDF do seu exame de composição corporal"
                handleChange={(e) => handleOnChangeDocument(e, chatFormContext, setChatFormContext, setDocumentError)}
            />

            {document && (
                <ClickableIcon
                    iconSrc="/images/icons/send.png"
                    name="Enviar composição corporal"
                    isSubmit
                />
            )}
        </form>
    );
}

export default SendDocumentForm;