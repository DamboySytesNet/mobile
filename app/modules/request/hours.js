const httpModule = require("tns-core-modules/http");

exports.add = (user_id, room, day, timeFrom, timeTo, token) => {
    return new Promise((revoke, reject) => {
        if (!user_id || !token || !timeFrom || !timeTo) {
            reject('Niepoprawne żądanie');
            return;
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/addHours.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                user_id: user_id,
                room: room,
                day: day,
                timeFrom: timeFrom,
                timeTo: timeTo,
                token: token
            })
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke(json.msg);
                    } else {
                        console.log('hours.js: 0x34', json);
                        reject(json.msg);
                    }
                } catch(e) {
                    console.log('hours.js: 0x33');
                    reject('Server error...');
                }
            } else {
                console.log('hours.js: 0x32');
                reject('Server error...');
            }
        }, (e) => {
            console.log(e);
            console.log('hours.js: 0x31');
            reject('Server error...');
        });
    });
};

exports.get = (id, token) => {
    return new Promise((revoke, reject) => {
        if (!id || !token) {
            reject('Niepoprawne żądanie');
            return;
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/getHours.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                user_id: id,
                token: token
            })
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        let result = JSON.parse(json.msg);
                        revoke(result);
                    } else {
                        console.log('hours.js: 0x14', json);
                        reject(json.msg);
                    }
                } catch(e) {
                    console.log('hours.js: 0x13');
                    reject('Server error...');
                }
            } else {
                console.log('hours.js: 0x12');
                reject('Server error...');
            }
        }, (e) => {
            console.log(e);
            console.log('hours.js: 0x11');
            reject('Server error...');
        });
    });
};

exports.set = (id, room, day, timeFrom, timeTo, token) => {

}

exports.remove = (id, token) => {
    return new Promise((revoke, reject) => {
        if (!id || !token) {
            reject('Niepoprawne żądanie');
            return;
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/removeHours.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                id: id,
                token: token
            })
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke();
                    } else {
                        console.log('hours.js: 0x34', json);
                        reject(json.msg);
                    }
                } catch(e) {
                    console.log('hours.js: 0x33');
                    reject('Server error...');
                }
            } else {
                console.log('hours.js: 0x32');
                reject('Server error...');
            }
        }, (e) => {
            console.log(e);
            console.log('hours.js: 0x31');
            reject('Server error...');
        });
    });
};