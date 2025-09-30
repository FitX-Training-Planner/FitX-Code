export function ratingExample(
    ratingValue = 3,
    comment = "Esse é um comentário de uma avaliação",
    anonymousRater = false,
    likesNumber = 150
) {
    let rating = {
        "ID": 1,
        "raterID": 1,
        "rating": String(ratingValue),
        "comment": comment,
        "createDate": new Date(),
        "likesNumber": String(likesNumber),
        "hasLiked": null
    };

    rating["rater"] = 
        anonymousRater 
        ? null
        : {
            "name": "Paulo Henrique",
            "photoUrl": "/images/icons/chatbot2.png"
        };

    return rating
}

export function ratingsStatsExample(
    top3RatingsNumber = 3
) {
    let top3 = [];

    for (let i = 0; i < top3RatingsNumber; i++) {
        top3.push(
            ratingExample(
                4,
                undefined,
                undefined,
                200 - i * 50
            )
        );
    }

    let stats = {
        "top3": top3,
        "recentTop": ratingExample(5),
        "topHighestScore": ratingExample(5, undefined, undefined, 200),
        "topLowestScore": ratingExample(2, undefined, undefined, 130)
    }

    return stats;
}