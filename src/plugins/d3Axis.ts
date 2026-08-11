import { axisBottom, axisLeft } from 'd3-axis';
import { select } from "d3-selection";
import { ChartGLPlugin } from ".";
import { formatTimeTick, subMillisecondTickValues } from "../core/timeFormat";

export const d3Axis: ChartGLPlugin = {
    apply(chart) {
        const d3Svg = select(chart.svgLayer.svgNode);
        const xg = d3Svg.append('g');
        const yg = d3Svg.append('g');

        const xAxis = axisBottom(chart.model.xScale);
        const yAxis = axisLeft(chart.model.yScale);

        function update() {
            const xs = chart.model.xScale;
            const domain = xs.domain().map((d: number) => d + chart.options.baseTime);
            const span = Math.abs(domain[1] - domain[0]);
            const xts = chart.options.xScaleType()
                .domain(domain)
                .range(xs.range());
            xAxis.scale(xts).tickFormat(d => formatTimeTick(d as Date | number));

            // d3-time's finest interval is 1ms; generate sub-ms ticks ourselves.
            if (span > 0 && span < 2) {
                xAxis.tickValues(subMillisecondTickValues(domain[0], domain[1]));
            } else {
                xAxis.tickValues(null);
            }

            xg.call(xAxis);
            if (chart.options.grid) {
                yAxis.scale(chart.model.yScale).tickSize(-chart.canvasLayer.canvas.width);
            } else {
                yAxis.scale(chart.model.yScale);
            }
            yg.call(yAxis);
        }

        chart.model.updated.on(update);

        chart.model.resized.on((w, h) => {
            const op = chart.options;
            xg.attr('transform', `translate(0, ${h - op.paddingBottom})`);
            yg.attr('transform', `translate(${op.paddingLeft}, 0)`);

            update();
        });
    }
}
