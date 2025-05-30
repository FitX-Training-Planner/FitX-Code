import { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const SystemMessageContext = createContext();

export function SystemMessageProvider({ children }) {
  function notify(text, type = "success", id = null) {
    const commonStyles = {
      letterSpacing: "0.5px",
      maxWidth: "30em",
      textAlign: "justify"
    };
    
    const toastProps = {
      id: id,
      style: commonStyles,
      duration: 5000,
      position: "top-right"
    };
    
    if (type === "success") {
      toast.success(text, toastProps);
    } else if (type === "error") {
      toast.error(text, toastProps);
    } else if (type === "loading") {
      toast.loading(`${text}...`, toastProps)
    }
  }

  return (
    <SystemMessageContext.Provider 
        value={{ notify }}
    >
      <Toaster />
      
      {children}
    </SystemMessageContext.Provider>
  );
}

export function useSystemMessage() {
    return useContext(SystemMessageContext);
}
