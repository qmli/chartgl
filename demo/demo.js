main();

function main() {
    const el = document.getElementById('chart');
    const dataSin = [];
    const dataCos = [];
    const baseTime = Date.now();
    const chart = new ChartGL(el, {
        // debugWebGL: true,
        // forceWebGL1: true,
        baseTime,
        series: [
            {
                name: 'Sin',
                data: dataSin,
            },
            {
                name: 'Cos',
                data: dataCos,
                lineWidth: 2,
                color: 'red',
            },
        ],
        xRange: { min: 0, max: 20 * 1000 },
        realTime: true,
        zoom: {
            x: {
                autoRange: true,
                minDomainExtent: 1,
            },
            y: {
                autoRange: true,
                minDomainExtent: 1,
            }
        },
        tooltip: {
            enabled: true,
        },
        legend: false
    });
    const pointCountEl = document.getElementById('point-count');

    function update() {
        const time = performance.now();
        // ~1000 points / second (10 points every 10ms)
        for (let i = 0; i < 10; i++) {
            const x = time + i;
            dataSin.push({ x, y: Math.sin(x * 0.0072) * 320 });
            dataCos.push({ x, y: Math.cos(x * 0.0052) * 200 });
        }
        pointCountEl.innerText = dataSin.length;
        chart.update();
    }

    const ev = setInterval(update, 10);
    document.getElementById('stop-btn').addEventListener('click', function () {
        clearInterval(ev);
    });
    document.getElementById('follow-btn').addEventListener('click', function () {
        chart.options.realTime = true;
    });
    document.getElementById('legend-btn').addEventListener('click', function () {
        chart.options.legend = !chart.options.legend;
        chart.update();
    });
    document.getElementById('tooltip-btn').addEventListener('click', function () {
        chart.options.tooltip.enabled = !chart.options.tooltip.enabled;
    });

    const paddingDirs = ['Top', 'Right', 'Bottom', 'Left'];
    for (const d of paddingDirs) {
        const i = document.getElementById('padding-' + d.toLowerCase());
        const propName = 'padding' + d;
        i.textContent = chart.options[propName];
    }
    for (const d of paddingDirs) {
        /** @type {HTMLInputElement} */
        const i = document.getElementById('render-padding-' + d.toLowerCase());
        const propName = 'renderPadding' + d;
        i.value = chart.options[propName];
        i.addEventListener('change', () => {
            chart.options[propName] = parseFloat(i.value);
            chart.update();
        });
    }
}
