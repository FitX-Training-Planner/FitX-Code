import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import Title from "../text/Title";
import SmallTrainerProfessionalCard from "../cards/user/SmallTrainerProfessionalCard";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import api from "../../api/axios";
import { verifyIsClient } from "../../utils/requests/verifyUserType";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useSelector } from "react-redux";
import Alert from "../messages/Alert";
import { cleanCacheData, getCacheData, setCacheData } from "../../utils/cache/operations";
import FooterLayout from "../containers/FooterLayout";

function SavedTrainers() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const hasRun = useRef(false);
        
    const { notify } = useSystemMessage();
    
    const { request: isClient } = useRequest();
    const { request: getTrainersReq } = useRequest();
    const { request: saveTrainerReq, loading: saveTrainerLoading } = useRequest();

    const user = useSelector(state => state.user);

    const storageKey = "savedTrainers";

    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsClient(isClient, user, navigate, notify, t);

            if (!success) return;

            const cachedData = getCacheData(storageKey);
            
            if (cachedData) {
                setTrainers(cachedData);

                return;
            }

            const getTrainers = () => {
                return api.get(`/me/saved-trainers`);
            }
            
            const handleOnGetTrainersSuccess = (data) => {            
                setTrainers(data);

                setCacheData(storageKey, data);
            };

            const handleOnGetTrainersError = () => {
                navigate("/");
            };

            getTrainersReq(
                getTrainers, 
                handleOnGetTrainersSuccess, 
                handleOnGetTrainersError, 
                t("loadingSavedTrainers"), 
                undefined, 
                t("errorSavedTrainers")
            );
        }

        fetchData();
    }, [getTrainersReq, isClient, navigate, notify, t, user]);

    const handleOnSaveTrainer = useCallback(ID => {
        if (!saveTrainerLoading) {
            setTrainers(prevTrainers => (
                prevTrainers.map(trainer => (
                    String(trainer.ID) === String(ID) 
                    ? { ...trainer, hasSaved: !trainer.hasSaved } 
                    : trainer
                ))
            ));
        }

        const saveTrainer = () => {
            return api.post(`/trainers/${ID}/save`);
        };
    
        const handleOnSaveTrainerSuccess = () => {
            cleanCacheData(storageKey);
        };

        const handleOnSaveTrainerError = () => {
            setTrainers(prevTrainers => (
                prevTrainers.map(trainer => (
                    String(trainer.ID) === String(ID) 
                    ? { ...trainer, hasSaved: !trainer.hasSaved } 
                    : trainer
                ))
            ));
        };
    
        saveTrainerReq(
            saveTrainer, 
            handleOnSaveTrainerSuccess, 
            handleOnSaveTrainerError, 
            undefined, 
            undefined, 
            t("errorSaveTrainer")
        );
    }, [saveTrainerLoading, saveTrainerReq, t]);
    
    useEffect(() => {
        document.title = t("savedTrainers");
    }, [t]);

    return (
        <NavBarLayout>
            <FooterLayout>
                <main>
                    <Stack
                        gap="4em"
                        extraStyles={{ padding: "1em" }}
                    >
                        <Stack>
                            <Title
                                headingNumber={1}
                                text={t("savedTrainers")}
                            />

                            <p
                                style={{ textAlign: "center" }}
                            >
                                {t("savedTrainersInstruction")}
                            </p>
                        </Stack>

                        <Stack
                            extraStyles={{ textAlign: "center" }}
                        >
                            <Alert />

                            {t("someDeactiveProfilesAlert")}
                        </Stack>

                        <Stack
                            gap="2em"
                        >
                            {trainers.length !== 0 ? (
                                trainers.map((trainer, index) => (
                                    <React.Fragment
                                        key={index}
                                    >
                                        <SmallTrainerProfessionalCard
                                            trainerID={trainer.ID}
                                            name={trainer.name} 
                                            photoUrl={trainer.photoUrl} 
                                            crefNumber={trainer.crefNumber} 
                                            rate={trainer.rate} 
                                            contractsNumber={trainer.contractsNumber} 
                                            complaintsNumber={trainer.complaintsNumber} 
                                            paymentPlans={trainer.paymentPlans} 
                                            handleExpand={() => navigate(`/trainers/${trainer.ID}`)}
                                            canBeContracted={trainer.canBeContracted}
                                            handleSave={() => handleOnSaveTrainer(trainer.ID)}
                                            hasSaved={trainer.hasSaved}
                                            top3Specialties={trainer.top3Specialties}
                                            extraSpecialtiesCount={trainer.extraSpecialtiesCount}
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <p>
                                    {t("noSavedTrainers")}
                                </p>
                            )}
                        </Stack>
                    </Stack>
                </main>
            </FooterLayout>
        </NavBarLayout>
    );
}

export default SavedTrainers;