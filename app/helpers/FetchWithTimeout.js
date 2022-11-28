import Constants from "../services/Constants";

export default function (url, options, timeout = Constants.DefaultTimeout) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}