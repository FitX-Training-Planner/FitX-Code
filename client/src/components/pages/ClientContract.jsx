import { useCallback, useEffect, useRef, useState } from "react";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cleanCacheData, getCacheData, setCacheData } from "../../utils/cache/operations";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import NavBarLayout from "../containers/NavBarLayout";
import FooterLayout from "../containers/FooterLayout";
import { useConfirmIdentityCallback } from "../../app/useConfirmIdentityCallback";

function ClientContract() {
    const { t } = useTranslation();

    const { confirm } = useSystemMessage();

    const { setHandleOnConfirmed } = useConfirmIdentityCallback();

    const navigate = useNavigate();

    const hasRun = useRef();

    const { request: getUserEmailReq } = useRequest();
    const { request: cancelClientContract } = useRequest();

    const clientTrainingStorageKey = "clientTraining";
    const emailStorageKey = "fitxEmail";

    const [contract, setContract] = useState({});
    const [email, setEmail] = useState("");
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const cachedEmailData = getCacheData(emailStorageKey);

            if (cachedEmailData) {
                setEmail(cachedEmailData);
            } else {
                const getEmail = () => {
                    return api.get(`/users/me/email`);
                }
            
                const handleOnGetEmailSuccess = (data) => {
                    setEmail(data.email);

                    setCacheData(emailStorageKey, data.email);
                };
    
                getUserEmailReq(
                    getEmail, 
                    handleOnGetEmailSuccess, 
                    () => undefined, 
                    undefined, 
                    undefined, 
                    t("errorLoadingUserInfo")
                );
            }
        }

        fetchData();
    }, [getUserEmailReq, navigate, t]);

    const cancelContract = useCallback(async (e) => {
        e.preventDefault();

        const userConfirmed = await confirm(t("cancelContractConfirm"));
        
        if (userConfirmed) {
            navigate("/code-confirmation", { state: { localUser: { email: email }, origin: "cancelContract" } });

            setHandleOnConfirmed(() => () => {
                const cancelContract = () => {
                    return api.put(`/me/active-contract`);
                }
            
                const handleOnCancelContractSuccess = () => {
                    setContract(null);

                    navigate("/");

                    cleanCacheData(clientTrainingStorageKey);
                };

                cancelClientContract(
                    cancelContract, 
                    handleOnCancelContractSuccess, 
                    () => undefined, 
                    t("loadingCancelContract"), 
                    t("successCancelContract"),
                    t("errorCancelContract")
                );
            });
        }
    }, [cancelClientContract, confirm, email, navigate, setContract, setHandleOnConfirmed, t]);

    return (
        <NavBarLayout>
            <FooterLayout>
                <main>

                </main>
            </FooterLayout>
        </NavBarLayout>
    )
}

export default ClientContract;