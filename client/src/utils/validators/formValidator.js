import { isPaymentPlanBenefitDescriptionValid, isPaymentPlanDurationValid, isPaymentPlanPriceValid } from "./paymentsValidator";
import { isCardioDurationValid, isDurationSetValid, isNoteValid, isPlanNameValid, isRepsValid, isRestValid } from "./trainingValidator";
import { isCREFValid, isDocumentValid, isEmailValid, isMessageValid, isNameValid, isPasswordValid, isTrainerDescriptionValid } from "./userValidator";

export function hasEmptyFieldsInObject(object) {
    return Object.values(object).some(value => value === null || value === "")
}

export function validateLoginRequestData(loginError, setLoginError, email, password) {
    if (loginError) return false;

    if (hasEmptyFieldsInObject({ email, password })) {
        setLoginError(true);

        return false;
    }

    if (!(isEmailValid(email) && isPasswordValid(password))) {
        setLoginError(true);

        return false;
    }

    return true;
}

export function validateSignUpRequestData(signUpError, setSignUpError, name, email, password) {
    if (signUpError) return false;

    if (hasEmptyFieldsInObject({ name, email, password })) {
        setSignUpError(true);

        return false;
    }

    if (!(isNameValid(name) && isEmailValid(email) && isPasswordValid(password))) {
        setSignUpError(true);

        return false;
    }

    return true;
}

export function validateTrainerPostRequestData(trainerError, setTrainerError, crefNumber, description, crefUF) {
    if (trainerError) return false;

    const hasCref = crefNumber || crefUF;

    if (!isTrainerDescriptionValid(description)) {
        setTrainerError(true);
    
        return false;   
    }

    if (hasCref) {
        if (hasEmptyFieldsInObject({ crefNumber, crefUF })) {
            setTrainerError(true);
    
            return false;
        }

        if (!isCREFValid(crefNumber)) {
            setTrainerError(true);

            return false;
        }
    }

    return true;
}


export function validateCodeRequestData(codeError, setCodeError, code) {
    if (codeError) return false;

    for (let i = 0; i < code.length; i++) {
        if (hasEmptyFieldsInObject(code[i])) {
            setCodeError(true);

            return false;
        }
    }
        
    return true;
}

export function validateCardioSession(cardioError, setCardioError, note, durationMinutes, cardioIntensityID, cardioOptionID) {
    if (cardioError) return false;

    if (hasEmptyFieldsInObject({ cardioIntensityID, cardioOptionID, durationMinutes })) {
        setCardioError(true);

        return false;
    }

    if (!(isNoteValid(note) && isCardioDurationValid(durationMinutes))) {
        setCardioError(true);

        return false;
    }

    return true;
}

export function validateTrainingDay(trainingDayError, setTrainingDayError, name, note) {
    if (trainingDayError) return false;

    if (!name) {
        setTrainingDayError(true);

        return false;
    }

    if (!isPlanNameValid(name)) {
        setTrainingDayError(true);

        return false;
    }


    if (!isNoteValid(note)) {
        setTrainingDayError(true);

        return false;
    }

    return true;
}

export function validateTrainingPlan(trainingPlanError, setTrainingPlanError, name, note) {
    if (trainingPlanError) return false;

    if (!name) {
        setTrainingPlanError(true);

        return false;
    }

    if (!(isPlanNameValid(name) && isNoteValid(note))) {
        setTrainingPlanError(true);

        return false;
    }

    return true;
}

export function validateExercise(exerciseError, setExerciseError, note, exerciseID, exerciseEquipmentID, isFixed) {
    if (exerciseError) return false;

    if (!exerciseID) {
        setExerciseError(true);

        return false;
    }

    if (!!isFixed === !!exerciseEquipmentID) {
        setExerciseError(true);

        return false;
    }

    if (!isNoteValid(note)) {
        setExerciseError(true);

        return false;
    }   

    return true;
}

export function validateSet(setError, setSetError, minReps, maxReps, durationSeconds, restSeconds, setTypeID) {
    if (setError) return false; 

    if (hasEmptyFieldsInObject({ restSeconds, setTypeID })) {
        setSetError(true);

        return false;
    }

    if (!isRestValid(restSeconds)) {
        setSetError(true);
        
        return false;
    }

    const isAnyRepsSet = minReps || maxReps;
    const isDurationSet = durationSeconds;

    if ((isAnyRepsSet && isDurationSet) || (!isAnyRepsSet && !isDurationSet)) {
        setSetError(true);

        return false;
    }

    if (isAnyRepsSet) {
        if (!isRepsValid(minReps, maxReps)) {
            setSetError(true);

            return false;
        }
    }

    if (isDurationSet) {
        if (!isDurationSetValid(durationSeconds)) {
            setSetError(true);

            return false;
        }
    }
    
    return true;
}

