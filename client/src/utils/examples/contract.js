export function contractExample(
    status = "Ativo",
    hasCanceledOrRescinded = true,
    isClient = false,
    transactionAmount = 400.00
) {
    let contract = {
        "ID": 1,
        "startDate": new Date(),        
        "endDate": new Date(),
        "status": {
            "ID": 1,
            "name": status
        },      
        "canceledOrRescindedDate": hasCanceledOrRescinded ? new Date() : null,
        "paymentPlan": {
            "ID": 1,
            "name": "Treinamento Bom Demais"
        },
        "paymentTransaction": {
            "ID": 1,
            "amount": String(transactionAmount),
            "appFee": (transactionAmount * (5 / 100)).toFixed(2),
            "paymentMethod": "pix",
            "createDate": new Date(),
            "mercadopagoTransactionID": "1234567890",
            "receiptUrl": "https://fantasia.mercadopago.com/pagamentos/avvdytauiivyuzuvuavvusvusu/comprovante"
        }
    }

    if (isClient) {
        contract["trainer"] = {
            "ID": 1,
            "name": "Paulo Treinador",
            "photoUrl": "/images/icons/chatbot2.png"
        };   
    } else {
        contract["client"] = {
            "ID": 1,
            "name": "Paulo Treinador",
            "photoUrl": "/images/icons/chatbot2.png"
        };

        contract["paymentTransaction"]["mpFee"] = String((transactionAmount * (5 / 100)).toFixed(2));

        contract["paymentTransaction"]["trainerReceived"] = String(transactionAmount - Number(((transactionAmount * (5 / 100)).toFixed(2)) * 2));
    }

    return contract;
}

export function contractsStatsExample(
    isContractsPaused = false
) {
    return {
        "counts": {
            "actives": 20,
            "expiredsInLast180Days": 32,
            "canceledsInLast180Days": 2,
            "rescindedsInLast180Days": 0,
            "totalInLast180Days": 55
        },
        "lastNotActive": contractExample(),
        "lastActive": contractExample(),
        "nextToExpire": contractExample(),
        "lastToExpire": contractExample(),
        "isContractsPaused": isContractsPaused,
        "maxActiveContracts": 30 
    }
}