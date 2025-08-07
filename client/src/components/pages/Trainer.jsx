import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import styles from "./Trainer.module.css";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import PhotoInput from "../form/fields/PhotoInput";
import Title from "../text/Title";
import { formatNumberShort } from "../../utils/formatters/text/formatNumber";
import useRequest from "../../hooks/useRequest";
import { useSystemMessage } from "../../app/useSystemMessage";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { verifyIsClient } from "../../utils/requests/verifyUserType";
import { validateComplaint, validateRating } from "../../utils/validators/formValidator";
import ClickableIcon from "../form/buttons/ClickableIcon";
import RatingsContainer from "../layout/RatingsContainer";
import ComplaintsContainer from "../layout/ComplaintsContainer";
import PaymentPlansContainer from "../layout/PaymentPlansContainer";
import BackButton from "../form/buttons/BackButton";

function Trainer() {
    const { t } = useTranslation();
    
    const navigate = useNavigate();

    const { notify, confirm } = useSystemMessage();

    const { id } = useParams();

    const hasRun = useRef(false);

    const { request: isClient } = useRequest();
    const { request: getRatings, loading: ratingsLoading } = useRequest();
    const { request: getComplaints, loading: complaintsLoading } = useRequest();
    const { request: likeRating, loading: likeRatingLoading } = useRequest();
    const { request: likeComplaint, loading: likeComplaintLoading } = useRequest();
    const { request: postRatingReq } = useRequest();
    const { request: postComplaintReq } = useRequest();
    const { request: getTrainerReq } = useRequest();
    const { request: removeComplaintReq } = useRequest();
    const { request: removeRatingReq } = useRequest();
    const { request: payReq } = useRequest();

    const user = useSelector(state => state.user);

    const ratingDefault = useMemo(() => {
        return {
            rating: 3,
            comment: ""
        }
    }, []);
    const complaintDefault = useMemo(() => {
        return {
            reason: ""
        }
    }, []);

    const ratingsLimit = 10;
    const complaintsLimit = 10;

    const [trainer, setTrainer] = useState({
        name: "",
        crefNumber: null,
        photoUrl: null,
        description: "",
        rate: "",
        ratesNumber: "",
        contractsNumber: "",
        complaintsNumber: "",
        paymentPlans: []
    });
    const [rating, setRating] = useState(ratingDefault);
    const [ratingError, setRatingError] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [ratingsError, setRatingsError] = useState(false);
    const [ratingsOffset, setRatingsOffset] = useState(0);
    const [complaint, setComplaint] = useState(complaintDefault);
    const [complaintError, setComplaintError] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [complaintsError, setComplaintsError] = useState(false);
    const [complaintsOffset, setComplaintsOffset] = useState(0);

    const loadRatings = useCallback((hasError, updatedRatings, offset) => {
        if (hasError) return;

        if ((updatedRatings.length < ratingsLimit && updatedRatings.length !== 0) || updatedRatings.length % ratingsLimit !== 0 || (offset !== 0 && updatedRatings.length === 0)) {
            notify(t("noRatings"));

            return;
        }

        const getMoreRatings = () => {
            return api.get(`/trainers/${id}/ratings`, { 
                params: { 
                    offset: offset, 
                    limit: ratingsLimit
                }
            });
        }
        
        const handleOnGetRatingsSuccess = (data) => {            
            setRatings(prevRatings => [...prevRatings, ...data]);

            setRatingsOffset(offset + ratingsLimit);
        };
    
        const handleOnGetRatingsError = () => {
            setRatingsError(true);
        };

        const isFirstLoading = offset === 0;
    
        getRatings(
            getMoreRatings, 
            handleOnGetRatingsSuccess, 
            handleOnGetRatingsError, 
            !isFirstLoading ? t("loadingRatings") : undefined, 
            !isFirstLoading ? t("successRatings") : undefined, 
            t("errorRatings")
        );
    }, [getRatings, id, notify, t]);
    
    const loadComplaints = useCallback((hasError, updatedComplaints, offset) => {
        if (hasError) return;

        if ((updatedComplaints.length < complaintsLimit && updatedComplaints.length !== 0) || updatedComplaints.length % complaintsLimit !== 0 || (offset !== 0 && updatedComplaints.length === 0)) {
            notify(t("noComplaints"));

            return;
        }

        const getMoreComplaints = () => {
            return api.get(`/trainers/${id}/complaints`, { 
                params: { 
                    offset: offset, 
                    limit: complaintsLimit
                }
            });
        }
        
        const handleOnGetComplaintsSuccess = (data) => {            
            setComplaints(prevComplaints => [...prevComplaints, ...data]);

            setComplaintsOffset(offset + complaintsLimit);
        };
    
        const handleOnGetComplaintsError = () => {
            setComplaintsError(true);
        };
    
        const isFirstLoading = offset === 0;

        getComplaints(
            getMoreComplaints, 
            handleOnGetComplaintsSuccess, 
            handleOnGetComplaintsError, 
            !isFirstLoading ? t("loadingComplaints") : undefined, 
            !isFirstLoading ? t("successComplaints") : undefined, 
            t("errorComplaints")
        );
    }, [getComplaints, id, notify, t]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsClient(isClient, user, navigate, notify, t);

            if (!success) return;

            const getTrainer = () => {
                return api.get(`/trainers/${id}`);
            }
        
            const handleOnGetTrainerSuccess = (data) => {
                setTrainer(data);
            };
        
            const handleOnGetTrainerError = () => {
                navigate("/");
            };

            getTrainerReq(
                getTrainer, 
                handleOnGetTrainerSuccess, 
                handleOnGetTrainerError, 
                t("loadingTrainer"), 
                undefined, 
                t("errorLoadingTrainer")
            );

            loadRatings(ratingsError, ratings, ratingsOffset);

            loadComplaints(complaintsError, complaints, complaintsOffset);
        }

        fetchData();
    }, [complaints, complaintsError, complaintsOffset, getTrainerReq, id, isClient, loadComplaints, loadRatings, navigate, notify, ratings, ratingsError, ratingsOffset, t, user]);

    const handleOnLikeComplaint = useCallback(ID => {
        if (!likeComplaintLoading) {
            setComplaints(prevComplaints => (
                prevComplaints.map(c => (
                    String(c.ID) === String(ID) 
                    ? { ...c, hasLiked: !c.hasLiked, likesNumber: c.hasLiked ? c.likesNumber - 1 : c.likesNumber + 1 } 
                    : c
                ))
            ));
        }

        const postLikeComplaint = () => {
            return api.post(`/trainers/complaints/${ID}/like`);
        };
    
        const handleOnLikeComplaintsError = () => {
            setComplaints(prevComplaints => (
                prevComplaints.map(c => (
                    String(c.ID) === String(ID) 
                    ? { ...c, hasLiked: !c.hasLiked, likesNumber: c.hasLiked ? c.likesNumber - 1 : c.likesNumber + 1 } 
                    : c
                ))
            ));
        };
    
        likeComplaint(
            postLikeComplaint, 
            () => undefined, 
            handleOnLikeComplaintsError, 
            undefined, 
            undefined, 
            t("errorLikeComplaint")
        );
    }, [likeComplaint, likeComplaintLoading, t]);
    
    const handleOnLikeRating = useCallback(ID => {
        if (!likeRatingLoading) {
            setRatings(prevRatings => (
                prevRatings.map(r => (
                    String(r.ID) === String(ID) 
                    ? { ...r, hasLiked: !r.hasLiked, likesNumber: r.hasLiked ? r.likesNumber - 1 : r.likesNumber + 1 } 
                    : r
                ))
            ));
        }

        const postLikeRating = () => {
            return api.post(`/trainers/ratings/${ID}/like`);
        };
    
        const handleOnLikeRatingsError = () => {
            setRatings(prevRatings => (
                prevRatings.map(r => (
                    String(r.ID) === String(ID) 
                    ? { ...r, hasLiked: !r.hasLiked, likesNumber: r.hasLiked ? r.likesNumber - 1 : r.likesNumber + 1 } 
                    : r
                ))
            ));
        };
    
        likeRating(
            postLikeRating, 
            () => undefined, 
            handleOnLikeRatingsError, 
            undefined, 
            undefined, 
            t("errorLikeRating")
        );
    }, [likeRating, likeRatingLoading, t]);
    
    const handleOnRating = useCallback((e) => {
        e.preventDefault();
       
        if (!validateRating(
            ratingError, 
            setRatingError, 
            rating.comment
        )) return;

        const formData = new FormData();    

        formData.append("rating", rating.rating);
        formData.append("comment", rating.comment);

        const postRating = () => {
            return api.post(`/trainers/${id}/ratings`, formData);
        };
        
        const handleOnPostRatingSuccess = (data) => {
            setRatings(prevRatings => [
                data,
                ...prevRatings
            ]);

            setTrainer(prevTrainer => ({ 
                ...prevTrainer, 
                ratesNumber: Number(prevTrainer.ratesNumber) + 1, 
                rate: (Number(prevTrainer.rate) * Number(prevTrainer.ratesNumber) + Number(rating.rating)) / (Number(prevTrainer.ratesNumber) + 1)
            }));

            setRating(ratingDefault);
        };

        const handleOnPostRatingError = () => {
            setRatingError(true);
        };

        postRatingReq(
            postRating, 
            handleOnPostRatingSuccess, 
            handleOnPostRatingError, 
            t("sendingRating"), 
            t("successRating"), 
            t("errorRating")
        );
    }, [id, postRatingReq, rating.comment, rating.rating, ratingDefault, ratingError, t]);
    
    const handleOnComplaint = useCallback((e) => {
        e.preventDefault();
       
        if (!validateComplaint(
            complaintError, 
            setComplaintError, 
            complaint.reason
        )) return;

        const formData = new FormData();    

        formData.append("reason", complaint.reason);

        const postComplaint = () => {
            return api.post(`/trainers/${id}/complaints`, formData);
        };
        
        const handleOnPostComplaintSuccess = (data) => {
            setComplaints(prevComplaints => [
                data,
                ...prevComplaints
            ]);

            setTrainer(prevTrainer => ({ 
                ...prevTrainer, 
                complaintsNumber: Number(prevTrainer.complaintsNumber) + 1
            }));

            setComplaint(complaintDefault);
        };

        const handleOnPostComplaintError = () => {
            setComplaintError(true);
        };

        postComplaintReq(
            postComplaint, 
            handleOnPostComplaintSuccess, 
            handleOnPostComplaintError, 
            t("sendingComplaint"), 
            t("successComplaint"), 
            t("errorComplaint")
        );
    }, [complaint.reason, complaintDefault, complaintError, id, postComplaintReq, t]);

    const handleOnRemoveComplaint = useCallback(async ID => {
        const userConfirmed = await confirm(t("removeConfirmComplaint"));
        
        if (userConfirmed) {
            const removeComplaint = () => {
                return api.delete(`/trainers/complaints/${ID}`);
            }
        
            const handleOnRemoveComplaintSuccess = () => {
                setComplaints(prevComplaints => prevComplaints.filter(c => String(c.ID) !== String(ID)));

                setTrainer(prevTrainer => ({ 
                    ...prevTrainer, 
                    complaintsNumber: Number(prevTrainer.complaintsNumber) - 1
                }));
            };

            removeComplaintReq(
                removeComplaint, 
                handleOnRemoveComplaintSuccess, 
                () => undefined, 
                t("loadingRemoveComplaint"), 
                t("successRemoveComplaint"), 
                t("errorRemoveComplaint")
            );
        }
    }, [confirm, removeComplaintReq, t]);

    const handleOnRemoveRating = useCallback(async (ID, removedRate) => {
        const userConfirmed = await confirm(t("removeConfirmRating"));
        
        if (userConfirmed) {
            const removeRating = () => {
                return api.delete(`/trainers/ratings/${ID}`);
            }
        
            const handleOnRemoveRatingSuccess = () => {
                setRatings(prevRatings => prevRatings.filter(r => String(r.ID) !== String(ID)));

                setTrainer(prevTrainer => ({ 
                    ...prevTrainer, 
                    ratesNumber: Number(prevTrainer.ratesNumber) - 1, 
                    rate: (Number(prevTrainer.rate) * Number(prevTrainer.ratesNumber) - Number(removedRate)) / Math.max(Number(prevTrainer.ratesNumber) - 1, 1)
                }));
            };

            removeRatingReq(
                removeRating, 
                handleOnRemoveRatingSuccess, 
                () => undefined, 
                t("loadingRemoveRating"), 
                t("successRemoveRating"), 
                t("errorRemoveRating")
            );
        }
    }, [confirm, removeRatingReq, t]);

    const handleOnPay = useCallback(async (ID) => {
        const formData = new FormData();

        formData.append("paymentPlanId", ID)

        const pay = () => {
            return api.post(`/payment`, formData);
        }
    
        const handleOnPaySuccess = (data) => {
            window.location.href = data.init_point;
        };

        payReq(
            pay, 
            handleOnPaySuccess, 
            () => undefined, 
            undefined, 
            undefined, 
            t("errorCreatePay")
        );
    }, [payReq, t]);
    
    useEffect(() => {
        document.title = t("trainer")
    }, [t]);

    return (
        <main>
            <BackButton/>

            <Stack
                gap="5em"
            >
                <Stack>
                    <Stack
                        className={styles.trainer_main_info_container}
                        justifyContent="start"
                        gap="0"
                    >
                        <Stack
                            className={styles.trainer_photo_background}
                            justifyContent="center"
                        >
                            <img
                                src={trainer.photoUrl || "/images/icons/user.png"}
                                alt=""
                            />
                        </Stack>

                        <Stack
                            className={styles.trainer_photo}
                        >
                            <PhotoInput
                                blobUrl={trainer.photoUrl}
                                disabled
                                size="large"
                            />
                        </Stack>

                        <Stack
                            className={styles.trainer_main_info}
                            justifyContent="center"
                        >
                            <Title
                                headingNumber={1}
                                text={trainer.name}
                                varColor="--theme-color"
                            />

                            <Stack>
                                {trainer.crefNumber && (
                                    <span>
                                        CREF {trainer.crefNumber}
                                    </span>
                                )}

                                <Stack
                                    direction="row"
                                    gap="0.5em"
                                    justifyContent="center"
                                >
                                    <ClickableIcon
                                        iconSrc="/images/icons/contracts.png"
                                        name={t("hirings")}
                                        hasTheme={false}
                                    />

                                    <span>
                                        {formatNumberShort(trainer.contractsNumber)}
                                    </span>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    <PaymentPlansContainer
                        paymentPlans={trainer.paymentPlans}
                        viewerIsClient
                        handlePayPaymentPlan={handleOnPay}
                    />
                </Stack>

                <RatingsContainer
                    ratings={ratings}
                    ratingsError={ratingsError}
                    ratingsOffset={ratingsOffset}
                    ratingsLoading={ratingsLoading}
                    handleLoadRatings={loadRatings}
                    trainerRate={trainer.rate}
                    trainerRatesNumber={trainer.ratesNumber}
                    viewerIsClient
                    handleLikeRating={handleOnLikeRating}
                    handleRemoveRating={handleOnRemoveRating}
                    rating={rating}
                    setRating={setRating}
                    setRatingError={setRatingError}
                    handleRating={handleOnRating}
                />

                <ComplaintsContainer
                    complaints={complaints}
                    complaintsError={complaintsError}
                    complaintsOffset={complaintsOffset}
                    complaintsLoading={complaintsLoading}
                    handleLoadComplaints={loadComplaints}
                    trainerComplaintsNumber={trainer.complaintsNumber}
                    viewerIsClient
                    handleLikeComplaint={handleOnLikeComplaint}
                    handleRemoveComplaint={handleOnRemoveComplaint}
                    complaint={complaint}
                    setComplaint={setComplaint}
                    setComplaintError={setComplaintError}
                    handleComplaint={handleOnComplaint}
                />

                {trainer.description && (
                    <Stack
                        className={styles.trainer_description}
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text={t("trainerDescription")}
                        />

                        <p>
                            {trainer.description}
                        </p>
                    </Stack>
                )}
            </Stack>
        </main>
    );
}

export default Trainer;