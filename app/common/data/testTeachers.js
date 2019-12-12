const Employee = require('~/common/dataTypes/Employee');
const Hours = require('~/common/dataTypes/Hours');

exports.testTeachers = [
    new Employee.employee(1, "Gabriela Omiecińska", 243, ["Podstawy programowania"], [new Hours.new(1, "10:30", "11:30", "Poniedziałek", 243), new Hours.new(2, "10:30", "11:30", "Wtorek", 243)]),
    new Employee.employee(2, "Marcin Kwapisz", 244, ["Programowanie obiektowe", "Programowanie komponentowe"], [new Hours.new(3, "12:45", "13:30", "Czwartek", 244)]),
]
