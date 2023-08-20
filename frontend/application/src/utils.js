import i18n from '@/locales'


// Check if an instance is valid
export const isValid = function(t) {
    return (t === undefined || t === null) ? false : true;
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
export const Status = makeEnum(['DRAFT', 'READY_FOR_APPROVAL', 'APPROVED', 'DEPRECATED']);

// Get localized label and class for a status
export const statusPill = function(status, t) {

    if(!isValid(status))
        return { label: "", pillClass: "" };

    if(Status.READY_FOR_APPROVAL.description === status)
        return { label: t("ims.statusReadyForApproval"), pillClass: "badge rounded-pill bg-info" };
    else if(Status.APPROVED.description === status)
        return { label: t("ims.statusApproved"), pillClass: "badge rounded-pill bg-success" };
    else if(Status.DEPRECATED.description === status)
        return { label: t("ims.statusDeprecated"), pillClass: "badge rounded-pill bg-danger" };

    return { label: t("ims.statusDraft"), pillClass: "badge bg-secondary" };
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
                f += t('ims.days');
                break;
            case 'month':
                f += t('ims.months');
                break;
            default:
                f += t('ims.years');
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

// Find entity with a specific status
// Parameter current is a Version<T> where T has a history field
// Returns Version<T> or null if no entity with specified status
export const findEntityWithStatus = function(current, status) {
    if(isValid(current) && isValid(current.entity)) {
        if(status === current.entity.status)
            return current;

        // Attempt to find specified status
        const history = current.entity.history;
        if(isValid(history) && isValid(history.versions)) {
            for(let version of history.versions) {
                const ent = version.entity;
                if(status === ent.status)
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
    if(isValid(current) && isValid(current.entity)) {
        if(ver === current.entity.version.toString())
            return current;

        // Attempt to find specified version
        const history = current.entity.history;
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
        // ... add here any specific treatment for other classes ...
        : obj.constructor ? new obj.constructor()
        : Object.create(null);

    hash.set(obj, result);
    return Object.assign(result, ...Object.keys(obj).map(key => ({ [key]: deepClone(obj[key], hash) }) ));
}
