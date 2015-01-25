// This file is part of MusicBrainz, the open internet music database.
// Copyright (C) 2015 MetaBrainz Foundation
// Licensed under the GPL version 2, or (at your option) any later version:
// http://www.gnu.org/licenses/gpl-2.0.txt

function empty(value) {
    return value === null || value === undefined || value === "";
}

var daysInMonth = {
    "true":  [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    "false": [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
};

var numberRegex = /^[0-9]+$/;

function parseNumber(num) {
    return numberRegex.test(num) ? parseInt(num, 10) : NaN;
}

exports.isDateValid = function (y, m, d) {
    y = empty(y) ? null : parseNumber(y);
    m = empty(m) ? null : parseNumber(m);
    d = empty(d) ? null : parseNumber(d);

    // We couldn't parse one of the fields as a number.
    if (isNaN(y) || isNaN(m) || isNaN(d)) return false;

    // The year is a number less than 1.
    if (y !== null && y < 1) return false;

    // The month is a number less than 1 or greater than 12.
    if (m !== null && (m < 1 || m > 12)) return false;

    // The day is empty. There's no further validation we can do.
    if (d === null) return true;

    var isLeapYear = y % 400 ? (y % 100 ? !(y % 4) : false) : true;

    // Invalid number of days based on the year.
    if (d < 1 || d > 31 || d > daysInMonth[isLeapYear.toString()][m]) return false;

    // The date is assumed to be valid.
    return true;
};

exports.isDatePeriodValid = function (a, b) {
    var y1 = a.year, m1 = a.month, d1 = a.day;
    var y2 = b.year, m2 = b.month, d2 = b.day;

    if (!exports.isDateValid(y1, m1, d1) || !exports.isDateValid(y2, m2, d2)) {
        return false;
    }

    if (!y1 || !y2 || +y1 < +y2) return true; else if (+y2 < +y1) return false;
    if (!m1 || !m2 || +m1 < +m2) return true; else if (+m2 < +m1) return false;
    if (!d1 || !d2 || +d1 < +d2) return true; else if (+d2 < +d1) return false;

    return true;
};

var dateRegex = /^(\d{4}|\?{4})(?:-(\d{2}|\?{2})(?:-(\d{2}|\?{2}))?)?$/;

exports.parseDate = function (str) {
    var match = str.match(dateRegex) || [];
    return {
        year: parseInt(match[1], 10) || null,
        month: parseInt(match[2], 10) || null,
        day: parseInt(match[3], 10) || null
    };
};

exports.formatDate = function (date) {
    var y = ko.unwrap(date.year);
    var m = ko.unwrap(date.month);
    var d = ko.unwrap(date.day);

    return (
        (!empty(y) ? (y < 0 ? "-" + _.str.pad(-y, 3, "0") : _.str.pad(y, 4, "0"))
                   : (m || d ? "????" : "")) +
        (m ? "-" + _.str.pad(m, 2, "0") : (d ? "-??" : "")) +
        (d ? "-" + _.str.pad(d, 2, "0") : "")
    );
};

exports.formatDatePeriod = function (period) {
    var beginDate = exports.formatDate(period.beginDate);
    var endDate = exports.formatDate(period.endDate);
    var ended = ko.unwrap(period.ended);

    if (!beginDate && !endDate) {
        return "";
    }

    if (beginDate === endDate) {
        return beginDate;
    }

    return beginDate + " \u2013 " + (endDate || (ended ? "????" : ""));
};
