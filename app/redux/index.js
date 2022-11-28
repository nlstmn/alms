import { combineReducers } from 'redux';
import configureStore from './CreateStore';
import rootSaga from '../sagas/';

import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import { seamlessImmutableReconciler, seamlessImmutableTransformCreator } from 'redux-persist-seamless-immutable'

const transformerConfig = {
    whitelistPerReducer: {},
    blacklistPerReducer: {}
}

const persistConfig = {
    key: 'root',
    timeout: 0, // Getting error when debugger active, so timeout set disabled.
    storage: AsyncStorage,
    // blacklist: ['main', 'courses', 'classes'],
    whitelist: ['announcement'],
    stateReconciler: seamlessImmutableReconciler,
    transforms: [seamlessImmutableTransformCreator(transformerConfig)]
}

    /* ------------- Assemble The Reducers ------------- */
const appReducer = combineReducers({
    organizations: require('./OrganizationRedux').reducer,
    login: require('./LoginRedux').reducer,
    announcement: require('./AnnouncementRedux').reducer,
    courses: require('./CoursesRedux').reducer,
    courseDetail: require('./CourseDetailRedux').reducer,
    schedule: require('./ScheduleRedux').reducer,
    messages: require('./MessagesRedux').reducer,
    menu: require('./MenuRedux').reducer,
    main: require('./MainRedux').reducer,
    addActivity: require('./AddActivityRedux').reducer,
    settings: require('./SettingsRedux').reducer,
    activityInteract: require('./ActivityInteractRedux').reducer,
    loader: require('./LoaderRedux').reducer
})
const rootReducer = (state, action) => { //Clear state data when user logout 
    if (action.type === 'CLEAR_REDUX')
        state = undefined
    return appReducer(state, action)
}
const persistedReducer = persistReducer(persistConfig, rootReducer)


export const reduxStore = configureStore(persistedReducer, rootSaga)
export const persistor = persistStore(reduxStore)


