import core from '../core';
import { ChartGLPlugins } from '../options';

export interface ChartGLPlugin<TState=any> {
    apply(chart: core<ChartGLPlugins>): TState;
}
