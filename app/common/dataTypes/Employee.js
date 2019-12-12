exports.employee = class Employee {
    constructor(id, name, room, subjects, consultationTimes) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.subjects = subjects;
        this.consultationTimes = consultationTimes;
    }
}