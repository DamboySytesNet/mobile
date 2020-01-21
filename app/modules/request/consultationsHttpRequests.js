const httpModule = require("tns-core-modules/http");

exports.add = (student_id, employee_id, hour_id, date, subject_id, state, token) => {
    return new Promise((revoke, reject) => {
        if (!student_id || !token || !employee_id || !hour_id || !date) {
            reject('Niepoprawne żądanie');
            return;
        }

        httpModule.request({
            url: `https://damboy.sytes.net/mk/addConsultations.php`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({
                student_id: student_id,
                employee_id: employee_id,
                hour_id: hour_id,
                date: date,
                subject_id: subject_id,
                state_id: state,
                token: token
            })
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(res.content);
                    if (json.status === 'success') {
                        const result = JSON.parse(json.msg);
                        revoke(result);
                    } else {
                        reject(json.msg)
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        })
    });
};
