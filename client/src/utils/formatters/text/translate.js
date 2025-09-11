export function translateDatabaseData(objectData, translateName, fieldName, user, t) {
    if (objectData?.ID) {
        if (user.config.isEnglish) {
            return t(`databaseData.${translateName}.${objectData.ID}.${fieldName}`);
        } else {
            return objectData[fieldName];
        }
    } 
    
    return undefined;
}