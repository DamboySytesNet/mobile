
exports.login = (user) => {
    return new Promise((revoke, reject) => {
        if (user.username.trim() === '' ||
            user.password.trim() === '') {
            reject('Podaj login oraz hasło!');
            return;
        }

        if (user.username === '216000') {
            revoke(1);
        } else {
            reject('bad index');
        }
    });
}

exports.forgotPassword = (email) => {
    return new Promise((revoke, reject) => {
        if (email.trim() === '') {
            reject('Podaj e-mail!');
            return;
        }
        
         revoke(email);
    });
}