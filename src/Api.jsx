
// export const api = "https://duc-phone.onrender.com/api/"
export const api = "http://127.0.0.1:8000/api/"

export const src = "http://127.0.0.1:8000/"
// export const src = "https://duc-phone.onrender.com/"

export const formatPrice = (price) => {
    return price ? new Intl.NumberFormat("vi-VN").format(price) : "";
};

export const base64ToFile = (base64String, filename) => {
    let arr = base64String.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
};

export const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} ngày trước`;
    } else if (diffInHours > 0) {
        return `${diffInHours} giờ trước`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} phút trước`;
    } else {
        return "Vừa xong";
    }
};