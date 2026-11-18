import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

export const getFeed = async () => {
    const response = await API.get("/feed");
    return response.data;
};

export const swipeProfile = async (profileId, action) => {
    const response = await API.post("/swipe", {
        profileId,
        action
    });

    return response.data;
};

export const getMatches = async () => {
    const response = await API.get("/matches");
    return response.data;
};