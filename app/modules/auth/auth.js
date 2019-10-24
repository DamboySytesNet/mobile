const httpModule = require("tns-core-modules/http");

exports.login = (user) => {
    return new Promise((revoke, reject) => {
        let username = user.username.trim();
        let password = user.password.trim();
        if (username === '' || password === '') {
            reject('Podaj login oraz hasło!');
            return;
        }

        httpModule.request({
            url: 'https://damboy.sytes.net/mk/auth.php',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                username: username,
                password: password
            })
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        let result = JSON.parse(json.msg);
                        revoke(result);
                    } else {
                        console.log('auth.js: 0x04');
                        reject(json.msg);
                    }
                } catch(e) {
                    console.log('auth.js: 0x03');
                    reject('Server error...');
                }
            } else {
                console.log('auth.js: 0x02');
                reject('Server error...');
            }
        }, (e) => {
            console.log('auth.js: 0x01');
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