import { EventDispatcher } from '../utils';
import { CapableElement, DIRECTION, dirOptions, Point, ResolvedOptions } from './options';
import { applyNewDomain, scaleK } from './utils';

export class ChartZoomMouse {
    public scaleUpdated = new EventDispatcher();
    private previousPoint: Point | null = null;

    constructor(private el: CapableElement, private options: ResolvedOptions) {
        const eventEl = options.eventElement;
        eventEl.style.userSelect = 'none';
        eventEl.addEventListener('pointerdown', ev => this.onMouseDown(ev));
        eventEl.addEventListener('pointerup', ev => this.onMouseUp(ev));
        eventEl.addEventListener('pointermove', ev => this.onMouseMove(ev));
    }

    private point(ev: MouseEvent) {
        const boundingRect = this.el.getBoundingClientRect();
        return {
            [DIRECTION.X]: ev.clientX - boundingRect.left,
            [DIRECTION.Y]: ev.clientY - boundingRect.top,
        };
    }

    private onMouseMove(event: PointerEvent) {
        if (this.previousPoint === null) {
            return;
        }
        const p = this.point(event);
        let changed = false;
        for (const { dir, op } of dirOptions(this.options)) {
            const offset = p[dir] - this.previousPoint[dir];
            const k = scaleK(op.scale);
            const domain = op.scale.domain();
            const newDomain = domain.map(d => d - k * offset);
            if (applyNewDomain(op, newDomain)) {
                changed = true;
            }
        }
        this.previousPoint = p;
        if (changed) {
            this.scaleUpdated.dispatch();
        }
    }

    private onMouseDown(event: PointerEvent) {
        if (event.pointerType !== 'mouse')
            return;
        if ((event.buttons & this.options.panMouseButtons) === 0)
            return;
        const eventEl = this.options.eventElement;
        eventEl.setPointerCapture(event.pointerId);
        this.previousPoint = this.point(event);
        eventEl.style.cursor = 'grabbing';
    }

    private onMouseUp(event: PointerEvent) {
        if (this.previousPoint === null) {
            return;
        }
        const eventEl = this.options.eventElement;
        this.previousPoint = null
        eventEl.releasePointerCapture(event.pointerId);
        eventEl.style.cursor = '';
    }
}
