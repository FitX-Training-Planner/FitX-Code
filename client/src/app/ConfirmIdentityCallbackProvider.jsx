import { createContext, useContext, useState } from "react";

const ConfirmIdentityCallbackContext = createContext();

export function ConfirmIdentityCallbackProvider({ 
  children 
}) {
  const [handleOnConfirmed, setHandleOnConfirmed] = useState(null);

  return (
    <ConfirmIdentityCallbackContext.Provider 
      value={{ handleOnConfirmed, setHandleOnConfirmed }}
    >
      {children}
    </ConfirmIdentityCallbackContext.Provider>
  );
}

export function useConfirmIdentityCallback() {
  return useContext(ConfirmIdentityCallbackContext);
}
