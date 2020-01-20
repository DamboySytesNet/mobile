exports.Cons = class Consultation {
    constructor(id, subject, teacherId, teacher, room, date, state, excuse) {
        this.id = id;
        this.subject = subject;
        this.teacherId = teacherId;
        this.teacher = teacher;
        this.room = room;
        // this.date = date;
        this.date = new Date(date);
        this.state = state;
        this.excuse = excuse;

        this.timeStr = this.getTimeStr();
        this.dayOfTheYear = this.getDayOfTheYear();
        this.dateStr = this.getDateStr();

    }

    getDayOfTheYear() {
        let now = new Date();
        let start;
        if (now.getMonth() >= 9) {
            start = new Date(now.getFullYear(), 9, 1);
        } else {
            start = new Date(now.getFullYear() - 1, 9, 1);
        }
        var diff = this.date - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var dayOfTheYear = Math.floor(diff / oneDay);

        return dayOfTheYear;
    }

    getTimeStr() {
        let hour = this.date.getHours();
        let minute = this.date.getMinutes();

        let timeStr;
        if (hour < 10) {
            timeStr = `0${hour}`;
        } else {
            timeStr = `${hour}`;
        }

        if (minute < 10) {
            timeStr += `:0${minute}`;
        } else {
            timeStr += `:${minute}`;
        }

        return timeStr;

    }

    getDateStr() {
        let day = this.date.getDate();
        let month = this.date.getMonth() + 1;

        if (day < 10) {
            day = `0${day}`;
        }

        if (month < 10) {
            month = `0${month}`;
        }

        return `${day}.${month}.${this.date.getYear() + 1900}`;
    }
};
