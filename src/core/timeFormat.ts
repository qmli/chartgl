function pad(n: number, width: number): string {
    return Math.floor(Math.abs(n)).toString().padStart(width, '0');
}

/** Absolute ms since epoch; fractional part encodes microseconds. */
export function formatDateTime(absoluteMs: number): string {
    const date = new Date(absoluteMs);
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1, 2);
    const dd = pad(date.getDate(), 2);
    const HH = pad(date.getHours(), 2);
    const mm = pad(date.getMinutes(), 2);
    const ss = pad(date.getSeconds(), 2);
    const fracMs = ((absoluteMs % 1000) + 1000) % 1000;
    const ms = Math.floor(fracMs + 1e-9);
    const us = Math.round((fracMs - ms) * 1000);

    if (us !== 0) {
        return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${pad(ms, 3)}${pad(us, 3)}`;
    }
    if (ms !== 0) {
        return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${pad(ms, 3)}`;
    }
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

/**
 * Adaptive axis tick label:
 * year / month / day / hour / minute / second / ms / μs
 */
export function formatTimeTick(value: Date | number): string {
    const t = +value;
    const date = new Date(t);
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1, 2);
    const dd = pad(date.getDate(), 2);
    const HH = pad(date.getHours(), 2);
    const mm = date.getMinutes();
    const ss = date.getSeconds();
    const fracMs = ((t % 1000) + 1000) % 1000;
    const ms = Math.floor(fracMs + 1e-9);
    const us = Math.round((fracMs - ms) * 1000);

    if (us !== 0) {
        return `${HH}:${pad(mm, 2)}:${pad(ss, 2)}.${pad(ms, 3)}${pad(us, 3)}`;
    }
    if (ms !== 0) {
        return `${HH}:${pad(mm, 2)}:${pad(ss, 2)}.${pad(ms, 3)}`;
    }
    if (ss !== 0) {
        return `${HH}:${pad(mm, 2)}:${pad(ss, 2)}`;
    }
    if (mm !== 0) {
        return `${HH}:${pad(mm, 2)}`;
    }
    if (date.getHours() !== 0) {
        return `${MM}-${dd} ${HH}:00`;
    }
    if (date.getDate() !== 1) {
        return `${yyyy}-${MM}-${dd}`;
    }
    if (date.getMonth() !== 0) {
        return `${yyyy}-${MM}`;
    }
    return `${yyyy}`;
}

function niceTimeStep(roughStepMs: number): number {
    const minStep = 0.001; // 1μs
    const step = Math.max(roughStepMs, minStep);
    const exp = Math.floor(Math.log10(step));
    const pow = Math.pow(10, exp);
    const frac = step / pow;
    const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
    return niceFrac * pow;
}

/** Tick values for domains finer than 1ms (d3-time stops at milliseconds). */
export function subMillisecondTickValues(start: number, stop: number, count = 10): Date[] {
    if (!(stop > start)) {
        [start, stop] = [stop, start];
    }
    const step = niceTimeStep((stop - start) / count);
    const t0 = Math.ceil(start / step) * step;
    const ticks: Date[] = [];
    // Guard against float drift
    for (let t = t0, i = 0; t <= stop + step * 1e-6 && i < count * 3; t = t0 + (++i) * step) {
        if (t >= start - step * 1e-6 && t <= stop + step * 1e-6) {
            ticks.push(new Date(t));
        }
    }
    return ticks;
}
