const httpModule = require('tns-core-modules/http');

exports.get = (token) => {
    return new Promise((revoke, reject) => {
        if(!token) {
            reject('Niepoprawne żądanie');
            return;
        }  

        httpModule.request({
            url: `https://damboy.sytes.net/mk/getSubjectsLecturers.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                token: token
            })
        }).then( res => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke(json.msg);
                    }
                    else {
                        console.log('Błąd');
                        reject(json.msg)
                    }
                }
                catch (e){
                    console.log(e);
                }
            }
        })
    })
}

exports.add = (user_id, token, subject_id) => {
    return new Promise((revoke, reject) => {
        if(!token || !user_id || !subject_id) {
            reject('Niepoprawne żądanie');
            return;
        } 

        httpModule.request({
            url: `https://damboy.sytes.net/mk/addLecturerSubject.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                user_id, user_id,
                token: token,
                subject_id: subject_id
            })
        }).then( res => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke(json.msg);
                    }
                    else {
                        console.log('Błąd');
                        reject(json.msg)
                    }
                }
                catch (e){
                    console.log(e);
                }
            }
        })
    })
}

exports.remove = (user_id, token, subject_id) => {
    return new Promise((revoke, reject) => {
        if(!token || !user_id || !subject_id) {
            reject('Niepoprawne żądanie');
            return;
        }  

        httpModule.request({
            url: `https://damboy.sytes.net/mk/removeLecturerSubject.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                user_id, user_id,
                token: token,
                subject_id: subject_id
            })
        }).then( res => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        revoke(json.msg);
                    }
                    else {
                        console.log('Błąd');
                        reject(json.msg)
                    }
                }
                catch (e){
                    console.log(e);
                }
            }
        })
    })
}