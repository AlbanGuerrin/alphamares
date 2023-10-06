import { GET_USER, UPDATE_PROFILE } from "../actions/user.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch(action.type){
        case GET_USER:
            return action.payload; // On envoie toute la data de GET USER au store
        case UPDATE_PROFILE:
            return {
                ...state,
                profil: action.payload
            }
        default:
            return state;
    }
}