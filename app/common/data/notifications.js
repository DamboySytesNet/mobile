const httpModule = require("tns-core-modules/http");
const u = require("./user");

const request = () => {
    httpModule
        .request({
            url: "https://damboy.sytes.net/mk/getNotifications.php",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            content: JSON.stringify({
                user_id: u.user.id,
                token: u.user.token,
                latest_id: u.user.notifications.latestId
            })
        })
        .then(
            res => {
                if (res.statusCode === 200) {
                    try {
                        let json = JSON.parse(res.content);
                        // console.log(res.content);

                        if (json.status === "success") {
                            // Append new notification to array (FILO)
                            const limit = json.msg.length - 1;
                            for (let i = limit; i >= 0; i--) {
                                u.user.notifications.data.unshift(json.msg[i]);
                                if (!json.msg[i].is_read)
                                    u.user.notifications.unread++;
                            }

                            // Set last id as most recent
                            u.user.notifications.latestId =
                                u.user.notifications.data.length > 0 ?
                                u.user.notifications.data[0].id :
                                0;
                        } else if (json.msg !== "No new notifications") {
                            console.log("notifications.js: 0x04");
                        }

                        u.user.notifications.interval = setTimeout(() => {
                            request();
                        }, 1000);
                    } catch (e) {
                        console.log("notifications.js: 0x03", e);
                    }
                } else {
                    console.log("notifications.js: 0x02");
                }
            },
            e => {
                console.log("notifications.js: 0x01");
            }
        );
};

exports.request = request;

const read = () => {
    JSON.stringify({
        user_id: u.user.id,
        token: u.user.token,
        latest_id: u.user.notifications.latestId
    });

    httpModule
        .request({
            url: "https://damboy.sytes.net/mk/setNotificationState.php",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            content: JSON.stringify({
                user_id: u.user.id,
                token: u.user.token,
                latest_id: u.user.notifications.latestId
            })
        })
        .then(
            res => {
                if (res.statusCode === 200) {
                    try {
                        let json = JSON.parse(res.content);

                        if (json.status === "success") {
                            for (let notification of u.user.notifications
                                    .data) {
                                if (
                                    notification.id <=
                                    u.user.notifications.latestId &&
                                    !notification.is_read
                                ) {
                                    notification.is_read = true;
                                    u.user.notifications.unread--;
                                }
                            }
                        } else {
                            console.log("notifications.js: 0x05");
                        }
                    } catch (e) {
                        console.log("notifications.js: 0x06", e);
                    }
                } else {
                    console.log("notifications.js: 0x07");
                }
            },
            e => {
                console.log("notifications.js: 0x08");
            }
        );
};

exports.read = read;
