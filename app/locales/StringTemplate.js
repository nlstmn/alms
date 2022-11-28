
export const template = function (string, vars) {
    return new Function("return `" + string + "`;").call(vars)
}