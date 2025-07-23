import { useCallback } from "react";
import useRequest from "./useRequest";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function useGets() {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    const { request } = useRequest();

    const translateData = useCallback((data, translateKey, setFn) => {
        if (!user.config.isEnglish) {
            setFn(data);

            return;
        }

        const translatedData = data.map(item => {
            const translationPath = `databaseData.${translateKey}.${item.ID}`;
            const translatedFields = t(translationPath, { returnObjects: true });

            if (translatedFields && typeof translatedFields === "object") {
                return {
                    ...item,
                    ...translatedFields
                };
            }

            return item;
        });

        setFn(translatedData);
    }, [t, user.config.isEnglish]);

    const getCardioOptions = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/cardio-options")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorCardioOptions")
        );
    }, [request, t, translateData]);

    const getCardioIntensities = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/cardio-intensities")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorCardioIntensities")
        );
    }, [request, t, translateData]);

    const getExercises = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/exercises")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorExercises")
        )
    }, [request, t, translateData]);

    const getExerciseEquipments = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/exercise-equipments")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorExerciseEquipments")
        )
    }, [request, t, translateData]);

    const getBodyPositions = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/body-positions")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorBodyPositions")
        )
    }, [request, t, translateData]);

    const getPulleyHeights = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/pulley-heights")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorPulleyHeights")
        )
    }, [request, t, translateData]);

    const getPulleyAttachments = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/pulley-attachments")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorPulleyAttachments")
        )
    }, [request, t, translateData]);

    const getGripTypes = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/grip-types")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorGripTypes")
        )
    }, [request, t, translateData]);

    const getGripWidths = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/grip-widths")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorGripWidths")
        )
    }, [request, t, translateData]);

    const getLateralities = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/lateralities")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorLateralities")
        )
    }, [request, t, translateData]);

    const getSetTypes = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/set-types")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorSetTypes")
        )
    }, [request, t, translateData]);

    const getTrainingTechniques = useCallback(async (handleSuccess, handleError, translateKey, setFn) => {
        await request(
            () => {return api.get("/training/training-techniques")},
            (data) => {
                handleSuccess();
                
                translateData(data, translateKey, setFn);
            },
            handleError,
            undefined,
            undefined,
            t("errorTrainingTechniques")
        )
    }, [request, t, translateData]);

    return {
        getCardioOptions,
        getCardioIntensities,
        getExercises,
        getExerciseEquipments,
        getBodyPositions,
        getPulleyHeights,
        getPulleyAttachments,
        getGripTypes,
        getGripWidths,
        getLateralities,
        getSetTypes,
        getTrainingTechniques
    };
}
