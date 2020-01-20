const Subject = require("~/common/dataTypes/Subject");

exports.new = class eS extends Subject.new {
    constructor(id, title, semester, employees, isOpen, height) {
        super(id, title, semester, employees);
        this.isOpen = isOpen;
        this.height = height;
    }
}