
exports.login = (user) => {
    return new Promise((revoke, reject) => {
        if (user.username.trim() === '' ||
            user.password.trim() === '') {
            reject('Podaj login oraz hasło!');
            return;
        }

        if (user.username === '216000') {
            revoke('ok');
        } else {
            reject('bad index');
        }
    });
}

exports.forgotPassword = (newUser) => {
    return new Promise((revoke, reject) => {
        if (newUser.username.length === 6) {
            revoke('ok');
        } else {
            reject('bad index');
        }
    });
}