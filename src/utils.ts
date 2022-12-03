export const stringifyAllProps = (object: {[key: string]: any}) => {
    const newObj:{[key: string]: any} = {};
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const element = object[key];
            if(typeof object[key] === 'object') {
                newObj[key] = JSON.stringify(element);
            } else {
                newObj[key] = element;
            }
        }
    }
    return newObj;
}