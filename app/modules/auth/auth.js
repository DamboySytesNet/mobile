
exports.login = (user) => {
    return new Promise((revoke, reject) => {
        if (user.username === '216000') {
            revoke('ok');
        } else {
            reject('bad index');
        }
    });
}

exports.register = (newUser) => {
    return new Promise((revoke, reject) => {
        if (newUser.username.length === 6) {
            revoke('ok');
        } else {
            reject('bad index');
        }
    });
}