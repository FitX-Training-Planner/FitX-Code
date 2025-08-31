import { useTranslation } from "react-i18next";
import styles from "./TrainerPageContainers.module.css";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import React from "react";
import SpecialtyCard from "../cards/training/SpecialtyCard";
import FlexWrap from "../containers/FlexWrap";
import Loader from "./Loader";
import useWindowSize from "../../hooks/useWindowSize";
import { useSelector } from "react-redux";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import { useNavigate } from "react-router-dom";

function SpecialtiesContainer({
    specialties,
    specialtiesError,
    specialtiesLoading,
    viewerIsClient
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    const { width } = useWindowSize();

    const navigate = useNavigate();

    return (
        <Stack
            className={styles.complaints_container}
            gap="3em"
        >
            <Title
                headingNumber={2}
                text={t("trainerSpecialties")}
            />

            {!specialtiesLoading ? (
                <Stack
                    gap="3em"
                >
                    {!specialtiesError && (
                        specialties?.mainSpecialties.length !== 0 || specialties?.secondarySpecialties.length !== 0 ? (
                            <Stack>                    
                                {specialties?.mainSpecialties.length !== 0 && (
                                    <FlexWrap
                                        direction="row"
                                        justifyContent="center"
                                        maxElements={width <= 840 ? (width <= 440 ? 1 : 2) : 3}
                                    >
                                        {specialties?.mainSpecialties.map((specialty, index) => (
                                            <React.Fragment
                                                key={index}
                                            >
                                                <SpecialtyCard
                                                    name={
                                                        user.config.isEnglish 
                                                        ? t(`databaseData.specialties.${specialty.ID}.name`) 
                                                        : specialty.name
                                                    }
                                                    icon={specialty.media?.url}
                                                    isSelected
                                                    isMain
                                                />
                                            </React.Fragment>
                                        ))}
                                    </FlexWrap>
                                )}

                                {specialties?.mainSpecialties.length !== 0 && specialties?.secondarySpecialties.length !== 0 && (
                                    <hr/>
                                )}

                                {specialties?.secondarySpecialties.length !== 0 && (
                                    <FlexWrap
                                        direction="row"
                                        justifyContent="center"
                                        maxElements={width <= 840 ? (width <= 440 ? 1 : 2) : 3}
                                    >
                                        {specialties?.secondarySpecialties.map((specialty, index) => (
                                            <React.Fragment
                                                key={index}
                                            >
                                                <SpecialtyCard
                                                    name={
                                                        user.config.isEnglish 
                                                        ? t(`databaseData.specialties.${specialty.ID}.name`) 
                                                        : specialty.name
                                                    }
                                                    icon={specialty.media?.url}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </FlexWrap>
                                )}
                            </Stack>
                        ) : (
                            <p
                                style={{ textAlign: "center" }}
                            >
                                {t("noSpecialties")}
                            </p>
                        )
                    )}

                    {specialtiesError && (
                        <p>
                            <>
                                {t("errorOcurredSpecialties")}

                                <br/>
                                
                                {t("reloadOrTryLater")}
                            </>
                        </p>
                    )}

                    {!viewerIsClient && (
                        <NonBackgroundButton
                            text={t("editSpecialties")}
                            handleClick={() => 
                                navigate("/trainer-specialties", { 
                                    state: { 
                                        selectedSpecialties: [ ...(specialties?.mainSpecialties || []), ...(specialties?.secondarySpecialties || []) ],
                                        modify: true
                                    }
                                }
                            )}
                            varColor="--theme-color"
                        />
                    )}
                </Stack>                                                             
            ) : (
                <Loader />
            )}
        </Stack>
    )
}

export default SpecialtiesContainer;