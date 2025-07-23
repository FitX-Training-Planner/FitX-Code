import { useContext } from "react";
import SystemMessageContext from "./SystemMessageContext";

export function useSystemMessage() {
  return useContext(SystemMessageContext);
}