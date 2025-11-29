document.addEventListener("DOMContentLoaded", function () {
    var lm = document.getElementById("lg-m");
    var sm = document.getElementById("sg-m");
    var bL = document.getElementById("btn-lg");
    var bS = document.getElementById("btn-sg");
    var bC = document.getElementById("btn-cta");
    function sh(id) {
        if (id === "lg" && lm) lm.classList.remove("hidden");
        if (id === "sg" && sm) sm.classList.remove("hidden");
    }
    if (bL) bL.addEventListener("click", function () { sh("lg"); });
    if (bS) bS.addEventListener("click", function () { sh("sg"); });
    if (bC) bC.addEventListener("click", function () { sh("sg"); });
    var cls = document.querySelectorAll("[data-close]");
    cls.forEach(function (x) {
        x.addEventListener("click", function () {
            var t = x.getAttribute("data-close");
            if (t === "lg" && lm) lm.classList.add("hidden");
            if (t === "sg" && sm) sm.classList.add("hidden");
        });
    });
});
