main();

function main() {
    const el = document.getElementById('chart');
    const dataSin = [];
    const dataCos = [];
    const baseTime = 0;
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
            xFormatter: (x) => {
                const microTimestamp = x.o; // 假设是微秒
                const milliseconds = Math.floor(microTimestamp / 1000);
                const microseconds = microTimestamp % 1000;

                const date = new Date(milliseconds);
               return date.getSeconds() + `:  ${microseconds}µs`
            },
        },
        legend: false
    });
    const pointCountEl = document.getElementById('point-count');
    let xyy =1680194149123001;
    let xy = [
        '1680194149127',
        '1680194149128',
        '1680194149129',
        '1680194149130',
        '1680194149131',
        '1680194149132',
        '1680194149133',
        '1680194149134',
        '1680194149135',
        '1680194149136',
        '1680194149137',
        '1680194149138',
        '1680194149139',
        '1680194149140',
        '1680194149141',
        '1680194149142',
        '1680194149143',
        '1680194149144',
        '1680194149145',
        '1680194149146',
        '1680194149147',
        '1680194149148',
        '1680194149149',
        '1680194149150',
        '1680194149151',
        '1680194149152',
        '1680194149153',
        '1680194149154',
        '1680194149155',
        '1680194149156',
        '1680194149157',
        '1680194149158',
        '1680194149159',
        '1680194149160',
        '1680194149161',
        '1680194149162',
        '1680194149163',
        '1680194149164',
        '1680194149165',
        '1680194149166',
        '1680194149167',
        '1680194149168',
        '1680194149169',
        '1680194149170',
        '1680194149171',
        '1680194149172',
        '1680194149173',
        '1680194149174',
        '1680194149175',
        '1680194149176',
        '1680194149177',
        '1680194149178',
        '1680194149179',
        '1680194149180',
        '1680194149181',
        '1680194149182',
        '1680194149183',
        '1680194149184',
        '1680194149185',
        '1680194149186',
        '1680194149187',
        '1680194149188',
        '1680194149189',
        '1680194149190',
        '1680194149191',
        '1680194149192',
        '1680194149193',
        '1680194149194',
        '1680194149195',
        '1680194149196',
        '1680194149197',
        '1680194149198',
        '1680194149199',
        '1680194149200',
        '1680194149201',
        '1680194149202',
        '1680194149203',
        '1680194149204',
        '1680194149205',
        '1680194149206'
    ];
    let dataList = [
        0.0000135388230626, 0.0000145388230626, 0.000055388230626, 0.0000335388230626, 0.0000235388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000235388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000335388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626,
        0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626, 0.0000135388230626
    ]
    function update() {
        const time = performance.now();
        debugger;
        for (let u=1; u < 10000; u += 1) {
            debugger;
            xyy += 1;
            // const y = Math.random() * 500 + 100;
            let x = xyy-1680194149123001;
            const y_sin = Math.sin(x * 0.0072) * 320;
            dataSin.push({o:xyy, x:x, y:  Math.random() * 500 + 100 });

            const y_cos = Math.cos(x * 0.0052) * 200;
            dataCos.push({o:xyy, x:x, y:  Math.random() * 500 + 100 });
        }
        // for (let i = 0; i < dataList.length; i++) {
        //     dataSin.push({ x: xy[i], y: dataList[i] });
        // }
        pointCountEl.innerText = dataSin.length;
        chart.update();
    }
    update();
    // const ev = setInterval(update, 1);
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

    paddingDirs = ['Top', 'Right', 'Bottom', 'Left'];
    for (const d of paddingDirs) {
        const i = document.getElementById('padding-' + d.toLowerCase());
        const propName = 'padding' + d
        i.textContent = chart.options[propName];
    }
    for (const d of paddingDirs) {
        /** @type {HTMLInputElement} */
        const i = document.getElementById('render-padding-' + d.toLowerCase());
        const propName = 'renderPadding' + d
        i.value = chart.options[propName];
        i.addEventListener('change', () => {
            chart.options[propName] = parseFloat(i.value);
            chart.update();
        });
    }
}
