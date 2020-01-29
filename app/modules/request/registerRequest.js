const httpModule = require("tns-core-modules/http");

exports.add = (email, name, surname, password) => {
    return new Promise((revoke, reject) => {
        httpModule.request({
            url: `https://damboy.sytes.net/mk/register.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                email: email,
                name: name,
                surname: surname,
                password, password
            })
        }).then((res) => {
            if(res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke();
                    } else {
                        reject(json.msg);
                    }
                } catch(e) {
                    reject('Server error...');
                }
            } else {
                reject('Server error...');
            }
        }, (e) => {
            reject('Server error...');
        })
    })
}