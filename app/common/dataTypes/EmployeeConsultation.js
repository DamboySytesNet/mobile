const Consultation = require("~/common/dataTypes/Consultation");

exports.new = class eC extends Consultation.Cons {
    constructor(id, subject, teacher, studentId, student, room, date, state, excuse) {
        super(id, subject, null, teacher, room, date, state, excuse);

        this.studentId = studentId;
        this.student = student;
    }
}
