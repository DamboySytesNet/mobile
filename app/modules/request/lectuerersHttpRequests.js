const httpModule = require("tns-core-modules/http");

exports.getLectuererSubjects = (lectuererId, token) => {
    return new Promise((revoke, reject) => {
        if(!token) {
            reject('Niepoprawne żądanie');
            return;
        }
        
        httpModule.request({
            url: `https://damboy.sytes.net/mk/getLecturerSubjects.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                user_id: lectuererId,
                token: token
            })
        }).then(res => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(res.content);
                    console.log(json);
                    if (json.status === 'success') {
                        const result = JSON.parse(json.msg);
                        console.log(result);
                        revoke(result);
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