export function validateAllElementsInTrainingPlan(trainingPlanError, setTrainingPlanError, trainingPlan) {
    if (trainingPlanError) {
        return { error: true, message: "Erro no estado atual do plano de treino!" };
    }

    if (!validateTrainingPlan(false, setTrainingPlanError, trainingPlan.name, trainingPlan.note)) {
        return { error: true, message: "Dados do plano de treino inválidos!" };
    }

    if (trainingPlan.trainingDays.length < 2) {
        return { error: true, message: "O plano de treino deve ter pelo menos 2 dias de treino!" };
    }

    if (!trainingPlan.trainingDays.some(day => day.trainingSteps.length > 0 || day.cardioSessions.length > 0)) {
        return { error: true, message: "O plano de treino deve ter pelo menos um dia com treino ou cardio!" };
    }

    for (const day of trainingPlan.trainingDays) {
        if (!validateTrainingDay(false, setTrainingPlanError, day.name, day.note)) {
            return { error: true, message: `Dados inválidos no dia de treino ${day.orderInPlan}!` };
        }

        const isRestDay = day.isRestDay;
        const hasTrainingSteps = day.trainingSteps.length > 0;
        const hasCardioSessions = day.cardioSessions.length > 0;

        if (!isRestDay && !hasTrainingSteps) {
            return { error: true, message: `O dia de treino ${day.orderInPlan} precisa ter pelo menos um exercício!` };
        }

        if (isRestDay && hasTrainingSteps) {
            return { error: true, message: `O dia de descanso ${day.orderInPlan} não pode ter exercícios!` };
        }

        if (hasCardioSessions) {
            for (const cardio of day.cardioSessions) {
                if (!validateCardioSession(false, setTrainingPlanError, cardio.note, cardio.durationMinutes, cardio.cardioIntensity?.ID, cardio.cardioOption?.ID)) {
                    return { error: true, message: `Cardio de ID ${cardio.ID} inválido no dia de treino ${day.orderInPlan}!` };
                }
            }
        }

        if (!isRestDay && hasTrainingSteps) {
            for (const step of day.trainingSteps) {
                const exercisesLenght = step.exercises.length;

                if (exercisesLenght < 1) {
                    return { error: true, message: `O exercício ${step.orderInDay} do dia de treino ${day.orderInPlan} está vazio!` };
                }

                for (const exercise of step.exercises) {
                    if (!validateExercise(false, setTrainingPlanError, exercise.note, exercise.exercise?.ID, exercise.exerciseEquipment?.ID, exercise.exercise?.isFixed)) {
                        if (exercisesLenght > 1) {
                            return { error: true, message: `Exercício ${exercise.orderInStep} inválido na sequência ${step.orderInDay} no dia de treino ${day.orderInPlan}!` };
                        } 

                        return { error: true, message: `Exercício ${step.orderInDay} inválido no dia de treino ${day.orderInPlan}!` };
                    }

                    if (exercise.sets.length < 1) {
                        if (exercisesLenght > 1) {
                            return { error: true, message: `O exercício ${exercise.orderInStep} na sequência ${step.orderInDay} no dia de treino ${day.orderInPlan} precisa ter pelo menos uma série!` };
                        } 

                        return { error: true, message: `O exercício ${step.orderInDay} no dia de treino ${day.orderInPlan} precisa ter pelo menos uma série!` };
                    }

                    for (const set of exercise.sets) {
                        if (!validateSet(false, setTrainingPlanError, set.minReps, set.maxReps, set.durationSeconds, set.restSeconds, set.setType?.ID)) {
                            if (exercisesLenght > 1) {
                                return { error: true, message: `Série ${set.orderInExercise} inválida no exercício ${exercise.orderInStep} na sequência ${step.orderInDay} no dia de treino ${day.orderInPlan}!` };
                            } 

                            return { error: true, message: `Série ${set.orderInExercise} inválida no exercício ${step.orderInDay} no dia de treino ${day.orderInPlan}!` };
                        }

                    }
                }
            }
        }
    }

    return { error: false };
}

export function validateMessage(messageError, setMessageError, message, isChatBot) {
    if (messageError) return false;

    if (!message) {
        setMessageError(true);

        return false;
    }

    if (!isMessageValid(message, isChatBot)) {
        setMessageError(true);

        return false;
    }

    return true;
}

export function validateDocument(documentError, setDocumentError, document) {
    if (documentError) return false;

    if (!document) {
        setDocumentError(true);

        return false;
    }

    if (!isDocumentValid(document)) {
        setDocumentError(true);

        return false;
    }

    return true;
}

export function validatePaymentPlan(paymentPlanError, setPaymentPlanError, name, fullPrice, durationDays, description, benefits) {
    if (paymentPlanError) return false;

    if (hasEmptyFieldsInObject({ name, fullPrice, durationDays })) {
        setPaymentPlanError(true);

        return false;
    }

    if (!(isNoteValid(description) && isPlanNameValid(name) && isPaymentPlanPriceValid(fullPrice) && isPaymentPlanDurationValid(durationDays))) {
        setPaymentPlanError(true);

        return false;
    }

    for (const benefit of benefits) {
        if (!isPaymentPlanBenefitDescriptionValid(benefit.description)) {
            setPaymentPlanError(true);

            return false;
        }  
    }

    return true;
}