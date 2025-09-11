import { isDocumentValid, isPhotoValid } from "../validators/userValidator";

export function handleOnChangeTextField(e, formattFunction, dataValidator, targetObect, setTargetObject, setHasError, setErrors, errorName, useArgumentInValidator = true) {
    setHasError(false);
    
    const name = e.target.name;

    const value = 
        formattFunction ?
        formattFunction(e.target.value) :
        e.target.value;
    
    const newTargetObject = {
        ...targetObect, 
        [name]: value
    };

    setTargetObject(newTargetObject);

    if (dataValidator && setErrors) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [errorName || name]: value !== "" && (useArgumentInValidator ? !dataValidator(value) : !dataValidator())
        }));
    }
}
    
export function handleOnChangeSelect(e, dbDataArray, valueFieldName, targetObect, setTargetObject, setHasError) {
    if (setHasError) setHasError(false);
    
    const name = e.target.name;

    const value = e.target.value;

    const selectedObject = dbDataArray.find(item => valueFieldName ? (item[valueFieldName] === value) : (item === value)) || null;

    const newTargetObject = {
        ...targetObect, 
        [name]: selectedObject
    };

    setTargetObject(newTargetObject);
}

export function handleOnChangePhoto(e, targetObect, setTargetObject) {
    const name = e.target.name;

    const file = e.target.files[0];

    if (!file) return;
    
    if (!isPhotoValid(file)) return;
    
    const newBlobUrl = URL.createObjectURL(file);
    
    const newTargetObject = {
        ...targetObect,
        [name]: file,
        photoBlobUrl: newBlobUrl
    };

    setTargetObject(newTargetObject);
}

export function handleOnChangeDocument(e, targetObect, setTargetObject, setError) {
    const name = e.target.name;

    const file = e.target.files[0];

    if (!file) return;
    
    if (!isDocumentValid(file)) {
        setError(true);
        
        return;
    }
        
    const newTargetObject = {
        ...targetObect,
        [name]: file
    };

    setTargetObject(newTargetObject);
}
