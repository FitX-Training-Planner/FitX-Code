import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import SystemMessageContext from "./SystemMessageContext";

export function SystemMessageProvider({ 
  children 
}) {
  const { t } = useTranslation();

  const commonStyles = {
    backgroundColor: "var(--bg-color)", 
    color: "var(--text-color)",
    borderRadius: "10px",
    border: "2px solid var(--gray-color)",
    padding: "0.5em 1em",
    letterSpacing: "0.5px",
    maxWidth: "30em",
    textAlign: "justify"
  };

  const toastProps = {
    style: commonStyles,
    position: "top-right"
  };

  function notify(text, type = "success", id = null) {  
    if (type === "success") {
      toast.success(text, { ...toastProps, duration: 5000, id: id });
    } else if (type === "error") {
      toast.error(text, { ...toastProps, duration: 5000, id: id });
    } else if (type === "loading") {
      toast.loading(`${text}...`, { ...toastProps, duration: 5000, id: id })
    }
  }

  let activeConfirmToastId = null;

  function confirm(message) {
    return new Promise((resolve) => {
      if (activeConfirmToastId) return;

      activeConfirmToastId = toast.custom(() => (
        <div
          style={{ 
            ...commonStyles,
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
              justifyContent: "space-between",
              gap: "1em"
            }}
          >
            <button
              style={{ 
                backgroundColor: "var(--light-theme-color)", 
                color: "var(--text-color)",
                borderRadius: "10px",
                padding: "0.3em",
                outline: "none",
                border: "1px solid var(--text-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                toast.dismiss(activeConfirmToastId);
                activeConfirmToastId = null;
                resolve(true);
              }}
            >
              {t("confirm")}
            </button>

            <button
              style={{ 
                background: "none", 
                color: "var(--text-color)",
                borderRadius: "10px",
                padding: "0.3em",
                outline: "none",
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => {
                toast.dismiss(activeConfirmToastId);
                activeConfirmToastId = null;
                resolve(false);
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ),
      {
        ...toastProps,
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