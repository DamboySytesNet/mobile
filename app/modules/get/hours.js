const httpModule = require("tns-core-modules/http");

exports.get = (id) => {
    return new Promise((revoke, reject) => {
        if (!id) {
            reject('Niepoprawne żądanie');
            return;
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/getHours.php?user_id=${id}`,
            method: 'GET'
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        let result = JSON.parse(json.msg);
                        revoke(result);
                    } else {
                        console.log('hours.js: 0x04');
                        reject(json.msg);
                    }
                } catch(e) {
                    console.log('hours.js: 0x03');
                    reject('Server error...');
                }
            } else {
                console.log('hours.js: 0x02');
                reject('Server error...');
            }
        }, (e) => {
            console.log('hours.js: 0x01');
            reject('Server error...');
        });
    });
};