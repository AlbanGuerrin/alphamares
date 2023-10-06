import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import usersReducer from "./users.reducer";

const combinedReducers = combineReducers({
    userReducer,
    usersReducer
})

export const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
      state = undefined; // Réinitialiser l'état à sa valeur initiale
    }
    return combinedReducers(state, action);
  };
  
 