const httpModule = require("tns-core-modules/http");

exports.get = (id, token) => {
    return new Promise((revoke, reject) => {
        if(!id || !token) {
            reject('Niepoprawne żądanie');
            return;
        }  

        httpModule.request({
            url: `https://damboy.sytes.net/mk/getStudentConsultations.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                user_id: id,
                token: token
            })
        }).then( res => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(res.content);
                    console.log(json);
                    if (json.status === 'success') {
                        const result = JSON.parse(json.msg);
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