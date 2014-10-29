Marionette.Tooltip
==================

How about another tooltip library?

# Example
```javascript
define(['marionette', 'marionette.tooltip'], function (Marionette, Tooltip) {
    // tooltip content
    var TooltipView = Marionete.ItemView.extend({
        template: '#tooltip-template'
    });
    
    // just another element
    var TargetView = Marionette.ItemView.extend({
        template: '#target-template',
        
        ui: {
            tooltipTarget: '#tooltip' // optionally, this.$el by default
        },
        
        events: {
            // some tooltip controls by events
            click: function () { this.triggerMethod('toggle:tooltip'); },
            mouseenter: function () { this.triggerMethod('show:tooltip'); },
            mouseleave: function () { this.triggerMethod('hide:tooltip'); }
        },
        
        behaviors: {
            // tooltip options
            tooltip: {
                behaviorClass: Tooltip,
                View: TooltipView,
                className: 'tooltip',
                direction: 'left' // right, top, bottom
            }
        }
    });
});
```
