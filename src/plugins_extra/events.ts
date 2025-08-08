import core from '../core';
import { ChartGLPlugin } from '../plugins';
import { select } from 'd3-selection';

export interface Event {
    name: string;
    x: number;
}

export class EventsPlugin implements ChartGLPlugin<EventsPlugin> {
    readonly data: Event[]
    constructor(data?: Event[]) {
        this.data = data ?? [];
    }

    apply(chart: core) {
        const d3Svg = select(chart.svgLayer.svgNode)
        const box = d3Svg.append('svg');
        box.append('style').text(`
.chartgl-event-line {
    stroke: currentColor;
    stroke-width: 1;
    stroke-dasharray: 2 1;
    opacity: 0.7;
}`);
        chart.model.resized.on((w, h) => {
            box.attr('height', h - chart.options.paddingBottom);
        })

        chart.model.updated.on(() => {
            const eventEl = box.selectAll<SVGGElement, unknown>('g')
                .data(this.data);

            eventEl.exit().remove();

            const newEventEl = eventEl.enter().append('g');
            newEventEl.append('line')
                .attr('y2', '100%')
                .attr('class', 'chartgl-event-line');
            newEventEl.append('text')
                .attr('x', 5)
                .attr('y', chart.options.paddingTop)
                .attr('dy', '0.8em');

            const allEventEl = eventEl.merge(newEventEl)
            allEventEl.attr('transform', d => `translate(${chart.model.xScale(d.x)}, 0)`)
            allEventEl.select('text')
                .text(d => d.name)
        });

        return this;
    }
}
