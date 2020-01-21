const httpModule = require("tns-core-modules/http");

exports.get = (id, token) => {
    return new Promise((revoke, reject) => {
        if (!id || !token) {
            reject('Niepoprawne żądanie');
            return;
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/getStudentConsultations.php`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({
                user_id: id,
                token: token
            })
        }).then(res => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        const result = JSON.parse(json.msg);
                        revoke(result);
                    } else {
                        console.log('Błąd');
                        reject(json.msg)
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        })
    })
}

exports.delete = (id, user_id, token) => {
    return new Promise((revoke, reject) => {
        if (!id || !token) {
            reject('Niepoprawne żądanie!');
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/removeConsultations.php`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({
                id: id,
                user_id,
                token: token
            })
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke();
                    } else {
                        reject(json.msg);
                    }
                } catch (e) {
                    console.log(e);
                    reject('Server error...');
                }
            } else {
                reject('Server error...');
            }
        }), (e) => {
            console.log(e);
            reject('Server error...');
        }
    });
}
