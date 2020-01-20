const httpModule = require("tns-core-modules/http");

exports.get = (token) => {
    return new Promise((revoke, reject) => {
        if(!token) {
            reject('Niepoprawne żądanie');
            return;
        }  

        httpModule.request({
            url: `https://damboy.sytes.net/mk/getAllHours.php`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            content: JSON.stringify({
                token: token
            })
        }).then( res => {
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
                        // console.log('Błąd');
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