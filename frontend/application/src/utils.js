import i18n from '@/locales'
import {store} from "@/store";


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

// Format a date as a string
// Unit controls the granularity ('day', 'month', or 'year')
// If the date is in the current year and granularity is finer than 'year', omit the year
export const formatDate = function(someDate, unit = 'day') {

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

    let f = t('home.notSet');
    if(frequency === 1) {
        f = `${t('home.every')} `;
        switch(unit) {
            case 'day': f += t('home.day'); break;
            case 'month': f += t('home.month'); break;
            default: f+= t('home.year'); break;
        }
    }
    else if(frequency > 1) {
        f = `${t('home.every')} ${frequency} `;
        switch(unit) {
            case 'day':
                f += t('home.days');
                break;
            case 'month':
                f += t('home.months');
                break;
            default:
                f += t('home.years');
                break;
        }
    }

    let w = t('home.notSet');
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
