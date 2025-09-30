export function complaintExample(
    reason = "Esse é um motivo de uma denúncia",
    anonymousComplainter = false,
    likesNumber = 150
) {
    let complaint = {
        "ID": 1,
        "complainterID": 1,
        "reason": reason,
        "createDate": new Date(),
        "likesNumber": String(likesNumber),
        "hasLiked": null
    };

    complaint["complainter"] = 
        anonymousComplainter 
        ? null
        : {
            "name": "Paulo Henrique",
            "photoUrl": "/images/icons/chatbot2.png"
        };

    return complaint;
}

export function complaintsStatsExample(
    top3ComplaintsNumber = 3
) {
    let top3 = [];

    for (let i = 0; i < top3ComplaintsNumber; i++) {
        top3.push(
            complaintExample(
                undefined,
                undefined,
                200 - i * 50
            )
        );
    }

    let stats = {
        "top3": top3,
        "recentTop": complaintExample(),
    }

    return stats;
}
