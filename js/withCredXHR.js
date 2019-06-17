let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    // if (method.includes("post")) {
    //     console.log("post:" + url);
    // } else {
    //     console.log("get:" + url)
    // }
    if (!url.includes("api")) {
        this.withCredentials = true;


    }



    return oldXHROpen.apply(this, arguments);
}