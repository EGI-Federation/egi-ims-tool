import i18n from '@/locales'


// Check if an instance is valid
export const isValid = function(t) {
    return (t === undefined || t === null) ? false : true;
}

// Check if API call was successful, if not show error in a toast
// You can pass an array of { statusCode, redirectToUrl } to redirect on error
export const isSuccess = function(t, apiResult, redirectOnError) {
    if(isValid(apiResult.error?.value)) {

        if(isValid(redirectOnError)) {
            for(const statusRedirect of redirectOnError) {
                if(statusRedirect.statusCode === apiResult.error?.value.status) {
                    t.$router.push(statusRedirect.redirectToUrl);
                    return false;
                }
            }
        }

        let message = isValid(apiResult.error.value.data?.description) ?
            apiResult.error.value.data.description :
            apiResult.error.value.message;
        t.$root.$refs.toasts.showError(t.$t('ims.error'), message);
        return false;
    }

    return true;
}

// Compare strings that were missing, with ones that were edited but left empty
export const strEqual = function(text1, text2) {
    if(!isValid(text1) && "" === text2)
        return true;
    if(!isValid(text2) && "" === text1)
        return true;

    return text1 === text2;
}

// Make the first character of a string uppercase
export const strCapitalize = function(text) {
    if(isValid(text) && text.length > 0)
        return text.charAt(0).toUpperCase() + text.slice(1);

    return text;
}

// Create an enum from a list of values
// Use it like this:
//      const Colors = makeEnum(["red","green","blue"]);
//      let startColor = Colors.RED;
export const makeEnum = function(values) {
    let obj = Object.create(null);
    for(let val of values)
        obj[val.replace("-", "_").toUpperCase()] = Symbol(val);

    return Object.freeze(obj);
}

// Entity statuses
export const Status = makeEnum(['DRAFT', 'READY_FOR_APPROVAL', 'APPROVED', 'IMPLEMENTED', 'DEPRECATED']);

// Get localized label and class for a status
export const statusPill = function(status, t) {

    if(!isValid(status))
        return { label: "", pillClass: "" };

    if(Status.READY_FOR_APPROVAL.description === status)
        return { label: t("ims.statusReadyForApproval"), pillClass: "badge rounded-pill bg-info" };
    else if(Status.APPROVED.description === status)
        return { label: t("ims.statusApproved"), pillClass: "badge rounded-pill bg-success" };
    else if(Status.IMPLEMENTED.description === status)
        return { label: t("ims.statusImplemented"), pillClass: "badge rounded-pill bg-success" };
    else if(Status.DEPRECATED.description === status)
        return { label: t("ims.statusDeprecated"), pillClass: "badge rounded-pill bg-danger" };

    return { label: t("ims.statusDraft"), pillClass: "badge bg-secondary" };
}


// Check if a date is in a leap year
export const isLeapYear = function(someDate) {
    const year = someDate.getFullYear();
    if((year & 3) != 0)
        return false;

    return ((year % 100) != 0 || (year % 400) == 0);
};

// Get day of the year (January 1st is 1)
export const getDayOfYear = function(someDate) {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const mn = someDate.getMonth();
    const dn = someDate.getDate();
    let dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && isLeapYear(someDate))
        dayOfYear++;

    return dayOfYear;
};

// Returns the ISO week number
// Source: https://weeknumber.net/how-to/javascript
export const getWeek = function(someDate) {
    let date = new Date(someDate.getTime());
    date.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

    // January 4 is always in week 1
    let week1 = new Date(date.getFullYear(), 0, 4);

    // Adjust to Thursday in week 1 and count number of weeks from date to week1
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the day of the week, 0 is Monday
export const getDayOfWeek = function(someDate) {
    let dow= new Date(someDate.getTime()).getDay();
    if(0 === dow)
        dow = 6;
    else
        dow--;

    return dow;
}

// Format a date and time as a string
// If the date is in the current year, omit the year
export const formatTime = function(someDateTime) {

    if(!isValid(someDateTime))
        return " ";

    // Check if we got a Date
    let d = someDateTime;
    if(Object.prototype.toString.call(someDateTime) !== '[object Date]')
        d = new Date(someDateTime.toString());

    let options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        day: 'numeric',
        month: 'long',
    };

    const today  = new Date();
    if(today.getFullYear() !== d.getFullYear())
        options.year = 'numeric';

    const formattedDate = d.toLocaleDateString(i18n.global.locale, options);
    return formattedDate;
}

// Format a date as a string
// Unit controls the granularity ('day', 'month', or 'year')
// If the date is in the current year and granularity is finer than 'year', omit the year
export const formatDate = function(someDate, unit = 'day') {

    if(!isValid(someDate))
        return " ";

    // Check if we got a Date
    let d = someDate;
    if(Object.prototype.toString.call(someDate) !== '[object Date]')
        d = new Date(someDate.toString());

    const today  = new Date();
    let formattedDate = null;
    let options = {};
    switch(unit) {
        case 'day':
            options.day = 'numeric';
            options.month = 'long';
            if(today.getFullYear() !== d.getFullYear())
                options.year = 'numeric';
            formattedDate = d.toLocaleDateString(i18n.global.locale, options);
            break;

        case 'month':
            options.month = 'long';
            if(today.getFullYear() !== d.getFullYear())
                options.year = 'numeric';
            formattedDate = d.toLocaleDateString(i18n.global.locale, options);
            break;

        default:
            formattedDate = d.getFullYear();
            break;
    }

    return formattedDate;
}

