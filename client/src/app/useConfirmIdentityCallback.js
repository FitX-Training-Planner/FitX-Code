import { useContext } from "react";
import ConfirmIdentityCallbackContext from "./ConfirmIdentityCallbackContext";

export function useConfirmIdentityCallback() {
  return useContext(ConfirmIdentityCallbackContext);
}
