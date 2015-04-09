(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['marionette', 'underscore'], factory);
    }
    else {
        root.Marionette.Tooltip = factory(root.Marionette, root._);
    }
}(this, function (Marionette, _) {
    'use strict';

    var ContainerView = Marionette.LayoutView.extend({
        template: _.template('<div class="js-tooltip"></div>'),
        className: 'tooltip',

        regions: {
            region: '.js-tooltip'
        },

        events: {},

        initialize: function () {
            var prevents = this.prevents;

            if (_.isString(prevents)) {
                this.events[prevents] = 'preventPropagation';
            }
            else if (_.isArray(prevents)) {
                _.each(prevents, function (event) {
                    this.events[event] = 'preventPropagation';
                }, this);
            }
        },

        preventPropagation: function (event) {
            event.stopPropagation();
        }
    });

    return Marionette.Behavior.extend({
        defaults: {
            direction: 'top'
        },

        initialize: function () {
            var Container = ContainerView.extend({
                className: this.options.className || 'tooltip',
                prevents: this.options.prevents
            });

            this.tooltip = new Container;
        },

        onShow: function () {
            var View = _.result(this.view, 'getTooltip');

            if (View === void 0) {
                throw new Marionette.Error({
                    name: 'TooltipException',
                    message: 'tooltip is not defined'
                });
            }

            this.tooltip.render();
            this.tooltip.region.show(new View);

            this.tooltip.$el.addClass('direction-' + this.options.direction);

            if (this.view.ui && this.view.ui.tooltipTarget !== void 0) {
                this.view.ui.tooltipTarget.after(this.tooltip.el);
            }
            else {
                this.el.insertBefore(this.tooltip.el, null);
            }
        },

        onDestroy: function () {
            this.tooltip.destroy();
        },

        setPosition: function () {
            var target;

            if (this.view.ui && this.view.ui.tooltipTarget !== void 0) {
                target = this.view.ui.tooltipTarget;
            }
            else {
                target = this.$el;
            }

            // tooltip target
            var parentPosition = target.position();
            var parentWidth = target.outerWidth();
            var parentHeight = target.outerHeight();

            // tooltip element
            var height = this.tooltip.$el.outerHeight();
            var width = this.tooltip.$el.outerWidth();

            // tooltip default offset
            var top = parentPosition.top - height / 2 + parentHeight / 2;
            var left = parentPosition.left - width / 2 + parentWidth / 2;

            // ajust tooltip position based on tooltip direction
            switch (this.options.direction) {
                case 'top': {
                    top = parentPosition.top - height;
                    break;
                }
                case 'bottom': {
                    top = parentHeight + parentPosition.top;
                    break;
                }
                case 'left': {
                    left = parentPosition.left - width;
                    break;
                }
                case 'right': {
                    left = parentPosition.left + parentWidth;
                    break;
                }
            }

            this.tooltip.$el.css({
                top: top,
                left: left
            });
        },

        onShowTooltip: function () {
            this.setPosition();
            this.tooltip.$el.stop(true).fadeIn(200);
        },

        onHideTooltip: function () {
            this.tooltip.$el.stop(true).fadeOut(200);
        },

        onToggleTooltip: function () {
            if (this.tooltip.$el.css('display') === 'none') {
                this.onShowTooltip();
            }
            else {
                this.onHideTooltip();
            }
        }
    });
}));
