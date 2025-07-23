import { useState } from "react";
import ConfirmIdentityCallbackContext from "./ConfirmIdentityCallbackContext";

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
