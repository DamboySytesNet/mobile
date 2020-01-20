const httpModule = require("tns-core-modules/http");

exports.get = (id, token) => {
    return new Promise((revoke, reject) => {
        if (!id || !token) {
            reject("Niepoprawne żądanie");
            return;
        }

        httpModule
            .request({
                url: `https://damboy.sytes.net/mk/getLecturerConsultations.php`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    user_id: id,
                    token: token
                })
            })
            .then(res => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(res.content);
                        console.log(json);
                        if (json.status === "success") {
                            const result = JSON.parse(json.msg);
                            revoke(result);
                        } else {
                            console.log("Błąd");
                            reject(json.msg);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
    });
};

exports.setState = (
    user_id,
    student_id,
    consultation_id,
    state_id,
    excuse_id,
    token
) => {
    return new Promise((revoke, reject) => {
        if (
            !user_id ||
            !student_id ||
            !consultation_id ||
            !state_id ||
            !token
        ) {
            reject("Niepoprawne żądanie");
            return;
        }
        httpModule
            .request({
                url: `https://damboy.sytes.net/mk/setConsultationState.php`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    user_id,
                    student_id,
                    consultation_id,
                    state_id,
                    excuse_id,
                    token
                })
            })
            .then(res => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(res.content);
                        console.log("setState:" + res.content);
                        if (json.status === "success") {
                            revoke(json.msg);
                        } else {
                            console.log("Błąd");
                            reject(json.msg);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
    });
};

exports.getExcuses = (id, token) => {
    return new Promise((revoke, reject) => {
        if (!id || !token) {
            reject("Niepoprawne żądanie");
            return;
        }

        httpModule
            .request({
                url: `https://damboy.sytes.net/mk/getExcuses.php`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    user_id: id,
                    token: token
                })
            })
            .then(res => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(res.content);
                        console.log(json);
                        if (json.status === "success") {
                            const result = JSON.parse(json.msg);
                            revoke(result);
                        } else {
                            console.log("Błąd");
                            reject(json.msg);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
    });
};

exports.addExcuse = (user_id, excuse, token) => {
    return new Promise((revoke, reject) => {
        if (!user_id || !excuse || !token) {
            reject("Niepoprawne żądanie");
            return;
        }
        httpModule
            .request({
                url: `https://damboy.sytes.net/mk/addExcuse.php`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    user_id: user_id,
                    excuse: excuse,
                    token: token
                })
            })
            .then(res => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(res.content);
                        console.log(json);
                        if (json.status === "success") {
                            revoke(json.msg);
                        } else {
                            console.log("Błąd");
                            reject(json.msg);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
    });
};
