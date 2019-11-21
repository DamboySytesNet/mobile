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
            if (res.statusCode === 200) {
                try {
                    let json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke();
                    } else {
                        console.log('room.js: 0x24');
                        reject(json.msg);
                    }
                } catch(e) {
                    console.log('room.js: 0x23');
                    reject('Server error...');
                }
            } else {
                console.log('room.js: 0x22');
                reject('Server error...');
            }
        }, (e) => {
            console.log(e);
            console.log('room.js: 0x21');
            reject('Server error...');
        });
    });
};