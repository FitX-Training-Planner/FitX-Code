import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { useSystemMessage } from "../../app/useSystemMessage";
import useWindowSize from "../../hooks/useWindowSize";
import { cleanCacheData } from "../../utils/cache/operations";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { verifyIsClient } from "../../utils/requests/verifyUserType";
import api from "../../api/axios";
import NavBarLayout from "../containers/NavBarLayout";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ClickableIcon from "../form/buttons/ClickableIcon";
import FilterItemsLayout from "../containers/FilterItemsLayout";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import SmallTrainerProfessionalCard from "../cards/user/SmallTrainerProfessionalCard";
import { useTranslation } from "react-i18next";
import FooterLayout from "../containers/FooterLayout";
import SearchInput from "../form/fields/SearchInput";
import getAndSetInitialData from "../../utils/requests/initialData";
import useGets from "../../hooks/useGetRequest";
import SmallSpecialtyCard from "../cards/training/SmallSpecialtyCard";
import { translateDatabaseData } from "../../utils/formatters/text/translate";

function ClientHome() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { width } = useWindowSize();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    
    const { request: isClient } = useRequest();
    const { request: getTrainers, loading: trainersLoading } = useRequest();
    const { request: saveTrainerReq, loading: saveTrainerLoading } = useRequest();
    const { getSpecialties } = useGets();
            
    const user = useSelector(state => state.user);

    const trainersLimit = 8;

    const trainersFilters = useMemo(() => {
        return [
            { value: "most_popular", text: t("mostPopulars") },
            { value: "best_rated", text: t("bestRateds") },
            { value: "most_affordable", text: t("mostAffordables") },
            { value: "best_value", text: t("bestValues") }
        ]
    }, [t]);  

    const [trainers, setTrainers] = useState([]);
    const [trainersError, setTrainersError] = useState(false);
    const [trainersOffset, setTrainersOffset] = useState(0);
    const [activeTrainerFilter, setActiveTrainerFilter] = useState(trainersFilters[0]);
    const [searchText, setSearchText] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [specialtiesError, setSpecialtiesError] = useState(false);
    const [selectedSpecialtyID, setSelectedSpecialtyID] = useState(null);

    const loadTrainers = useCallback((hasError, updatedTrainers, offset, filter, specialtyID) => {
        if (hasError) return;

        if ((updatedTrainers.length < trainersLimit && updatedTrainers.length !== 0) || updatedTrainers.length % trainersLimit !== 0 || (offset !== 0 && updatedTrainers.length === 0)) {
            notify(t("noTrainers"));

            return;
        }

        const getSearchedTrainers = () => {
            return api.get(`/trainers`, { 
                params: { 
                    offset: offset, 
                    limit: trainersLimit, 
                    sort: filter,
                    search: searchText || undefined,
                    specialtyID: specialtyID || undefined
                }
            });
        }
        
        const handleOnGetTrainersSuccess = (data) => {   
            setTrainers(prevTrainers => {
                const existingIDs = new Set(prevTrainers.map(t => t.ID));
                
                const newTrainers = data.filter(t => !existingIDs.has(t.ID));

                return [...prevTrainers, ...newTrainers];
            });    

            setTrainersOffset(offset + trainersLimit);
        };
    
        const handleOnGetTrainersError = () => {
            setTrainersError(true);
        };
    
        const isFirstLoading = offset === 0;

        getTrainers(
            getSearchedTrainers, 
            handleOnGetTrainersSuccess, 
            handleOnGetTrainersError, 
            !isFirstLoading ? t("loadingTrainers") : undefined, 
            !isFirstLoading ? t("successTrainers") : undefined, 
            t("errorTrainers")
        );
    }, [getTrainers, notify, searchText, t]);
    
    const handleOnChangeFilter = useCallback((filter, specialtyID) => {
        setTrainers([]);
        setTrainersOffset(0);
        setTrainersError(false);

        loadTrainers(false, [], 0, filter, specialtyID);
    }, [loadTrainers]);

    const handleOnChangeSpecialtyFilter = useCallback((ID) => {
        const isEqual = ID === selectedSpecialtyID;

        if (isEqual) {
            setSelectedSpecialtyID(null);
        } else {
            setSelectedSpecialtyID(ID);            
        }
        
        handleOnChangeFilter(activeTrainerFilter.value, isEqual ? null : ID);
    }, [activeTrainerFilter.value, handleOnChangeFilter, selectedSpecialtyID]);

    useEffect(() => {
        console.log("info:", hasRun.current, user)
        if (hasRun.current || !user.ID) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            console.log("isclient")
            const success = await verifyIsClient(isClient, user, navigate, notify, t);

            if (!success) return;

            loadTrainers(trainersError, trainers, trainersOffset, activeTrainerFilter.value);

            const specialtiesData = await getAndSetInitialData(
                getSpecialties,
                setSpecialties,
                undefined,
                undefined,
                undefined,
                "specialties"
            );
            
            if (!specialtiesData) {
                setSpecialtiesError(true);
            };
        }

        fetchData();
    }, [navigate, notify, user, trainersError, trainers, trainersOffset, isClient, loadTrainers, activeTrainerFilter.value, t, getSpecialties]);
    
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
            cleanCacheData("savedTrainers");
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
        document.title = t("home");
    }, [t]);

    return (
        <NavBarLayout>
            <FooterLayout>
                <main
                    className={styles.client_home}
                >
                    <Stack
                        gap="3em"
                    >
                        <Stack
                            direction={width <= 440 ? "column" : "row"}
                            justifyContent="center"
                            gap={width <= 440 ? "0" : "1em"}
                        >
                            <ClickableIcon
                                iconSrc="/logo180.png"
                                size="large"
                                hasTheme={false}
                            />

                            <Title
                                headingNumber={1}
                                text={t("training")}
                            />
                        </Stack>

                        <Stack>
                            <Title
                                headingNumber={2}
                                text={t("otherTrainers")}
                            />

                            <Stack
                                className={styles.contracts}
                                gap="2em"
                            >
                                <Stack>
                                    <SearchInput
                                        searchText={searchText}
                                        setSearchText={setSearchText}
                                        placeholder={t("searchTrainer")}
                                        handleSubmit={() => handleOnChangeFilter(activeTrainerFilter.value)}
                                    />

                                    <FilterItemsLayout
                                        filters={trainersFilters}
                                        activeFilter={activeTrainerFilter}
                                        setActiveFilter={setActiveTrainerFilter}
                                        handleChange={handleOnChangeFilter}
                                    >
                                        <Stack
                                            gap="3em"
                                        >
                                            <Stack
                                                direction="row"
                                                className={styles.specialties}
                                            >
                                                {!specialtiesError ? (
                                                    specialties.map((specialty, index) => (
                                                        <React.Fragment
                                                            key={index}
                                                        >
                                                            <Stack
                                                                className={`${styles.specialty} ${specialty.ID === selectedSpecialtyID ? styles.selected : undefined}`}
                                                            >
                                                                <SmallSpecialtyCard
                                                                    icon={specialty.media?.url}
                                                                    name={translateDatabaseData(specialty, "specialties", "name", user, t)}
                                                                    handleClick={() => handleOnChangeSpecialtyFilter(specialty.ID)}
                                                                />
                                                            </Stack>
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <p>
                                                        <>
                                                            {t("errorOcurredSpecialties")}

                                                            <br/>
                                                            
                                                            {t("reloadOrTryLater")}
                                                        </>
                                                    </p>
                                                )}
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
                                                    !trainersLoading && (
                                                        <p>
                                                            {t("noTrainersFinded")}
                                                        </p>
                                                    )
                                                )}
                                            </Stack>
                                        </Stack>
                                    </FilterItemsLayout>
                                </Stack>

                                {trainersError ? (
                                    <p>
                                        <>
                                            {t("errorOcurredTrainers")}

                                            <br/>
                                            
                                            {t("reloadOrTryLater")}
                                        </>
                                    </p>
                                ) : (
                                    <LoadMoreButton
                                        handleLoad={() => loadTrainers(trainersError, trainers, trainersOffset, activeTrainerFilter.value, selectedSpecialtyID)}
                                        loading={trainersLoading}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </main>
            </FooterLayout>
        </NavBarLayout>
    );
}

export default ClientHome;