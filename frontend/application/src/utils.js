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
