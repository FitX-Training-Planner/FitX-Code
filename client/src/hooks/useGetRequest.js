import { useCallback } from "react";
import useRequest from "./useRequest";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

export default function useGets() {
    const { t } = useTranslation();

    const { request } = useRequest();

    const getCardioOptions = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/cardio-options")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorCardioOptions")
        );
    }, [request]);

    const getCardioIntensities = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/cardio-intensities")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorCardioIntensities")
        );
    }, [request]);

    const getExercises = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/exercises")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorExercises")
        )
    }, [request]);

    const getExerciseEquipments = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/exercise-equipments")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorExerciseEquipments")
        )
    }, [request]);

    const getBodyPositions = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/body-positions")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorBodyPositions")
        )
    }, [request]);

    const getPulleyHeights = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/pulley-heights")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorPulleyHeights")
        )
    }, [request]);

    const getPulleyAttachments = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/pulley-attachments")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorPulleyAttachments")
        )
    }, [request]);

    const getGripTypes = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/grip-types")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorGripTypes")
        )
    }, [request]);

    const getGripWidths = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/grip-widths")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorGripWidths")
        )
    }, [request]);

    const getLateralities = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/lateralities")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorLateralities")
        )
    }, [request]);

    const getSetTypes = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/set-types")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorSetTypes")
        )
    }, [request]);

    const getTrainingTechniques = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/training-techniques")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            t("errorTrainingTechniques")
        )
    }, [request]);

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
