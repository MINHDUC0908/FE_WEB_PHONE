export const debounce = (callback, timeout = 500) => {
    let id = null;
    return (...args) => {
        clearTimeout(id);
        id = setTimeout(() => {
            callback(...args); // Không dùng `.apply(this, args)`
        }, timeout);
    };
};
