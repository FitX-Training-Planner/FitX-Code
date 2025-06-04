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

  let activeConfirmToastId = null;

  function confirm(message) {
    return new Promise((resolve, reject) => {
      if (activeConfirmToastId) return;

      activeConfirmToastId = toast.custom((t) => (
        <div
          style={{ 
            backgroundColor: "var(--light-theme-color)", 
            borderRadius: "10px",
            padding: "1em",
            display: "flex",
            flexDirection: "column",
            gap: "0.5em"
          }}
        >
          <p
            style={{
              fontWeight: "bold"
            }}
          >
            {message}
          </p>

          <div 
            style={{ 
              display: "flex",
              gap: "1em"
            }}
          >
            <button
              style={{ 
                backgroundColor: "var(--bg-color)", 
                borderRadius: "10px",
                padding: "0.3em",
                outline: "none",
                border: "1px solid var(--text-color)"
              }}
              onClick={() => {
                toast.dismiss(activeConfirmToastId);
                activeConfirmToastId = null;
                resolve(true);
              }}
            >
              Confirmar
            </button>

            <button
              style={{ 
                backgroundColor: "var(--bg-color)", 
                borderRadius: "10px",
                padding: "0.3em",
                outline: "none",
                border: "1px solid var(--text-color)"
              }}
              onClick={() => {
                toast.dismiss(activeConfirmToastId);
                activeConfirmToastId = null;
                resolve(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        duration: Infinity
      });
    });
  }

  return (
    <SystemMessageContext.Provider 
        value={{ notify, confirm }}
    >
      <Toaster />
      
      {children}
    </SystemMessageContext.Provider>
  );
}

export function useSystemMessage() {
    return useContext(SystemMessageContext);
}
