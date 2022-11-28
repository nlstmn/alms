import Constants from "../services/Constants";

export function isUserStudent(userIdentity) {
    return userIdentity.userType === Constants.UserTypes.Student
}

export function isUserInstructor(userIdentity) {
    return userIdentity.userType === Constants.UserTypes.Instructor
}