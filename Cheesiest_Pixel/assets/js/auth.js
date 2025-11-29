function goRole(r) {
    if (r === "patient") window.location.href = "patient.html";
    else if (r === "doctor") window.location.href = "doctor.html";
    else if (r === "researcher") window.location.href = "researcher.html";
    else if (r === "admin") window.location.href = "admin.html";
    else window.location.href = "index.html";
}

function su(e) {
    e.preventDefault();
    var n = document.getElementById("sg-n").value;
    var em = document.getElementById("sg-e").value;
    var pw = document.getElementById("sg-p").value;
    var r = document.getElementById("sg-r").value;
    auth
        .createUserWithEmailAndPassword(em, pw)
        .then(function (c) {
            var id = c.user.uid;
            return db
                .collection("users")
                .doc(id)
                .set({
                    n: n,
                    e: em,
                    r: r,
                    ct: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(function () {
                    nt("ready", "ok");
                    goRole(r);
                });
        })
        .catch(function (er) {
            nt(er.message, "err");
        });
}

function lg(e) {
    e.preventDefault();
    var em = document.getElementById("lg-e").value;
    var pw = document.getElementById("lg-p").value;
    auth
        .signInWithEmailAndPassword(em, pw)
        .then(function (c) {
            var id = c.user.uid;
            return db
                .collection("users")
                .doc(id)
                .get()
                .then(function (s) {
                    var d = s.data();
                    if (!d) {
                        nt("profile missing", "err");
                        return;
                    }
                    goRole(d.r);
                });
        })
        .catch(function (er) {
            nt(er.message, "err");
        });
}

function gLg() {
    var p = new firebase.auth.GoogleAuthProvider();
    auth
        .signInWithPopup(p)
        .then(function (res) {
            var u = res.user;
            var ref = db.collection("users").doc(u.uid);
            return ref.get().then(function (s) {
                if (!s.exists) {
                    return ref
                        .set({
                            n: u.displayName || "user",
                            e: u.email,
                            r: "patient",
                            ct: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(function () {
                            return ref.get();
                        });
                }
                return s;
            });
        })
        .then(function (s) {
            if (!s) return;
            var d = s.data();
            goRole(d.r);
        })
        .catch(function (er) {
            nt(er.message, "err");
        });
}

function lo() {
    auth.signOut().then(function () {
        window.location.href = "index.html";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var sf = document.getElementById("sg-f");
    var lf = document.getElementById("lg-f");
    var gb = document.getElementById("g-btn");
    var lbs = document.querySelectorAll("[data-logout]");
    if (sf) sf.addEventListener("submit", su);
    if (lf) lf.addEventListener("submit", lg);
    if (gb) gb.addEventListener("click", gLg);
    lbs.forEach(function (b) {
        b.addEventListener("click", lo);
    });
});
