import api from "../../api/axios";

export async function verifyIsClient(request, user, navigate, notify) {
    if (!user.config.isClient) {
        navigate("/");
        
        notify("Essa página só pode ser acessada por usuários comuns.", "error");

        return false;
    }

    const getIsClient = () => {
        return api.post(`/is-client`);
    };

    const isClient = await new Promise((resolve) => {
        request(getIsClient, () => resolve(true), () => resolve(false));
    });

    return isClient;
};

export async function verifyIsTrainer(request, user, navigate, notify) {
    if (user.config.isClient) {
        navigate("/");
        
        notify("Essa página só pode ser acessada por treinadores.", "error");

        return false;
    }
    
    const getIsTrainer = () => {
        return api.post(`/is-trainer`);
    };

    
    const isTrainer = await new Promise((resolve) => {
        request(getIsTrainer, () => resolve(true), () => resolve(false));
    });

    return isTrainer;
};