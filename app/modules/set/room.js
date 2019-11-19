const httpModule = require("tns-core-modules/http");

exports.set = (id, room, token) => {
    return new Promise((revoke, reject) => {
        if (!id || !token) {
            reject('Niepoprawne żądanie');
            return;
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/setDefaultRoom.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                id: id,
                token: token,
                room: room
            })
        }).then((res) => {
            console.log(res.statusCode)
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke();
                    } else {
                        console.log('room.js: 0x04');
                        reject(json.msg);
                    }
                } catch(e) {
                    console.log('room.js: 0x03');
                    reject('Server error...');
                }
            } else {
                console.log('room.js: 0x02');
                reject('Server error...');
            }
        }, (e) => {
            console.log(e);
            console.log('room.js: 0x01');
            reject('Server error...');
        });
    });
};