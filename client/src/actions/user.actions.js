import axios from "axios";

export const GET_USER = "GET_USER";
export const UPDATE_PROFILE = "UPDATE_PROFIL";

export const getUser = (uid) => {
    return (dispatch) => {  // dispatch = ce qu'on envoie au reducer
        return axios
            .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
            .then((res) => {
                dispatch({type: GET_USER, payload: res.data});
            }) 
            .catch((err) => console.log(err));
    } 
}

export const updateProfil = (uid, user) => {
    return (dispatch) => {  
        return axios
            .put(`${process.env.REACT_APP_API_URL}api/user/${uid}`, user)
            .then((res) => {
                dispatch({type: UPDATE_PROFILE, payload: user});
                console.log(res);
            }) 
            .catch((err) => console.log(err));
    } 
}