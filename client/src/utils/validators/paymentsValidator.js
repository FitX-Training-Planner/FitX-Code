
export function isPaymentPlanDurationValid(days) {
    return Number(days) >= 1 && Number(days) <= 365 * 2;
}

export function isPaymentPlanPriceValid(price) {
    const validNumber = price.replace(",", ".");

    return Number(validNumber) >= 9.99 && Number(validNumber) <= 50000.00;
}

export function isPaymentPlanBenefitDescriptionValid(description) {
    return description.length >= 5 && description.length <= 300;
}
