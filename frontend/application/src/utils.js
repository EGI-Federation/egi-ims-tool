
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
