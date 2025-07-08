import { useCallback } from "react";
import useRequest from "./useRequest";
import api from "../api/axios";

export default function useGets() {
    const { request } = useRequest();

    const getCardioOptions = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/cardio-options")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar opões de cardio!"
        );
    }, [request]);

    const getCardioIntensities = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/cardio-intensities")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar intensidades de cardio!"
        );
    }, [request]);

    const getExercises = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/exercises")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar execícios!"
        )
    }, [request]);

    const getExerciseEquipments = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/exercise-equipments")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar equipamentos"
        )
    }, [request]);

    const getBodyPositions = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/body-positions")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar posições corporais!"
        )
    }, [request]);

    const getPulleyHeights = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/pulley-heights")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar alturas de polia!"
        )
    }, [request]);

    const getPulleyAttachments = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/pulley-attachments")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar acessórios de polia!"
        )
    }, [request]);

    const getGripTypes = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/grip-types")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar tipos de pegada!"
        )
    }, [request]);

    const getGripWidths = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/grip-widths")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar espaçamentos de pegada!"
        )
    }, [request]);

    const getLateralities = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/lateralities")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar formas de execução!"
        )
    }, [request]);

    const getSetTypes = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/set-types")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar tipos de séries!"
        )
    }, [request]);

    const getTrainingTechniques = useCallback(async (handleSuccess, handleError) => {
        await request(
            () => {return api.get("/training/training-techniques")},
            handleSuccess,
            handleError,
            undefined,
            undefined,
            "Falha ao carregar técnicas de treino!"
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