// Return formatted texts for the frequency and next occurrence of an event
export const formatNextEvent = function(frequency, unit, nextEvent, t) {

    let f = t('ims.notSet');
    if(frequency === 1) {
        f = `${t('ims.every')} `;
        switch(unit) {
            case 'day': f += t('ims.day'); break;
            case 'month': f += t('ims.month'); break;
            default: f+= t('ims.year'); break;
        }
    }
    else if(frequency > 1) {
        f = `${t('ims.every')} ${frequency} `;
        switch(unit) {
            case 'day':
                f += t('ims.days').toLowerCase();
                break;
            case 'month':
                f += t('ims.months').toLowerCase();
                break;
            default:
                f += t('ims.years').toLowerCase();
                break;
        }
    }

    let w = t('ims.notSet');
    if(isValid(nextEvent)) {
        const next = new Date(nextEvent);
        w = formatDate(next, unit);
    }

    return { frequency: f, when: w };
}

// Reusable sort function, allows sorting by any field and even
// convert the fields before comparison for sort. Use it like this:
//      someArray.sort(sortBy('name', true));
//      someArray.sort(sortBy('price', true, parseInt));
export const sortBy = function(field, reverse, primer) {
    const key = primer ?
        function(x) { return primer(x[field]); } :
        function(x) { return x[field]; };

    reverse = !reverse ? 1 : -1;

    return function(a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

// Format string. Use it like this:
//      formatString("This {0} is a {1}", "a", "test");
export const formatString = function(format) {
    let args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
}

// Find entity with a specific status
// Parameter current is a Version<T> where T has a history field
// Returns Version<T> or null if no entity with specified status
export const findEntityWithStatus = function(current, status) {
    if(isValid(current)) {
        if(status === current.status)
            return current;

        // Attempt to find the latest version with specified status
        // Note: This assumes the history is sorted descending by version (should be same as sorted by changedOn)
        const history = current.history;
        if(isValid(history) && isValid(history.versions)) {
            for(let version of history.versions) {
                if(status === version.status)
                    return version;
            }
        }
    }

    return null;
}

// Find entity with a specific version
// Parameter current is a Version<T> where T has a history field
// Returns Version<T> or null if no entity with specified version
export const findEntityWithVersion = function(current, ver) {
    if(isValid(current)) {
        if(ver === current.version.toString())
            return current;

        // Attempt to find specified version
        const history = current.history;
        if(isValid(history) && isValid(history.versions)) {
            for(let version of history.versions) {
                if(ver === version.version.toString())
                    return version;
            }
        }
    }

    return null;
}

// Create a deep clone of an object
//
// Note on keys in Sets and Maps: these are often primitives (in which case no problem to clone), but they
// can also be objects. In that case the question becomes: should those keys be cloned?
// One could argue that this should be done, so that if those objects are mutated in the copy, the objects
// in the original are not affected, and vice versa.
// On the other hand one would want that if a Set/Map has a key, this should be true in both the original
// and the copy -- at least before any change is made to either of them. It would be strange if the copy would
// be a Set/Map that has keys that never occurred before (as they were created during the cloning process):
// surely that is not very useful for any code that needs to know whether a given object is a key in that Set/Map.
// Therefore, the keys of Sets and Maps are values (maybe references) that should remain the same.
export const deepClone = function(obj, hash = new WeakMap()) {
    if(!isValid(obj))
        return null;

    if(Object(obj) !== obj)
        // Primitives
        return obj;

    if(hash.has(obj))
        // Cyclic reference
        return hash.get(obj);

    const result =
          obj instanceof Set ? new Set(obj)
        : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) => [key, deepClone(val, hash)]))
        : obj instanceof Date ? new Date(obj)
        : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
        : typeof obj === 'function' ? obj
        // ... add here any specific treatment for other classes ...
        : obj.constructor ? new obj.constructor()
        : Object.create(null);

    hash.set(obj, result);
    return Object.assign(result, ...Object.keys(obj).map(key => ({ [key]: deepClone(obj[key], hash) }) ));
}

// Turn an array of strings into a comma separated list
export const userNames = function(users, separator = " ", noUsers = "") {
    let userList = "";
    if(isValid(users)) {
        for(let rp of users) {
            if(userList.length > 0)
                userList += `,${separator}`;
            userList += rp.fullName;
        }
    }
    return userList.length > 0 ? userList : noUsers;
}

// Scroll to a specific element
export const scrollTo = function(id) {
    let el = document.getElementById(id);
    if(isValid(el)) {
        el.scrollIntoView({
            behavior: 'instant',
            block: 'start' // Upper border of the element will be aligned at the top of the visible part of the window
        });

        // Scroll up ~3.5rem so that the scrolled in view element is not under the top navbar
        const delayedScroll = setTimeout(function() {
            clearTimeout(delayedScroll);
            window.scrollBy(0, -60);
        }, 500);
    }
}

// Strip anchor from URL, but keep query params
export const removeUrlAnchor = function(url) {
    let regex = new RegExp('(.+)(#.*$)?', 'ig');
    let matches = regex.exec(url);
    if(isValid(matches)) {
        const fullPathNoAnchor = matches[1];
        return fullPathNoAnchor;
    }

    return url;
}
