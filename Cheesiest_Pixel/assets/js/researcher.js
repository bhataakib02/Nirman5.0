gd("researcher", "index.html");

document.addEventListener("DOMContentLoaded", function () {
    rsChart();
    var b = document.getElementById("rs-dl");
    if (b) b.addEventListener("click", rsDl);
});

function rsChart() {
    var c = document.getElementById("rs-chart");
    if (!c) return;
    aiOutCmp({}).then(function (r) {
        new Chart(c, {
            type: "bar",
            data: {
                labels: r.x,
                datasets: [
                    {
                        label: "outcome score",
                        data: r.y
                    }
                ]
            },
            options: {
                plugins: {
                    legend: { labels: { color: "#e5e7eb" } }
                },
                scales: {
                    x: { ticks: { color: "#9ca3af" } },
                    y: { ticks: { color: "#9ca3af" } }
                }
            }
        });
    });
}

function rsDl() {
    db.collection("patients")
        .limit(50)
        .get()
        .then(function (ss) {
            var rows = [];
            rows.push([
                "id",
                "age",
                "sex",
                "sys",
                "dx",
                "outcome"
            ]);
            ss.forEach(function (d) {
                var v = d.data();
                rows.push([
                    d.id,
                    v.age || "",
                    v.sex || "",
                    v.sys || "",
                    v.dx || "",
                    v.out || ""
                ]);
            });
            csvDl("cohort.csv", rows);
            nt("csv ready", "ok");
        });
}
