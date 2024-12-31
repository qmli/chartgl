import { ColorCommonInstance, ColorSpaceObject, rgb } from 'd3-color';
import { DataPointsBuffer } from './core/dataPointsBuffer';
import { DataPoint } from './core/renderModel';
import { ChartGLPlugin } from './plugins';
import * as zoomOptions from './chartZoom/options';

type ColorSpecifier = ColorSpaceObject | ColorCommonInstance | string

export interface AxisZoomOptions extends zoomOptions.AxisOptions {
    autoRange?: boolean;
}

export interface ResolvedAxisZoomOptions extends zoomOptions.ResolvedAxisOptions {
    autoRange: boolean;
}

export interface ZoomOptions {
    x?: AxisZoomOptions;
    y?: AxisZoomOptions;
}

export interface ResolvedZoomOptions {
    x?: ResolvedAxisZoomOptions;
    y?: ResolvedAxisZoomOptions;
}

interface ScaleBase {
    (x: number | {valueOf(): number}): number;
    domain(): number[] | Date[];
    range(): number[];
    copy(): this;
    domain(domain: Array<number>): this;
    range(range: ReadonlyArray<number>): this;
}

export interface TooltipOptions {
    enabled: boolean;
    xLabel: string;
    xFormatter: (x: number) => string;
}

interface ChartGLRenderOptions {
    pixelRatio: number;
    lineWidth: number;
    backgroundColor: ColorSpecifier;
    color: ColorSpecifier;

    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;

    renderPaddingLeft: number;
    renderPaddingRight: number;
    renderPaddingTop: number;
    renderPaddingBottom: number;

    legend: boolean;
    tooltip: Partial<TooltipOptions>;

    xRange: { min: number | Date, max: number | Date } | 'auto' | null;
    yRange: { min: number, max: number } | 'auto' | null;
    realTime: boolean;
    grid: boolean;
    /** Milliseconds since `new Date(0)`. Every x in data are relative to this.
     *
     * Set this option and keep the absolute value of x small for higher floating point precision.
     **/
    baseTime: number;
    xScaleType: () => ScaleBase;

    debugWebGL: boolean;
}

export type ChartGLPlugins = Readonly<Record<string, ChartGLPlugin>>;
export type NoPlugin = Readonly<Record<string, never>>;

export type ChartGLOptions<TPlugins extends ChartGLPlugins> =
    ChartGLOptionsBase &
    (NoPlugin extends TPlugins ? {plugins?: Record<string, never>} : {plugins: TPlugins});

export interface ChartGLOptionsBase extends Partial<ChartGLRenderOptions> {
    series?: Partial<ChartGLSeriesOptions>[];
    zoom?: ZoomOptions;
}

export interface ResolvedCoreOptions extends ChartGLRenderOptions {
    series: ChartGLSeriesOptions[];
}

export interface ResolvedOptions extends ResolvedCoreOptions {
    zoom: ResolvedZoomOptions;
}

export enum LineType {
    Line,
    Step,
    NativeLine,
    NativePoint,
};

export interface ChartGLSeriesOptions {
    data: DataPointsBuffer;
    lineWidth?: number;
    name: string;
    color?: ColorSpecifier;
    visible: boolean;
    lineType: LineType;
    stepLocation: number;
}

export function resolveColorRGBA(color: ColorSpecifier): [number, number, number, number] {
    const rgbColor = typeof color === 'string' ? rgb(color) : rgb(color);
    return [rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255, rgbColor.opacity];
}
