
export function containsUpperLower(password) {
    return password !== password.toLowerCase() && password !== password.toUpperCase()
}

export function passwordLongEnought(password) {
    return password.length > 5
}

export function containsNumber(password) {
    return /\d/.test(password)
}

export function isPasswordValid(password) {
    return containsUpperLower(password) && passwordLongEnought(password) && containsNumber(password)
}

export function bothPasswordSame(password, confirmPassword) {
    return password === confirmPassword && isPasswordValid(password)
}