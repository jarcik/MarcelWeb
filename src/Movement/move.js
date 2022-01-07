export class MoveMe {

    getPosition(settings, ellapsedTime) {
        var angle = this.getAngle(settings, ellapsedTime);
        return {
            x: settings.center.x + settings.radius * Math.cos(angle),
            y: settings.center.y + settings.radius * Math.sin(angle)
        };
    }
    
    getAngle(settings, ellapsedTime) {
        return ellapsedTime / settings.interval * 2 * Math.PI * settings.direction - settings.startPositionRad;
    }
    
    start(id, settings) {
        var el = document.getElementById(id),
            startTime = (new Date()).getTime();
        if(!el) this.stop(id);
        el.style.position = 'absolute';
        if(!settings.startPositionRad) settings.startPositionRad = settings.startPositionDeg / 180 * Math.PI;
        var t = this;
        setInterval(function() {
            var pos = t.getPosition(settings, (new Date()).getTime() - startTime);
            el.style.left = (pos.x) + 'px';
            el.style.top = (pos.y) + 'px';
        }, settings.updateInterval);
        if(settings.iterations > -1) setTimeout(function() {
            t.stop(id);
        }, settings.iterations * settings.interval);
    }
    
    startOld(id, settings) {
        var el = document.getElementById(id),
            startTime = (new Date()).getTime();
        if(el['#rev:tm'] !== null) this.stop(id);
        el.style.position = 'absolute';
        if(!settings.startPositionRad) settings.startPositionRad = settings.startPositionDeg / 180 * Math.PI;
        var t = this;
        el['#rev:tm'] = setInterval(function() {
            var pos = t.getPosition(settings, (new Date()).getTime() - startTime);
            el.style.left = (pos.x) + 'px';
            el.style.top = (pos.y) + 'px';
        }, settings.updateInterval);
        if(settings.iterations > -1) setTimeout(function() {
            t.stop(id);
        }, settings.iterations * settings.interval);
    }
    
    stop(id) {
        var el = document.getElementById(id);
        if(el['#rev:tm'] === null) return;
        clearInterval(el['#rev:tm']);
        el['#rev:tm'] = null;
    }
}