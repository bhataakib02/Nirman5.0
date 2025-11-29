gd("patient", "index.html");

document.addEventListener("DOMContentLoaded", function () {
    auth.onAuthStateChanged(function (u) {
        if (!u) return;
        var p = window.sfUser;
        if (!p) {
            db.collection("users")
                .doc(u.uid)
                .get()
                .then(function (s) {
                    window.sfUser = s.data();
                    initPt(u.uid, window.sfUser);
                });
        } else {
            initPt(u.uid, p);
        }
    });

    var ls = document.getElementById("pt-lang");
    if (ls)
        ls.addEventListener("change", function (e) {
            var v = e.target.value;
            var st = document.getElementById("pt-st");
            if (v === "hi") st.textContent = "स्थिर";
            else st.textContent = "stable";
        });

    var rb = document.getElementById("pt-rem-add");
    if (rb) rb.addEventListener("click", ptRemAdd);

    var qb = document.getElementById("pt-qr-re");
    if (qb) qb.addEventListener("click", ptQrRe);

    var mb = document.getElementById("pt-mic");
    if (mb) mb.addEventListener("click", ptMic);

    var sb = document.getElementById("pt-note-save");
    if (sb) sb.addEventListener("click", ptNoteSave);
});

function initPt(uid, p) {
    var j = JSON.stringify({ id: uid, n: p.n, t: "p" });
    qr("pt-qr", j);
    ptRemLoad(uid);
    ptChart();
}

function ptRemLoad(uid) {
    var ul = document.getElementById("pt-rem");
    ul.innerHTML = "loading";
    db.collection("patients")
        .doc(uid)
        .collection("rem")
        .orderBy("t", "asc")
        .get()
        .then(function (ss) {
            if (ss.empty) {
                ul.innerHTML =
                    "<li class='text-slate-500 text-[11px]'>no reminders</li>";
                return;
            }
            ul.innerHTML = "";
            ss.forEach(function (d) {
                var v = d.data();
                var li = document.createElement("li");
                li.className = "text-[11px]";
                li.textContent = v.m + " • " + v.d + " • " + v.t;
                ul.appendChild(li);
            });
        });
}

function ptRemAdd() {
    var m = prompt("med");
    if (!m) return;
    var d = prompt("dose");
    var t = prompt("time");
    var u = auth.currentUser;
    if (!u) return;
    db.collection("patients")
        .doc(u.uid)
        .collection("rem")
        .add({
            m: m,
            d: d,
            t: t,
            ct: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function () {
            nt("added", "ok");
            ptRemLoad(u.uid);
        });
}

function ptQrRe() {
    var u = auth.currentUser;
    if (!u || !window.sfUser) return;
    var p = window.sfUser;
    var j = JSON.stringify({ id: u.uid, n: p.n, t: "p", ts: Date.now() });
    qr("pt-qr", j);
    nt("qr updated", "ok");
}

function ptMic() {
    var R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) {
        nt("no speech api", "err");
        return;
    }
    var n = document.getElementById("pt-note");
    var r = new R();
    var ls = document.getElementById("pt-lang");
    r.lang = ls && ls.value === "hi" ? "hi-IN" : "en-IN";
    r.start();
    r.onresult = function (e) {
        var txt = e.results[0][0].transcript;
        n.value += (n.value ? "\n" : "") + txt;
    };
    r.onerror = function () {
        nt("mic err", "err");
    };
}

function ptNoteSave() {
    var t = document.getElementById("pt-note").value.trim();
    if (!t) return;
    var u = auth.currentUser;
    if (!u) return;
    db.collection("patients")
        .doc(u.uid)
        .collection("notes")
        .add({
            tx: t,
            ct: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function () {
            nt("saved", "ok");
        });
}

function ptChart() {
    var c = document.getElementById("pt-chart");
    if (!c) return;
    new Chart(c, {
        type: "line",
        data: {
            labels: ["day1", "day7", "day14", "day21"],
            datasets: [
                { label: "allo", data: [60, 72, 82, 90] },
                { label: "ayur", data: [55, 68, 78, 88] },
                { label: "homeo", data: [50, 62, 74, 85] }
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "#e5e7eb"
                    }
                }
            },
            scales: {
                x: { ticks: { color: "#9ca3af" } },
                y: { ticks: { color: "#9ca3af" } }
            }
        }
    });
}
