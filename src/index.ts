import core from './core';
import { LineType, NoPlugin, ResolvedOptions, ChartGLOptions, ChartGLPlugins } from './options';
import { ChartGLZoomPlugin } from './plugins/chartZoom';
import { crosshair } from './plugins/crosshair';
import { d3Axis } from './plugins/d3Axis';
import { legend } from './plugins/legend';
import { lineChart } from './plugins/lineChart';
import { nearestPoint } from './plugins/nearestPoint';
import { splitLine } from './plugins/splitLine';
import { ChartGLTooltipPlugin } from './plugins/tooltip';

type TDefaultPlugins = {
    lineChart: typeof lineChart,
    d3Axis: typeof d3Axis,
    crosshair: typeof crosshair,
    nearestPoint: typeof nearestPoint,
    splitLine: typeof splitLine,
    legend: typeof legend,
    zoom: ChartGLZoomPlugin,
    tooltip: ChartGLTooltipPlugin,
}

function addDefaultPlugins<TPlugins extends ChartGLPlugins=NoPlugin>(options?: ChartGLOptions<TPlugins>): ChartGLOptions<TPlugins&TDefaultPlugins> {
    const o = options ?? {plugins: undefined, zoom: undefined, tooltip: undefined};
    return {
        ...options,
        plugins: {
            lineChart,
            d3Axis,
            crosshair,
            splitLine,
            nearestPoint,
            legend,
            zoom: new ChartGLZoomPlugin(o.zoom),
            tooltip: new ChartGLTooltipPlugin(o.tooltip),
            ...(o.plugins ?? {}) as TPlugins,
        }
    } as ChartGLOptions<TPlugins&TDefaultPlugins>;
}

export default class ChartGL<TPlugins extends ChartGLPlugins=NoPlugin> extends core<TPlugins & TDefaultPlugins> {
    // For users who use script tag
    static core = core;
    static plugins = {
        lineChart,
        d3Axis,
        crosshair,
        nearestPoint,
        legend,
        ChartGLZoomPlugin,
        ChartGLTooltipPlugin,
    }
    static LineType = LineType;

    get options(): ResolvedOptions { return this._options as ResolvedOptions; }

    constructor(public el: HTMLElement, options?: ChartGLOptions<TPlugins>) {
        super(el, addDefaultPlugins<TPlugins>(options));
    }
}
