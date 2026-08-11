import { ChartZoom } from "../chartZoom";
import core from "../core";
import { MinMax } from "../core/renderModel";
import { ResolvedZoomOptions, ChartGLPlugins, ZoomOptions } from "../options";
import { ChartGLPlugin } from ".";
import { ScaleLinear } from "d3-scale";

export class ChartGLZoom {
    private lastXExtent: number | null = null;

    constructor(chart: core<ChartGLPlugins>, public options: ResolvedZoomOptions) {
        this.registerZoom(chart)
    }

    private applyAutoRange(o: {scale: ScaleLinear<number, number>, autoRange: boolean, minDomain?: number, maxDomain?: number} | undefined, dataRange: MinMax | null) {
        if (!o)
            return;
        if (!o.autoRange) {
            delete o.minDomain;
            delete o.maxDomain;
            return;
        }
        let [min, max] = o.scale.domain();
        if (dataRange) {
            min = Math.min(min, dataRange.min);
            max = Math.max(max, dataRange.max);
        }
        o.minDomain = min;
        o.maxDomain = max;
    }

    private registerZoom(chart: core<ChartGLPlugins>) {
        const o = this.options;
        const z = new ChartZoom(chart.el, o as any);
        chart.model.updated.on(() => {
            this.applyAutoRange(o.x, chart.model.xRange);
            this.applyAutoRange(o.y, chart.model.yRange);
            z.update();
            const d = chart.model.xScale.domain();
            this.lastXExtent = Math.abs(d[1] - d[0]);
        });
        z.onScaleUpdated(() => {
            const domain = chart.model.xScale.domain();
            const extent = Math.abs(domain[1] - domain[0]);
            const prevExtent = this.lastXExtent;
            const isZoom = prevExtent != null
                && Math.abs(extent - prevExtent) > Math.max(prevExtent * 1e-6, 1e-9);
            this.lastXExtent = extent;

            chart.options.xRange = null;
            chart.options.yRange = null;

            if (isZoom) {
                // Keep realTime; re-pin to the latest point with the new window size.
                if (chart.options.realTime && chart.model.xRange) {
                    const maxDomain = chart.model.xRange.max;
                    chart.model.xScale.domain([maxDomain - extent, maxDomain]);
                }
            } else {
                // Pan: follow only while the right edge stays on the latest data.
                const dataMax = chart.model.xRange?.max;
                if (dataMax != null) {
                    const edgeEps = Math.max(extent * 0.01, Number.EPSILON);
                    chart.options.realTime = domain[1] >= dataMax - edgeEps;
                } else {
                    chart.options.realTime = false;
                }
            }

            chart.update();
        });
    }
}

const defaults = {
    autoRange: true,
} as const;

export class ChartGLZoomPlugin implements ChartGLPlugin<ChartGLZoom> {
    constructor(private options?: ZoomOptions) {
    }

    private resolveOptions(chart: core<ChartGLPlugins>): ResolvedZoomOptions {
        const o = this.options ?? {};
        return new Proxy(o, {
            get: (target, prop) => {
                switch (prop) {
                    case 'x':
                    case 'y':
                        const op = target[prop];
                        if (!op)
                            return op;
                        return new Proxy(op, {
                            get: (target, prop2) => {
                                if (prop2 === 'scale') {
                                    switch (prop) {
                                        case 'x':
                                            return chart.model.xScale;
                                        case 'y':
                                            return chart.model.yScale;
                                    }
                                }
                                return (target as any)[prop2] ?? (defaults as any)[prop2];
                            }
                        })
                    case 'eventElement':
                        return chart.contentBoxDetector.node;
                    case 'wheelZoom':
                        // In real-time mode, wheel zooms the time window instead of panning away.
                        return chart.options.realTime;
                    default:
                        return (target as any)[prop];
                }
            }
        }) as ResolvedZoomOptions;
    }

    apply(chart: core<ChartGLPlugins>) {
        return new ChartGLZoom(chart, this.resolveOptions(chart));
    }
}
