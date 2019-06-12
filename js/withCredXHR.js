let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

    if (!url.includes("api")) {
        this.withCredentials = true;


    }

    this.addEventListener('load', function() {
        //console.log(this);
    });

    return oldXHROpen.apply(this, arguments);
}