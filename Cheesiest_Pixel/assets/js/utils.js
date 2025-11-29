function nt(msg, t) {
    var d = document.createElement("div");
    d.textContent = msg;
    d.className =
        "fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm shadow-lg " +
        (t === "err" ? "bg-red-600 text-white" : "bg-emerald-500 text-white");
    document.body.appendChild(d);
    setTimeout(function () {
        d.remove();
    }, 2600);
}

function gd(role, redir) {
    auth.onAuthStateChanged(function (u) {
        if (!u) {
            window.location.href = redir || "index.html";
            return;
        }
        db.collection("users")
            .doc(u.uid)
            .get()
            .then(function (s) {
                var d = s.data();
                if (!d || d.r !== role) {
                    nt("not allowed", "err");
                    window.location.href = redir || "index.html";
                    return;
                }
                window.sfUser = d;
                var xs = document.querySelectorAll("[data-name]");
                xs.forEach(function (el) {
                    el.textContent = d.n || "user";
                });
            });
    });
}

function qr(id, txt) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    new QRCode(el, {
        text: txt,
        width: 128,
        height: 128
    });
}

function csvDl(name, rows) {
    var c = rows
        .map(function (r) {
            return r
                .map(function (v) {
                    var s = String(v).replace(/"/g, '""');
                    return '"' + s + '"';
                })
                .join(",");
        })
        .join("\n");
    var b = new Blob([c], { type: "text/csv;charset=utf-8;" });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function csvParse(t) {
    var rows = t.trim().split(/\r?\n/);
    return rows.map(function (row) {
        return row.split(",").map(function (v) {
            return v.replace(/^"|"$/g, "");
        });
    });
}
