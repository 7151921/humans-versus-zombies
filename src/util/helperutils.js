import poolData from "../components/Cognito/CognitoClient";
import axios from "axios";
import moment from "moment";
import {withStyles} from "@mui/styles";
import Typography from "@mui/material/Typography";

export function formatPhoneNumber(phoneData) {
    return phoneData?.phone ?? "";
}

export function getPhoneInstructions(phoneData) {
    if (phoneData == null) {
        return "";
    }
    return phoneData?.instructions ?? "";
}

export function getMissingFormFields(body) {
    let missingData = []
    Object.keys(body).forEach(key => {
        let value = body[key];
        if (!value) {
            missingData.push(key)
        }
    });
    return missingData;
}

export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function getResponse(data) {
    return getResponseByKey(data, 'response');
}

export function getErrorField(data) {
    return getResponseByKey(data, 'field');
}

export function isHttpError(data) {
    const status = getResponseByKey(data, 'status');
    return  status === 500 || status === 400
}

function getResponseByKey(data, key) {
    if (!data || !data.data ) {
        return;
    }
    const response = JSON.parse(data.data)
    if (!response) {
        return;
    }
    return response[key]
}


export function isPlayerLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        clearLocalStorage();
        return false;
    }
    const storedData = JSON.parse(accessToken);
    if (!storedData) {
        return false;
    }
    const currentTime = Date.now();
    const expireTime = storedData.timestamp + 1000 * 60 * 59; // 1 hour
    if (currentTime > expireTime) {
        clearLocalStorage();
        return false;
    }
    return true;
}

export function getUsername() {
    const usernameFromLocalStorage = localStorage.getItem('username');
    return usernameFromLocalStorage ? JSON.parse(usernameFromLocalStorage).value : '';
}

export function getName() {
    const nameFromLocalStorage = localStorage.getItem('playerData');
    return JSON.parse(nameFromLocalStorage)?.value?.name ?? '';
}

export function handleLogout(e, navigate){
    e.preventDefault();
    handleClearSession(e, navigate)
}

function clearLocalStorage() {
    for (const key in localStorage) {
        if (key !== 'registration_open') {
            localStorage.removeItem(key);
        }
    }
}

export function handleClearSession(e, navigate){
    e.preventDefault();
    signOutAsync(poolData.getCurrentUser()).then(r => {
        clearLocalStorage();
        navigate('/')
    })
}

function signOutAsync(cognitoUser) {
    return new Promise((resolve, reject) => {
        cognitoUser.signOut((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export const checkPasswordRequirements = password => {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharacterRegex = /[!@#$%^&*]/;

    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long.' };
    } else if (!password.match(lowercaseRegex)) {
        return { isValid: false, error: 'Password must contain at least one lowercase letter.' };
    } else if (!password.match(uppercaseRegex)) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter.' };
    } else if (!password.match(numberRegex)) {
        return { isValid: false, error: 'Password must contain at least one number.' };
    } else if (!password.match(specialCharacterRegex)) {
        return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*).' };
    } else {
        return { isValid: true, error: '' };
    }
};

export function formatDuration(duration) {
    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerHour = 60 * millisecondsPerMinute;
    const millisecondsPerDay = 24 * millisecondsPerHour;

    const days = Math.floor(duration / millisecondsPerDay);
    duration -= days * millisecondsPerDay;

    const hours = Math.floor(duration / millisecondsPerHour);
    duration -= hours * millisecondsPerHour;

    const minutes = Math.floor(duration / millisecondsPerMinute);

    let durationString = '';

    if (days > 0) {
        durationString += `${days} day${days > 1 ? 's' : ''}, `;
    }

    if (hours > 0) {
        durationString += `${hours} hour${hours > 1 ? 's' : ''}, `;
    }

    if (minutes > 0) {
        durationString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    if (!durationString) {
        durationString = '0 minutes';
    }

    return durationString;
}

export function formatSimpleDuration(durationMs) {
    const seconds = Math.floor(durationMs / 1000) % 60;
    const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
    const hours = Math.floor(durationMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
}

export function isModerator() {
    const playerData = JSON.parse(localStorage.getItem("playerData"))?.value;
    return playerData?.role === "HEAD_MOD" || playerData?.role === "MODERATOR" ;
}

export const formatDate = (dateString) => {
    if (!dateString) {
        return ""
    }
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

function fetchGameData() {
    return new Promise((resolve, reject) => {
        const api = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });
        api
            .get("/list-games")
            .then((res) => {
                const gameList = res.data;
                const activeGame = gameList.find((item) => item.active === true);
                resolve({ gameList: gameList, activeGame: activeGame });
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export async function getGameData() {
    try {
        const { gameList, activeGame } = await fetchGameData();
        return { gameList, activeGame }
    } catch (error) {
        console.log(error);
    }
}

export function apiWithHeader(navigate) {
    if (!isPlayerLoggedIn()) {
        navigate('/sign-in')
        return null;
    }

    const token = JSON.parse(localStorage.getItem("accessToken"))?.value;
    return axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const timeZoneOptions = {
    "EST": { timeZone: 'America/New_York', timeZoneName: 'short' },
    "CST": { timeZone: 'America/Chicago', timeZoneName: 'short' },
    "MST": { timeZone: 'America/Denver', timeZoneName: 'short' },
    "MST (no DST)": { timeZone: 'America/Phoenix', timeZoneName: 'short' },
    "PST": { timeZone: 'America/Los_Angeles', timeZoneName: 'short' },
    "AKST": { timeZone: 'America/Anchorage', timeZoneName: 'short' },
    "HAST": { timeZone: 'Pacific/Honolulu', timeZoneName: 'short' }
};

export function epocToCurrentLocationTimeZone(epoch) {
    return utcToCurrentLocationTimeZone(new Date(epoch))
}

export function utcToCurrentLocationTimeZone(date) {
    if (!date) {
        return
    }
    const clearUTCDate = moment(date).utcOffset(0, true).format();
    const utcMoment = moment.utc(clearUTCDate);
    const cstMoment = utcMoment.tz(timeZoneOptions[process.env.REACT_APP_TIME_ZONE].timeZone);
    return cstMoment.format('YYYY-MM-DDTHH:mm');
}

export async function fetchExtraPlayerInfo(uuid) {
    console.log(uuid)
    const api = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
    });

    return new Promise((resolve, reject) => {
        api.get(`/player-by-id?id=${uuid}`)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                console.log(err)
                reject(err);
            });
    });
}


export async function fetchExtraPlayerModeratorInfo(uuid, navigate) {
    const api = apiWithHeader(navigate)
    if (api === null || !uuid) {
        return
    }

    return new Promise((resolve, reject) => {
        api.get(`/player-by-id-moderator?id=${uuid}`)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                console.log(err)
                reject(err);
            });
    });
}

export const WhiteTextTypography = withStyles({
    root: {
        // color: "#e4e2de"
    }
})(Typography);

