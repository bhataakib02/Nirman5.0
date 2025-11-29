gd("doctor", "index.html");

document.addEventListener("DOMContentLoaded", function () {
    auth.onAuthStateChanged(function (u) {
        if (!u) return;
        drLoadPts(u.uid);
    });
    var b = document.getElementById("dr-ai-btn");
    if (b) b.addEventListener("click", drAi);
});

function drLoadPts(id) {
    var list = document.getElementById("dr-pts");
    if (!list) return;
    list.innerHTML = "loading";
    db.collection("patients")
        .where("doc", "==", id)
        .limit(20)
        .get()
        .then(function (ss) {
            if (ss.empty) {
                list.innerHTML =
                    "<li class='text-[11px] text-slate-500'>no patients linked</li>";
                return;
            }
            list.innerHTML = "";
            ss.forEach(function (d) {
                var v = d.data();
                var li = document.createElement("li");
                li.className = "text-[11px]";
                li.textContent = (v.n || "pt") + " • " + (v.dx || "-");
                list.appendChild(li);
            });
        });
}

function drAi() {
    var s = document.getElementById("dr-sym").value;
    var v = document.getElementById("dr-vit").value;
    var h = document.getElementById("dr-hx").value;
    var out = document.getElementById("dr-ai-out");
    if (!s.trim()) {
        nt("add symptoms", "err");
        return;
    }
    out.textContent = "thinking...";
    aiDx(s, v, h).then(function (r) {
        var txt =
            r.list
                .map(function (x) {
                    return x.c + " (" + Math.round(x.p * 100) + "%)";
                })
                .join(" • ") +
            " | " +
            r.note;
        out.textContent = txt;
    });
}
