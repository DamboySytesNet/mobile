const Hours = require("~/common/dataTypes/EmployeeHours");

exports.testTeachers = [
    {
        name: 'Gabriela Omiecińska',
        room: 243,
        time: {
            day: "pt",
            from: "8.30",
            to: "9.00"
        },
        timeStr: "pt. 8:30 - 9.00"
    },
    {
        name: 'Marcin Kwapisz',
        room: 244,
        time: {
            day: "pn",
            from: "10.30",
            to: "11.30"
        },
        timeStr: "pn. 10:30 - 11.30"
    }
]