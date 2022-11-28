import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';


const { Types, Creators } = createActions({
    setMainLoader: ['value']
})

export const LoaderTypes = Types
export default Creators


export const INITIAL_STATE = Immutable({
    mainLoader: false
})

export const setMainLoader = (state, action) => {
    return state.merge({ mainLoader: action.value })
}


export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_MAIN_LOADER]: setMainLoader

})