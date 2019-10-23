const httpModule = require("tns-core-modules/http");

exports.login = (user) => {
    return new Promise((revoke, reject) => {
        if (user.username.trim() === '' ||
            user.password.trim() === '') {
            reject('Podaj login oraz hasło!');
            return;
        }

        httpModule.getString('https://damboy.sytes.net/mk/test.php')
            .then((data) => {
                revoke(data);
            }).catch(() => {
                reject('Server error...');
            });
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