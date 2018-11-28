(function($){
    'use strict';

    var HierarchySelect = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.hierarchySelect.defaults, options);
        this.$button = this.$element.children('button');
        this.$menu = this.$element.children('.dropdown-menu');
        this.$menuInner = this.$menu.children('.hs-menu-inner');
        this.$searchbox = this.$menu.find('input');
        this.$hiddenField = this.$element.children('input');
        this.previouslySelected = null;
        this.init();
    };

    HierarchySelect.prototype = {
        constructor: HierarchySelect,
        init: function() {
            this.setWidth();
            this.setHeight();
            this.initSelect();
            this.clickListener();
            this.buttonListener();
            this.searchListener();
        },
        initSelect: function() {
            var item = this.$menuInner.find('a[data-default-selected]:first');
            if (item.length) {
                this.setValue(item.data('value'));
            } else {
                var firstItem = this.$menuInner.find('a:first');
                this.setValue(firstItem.data('value'));
            }
        },
        setWidth: function() {
            this.$searchbox.attr('size', 1); // Fix min-width
            if (this.options.width === 'auto') {
                var width = this.$menu.width();
                this.$element.css('min-width', width + 2 + 'px');
            } else if (this.options.width) {
                this.$element.css('width', this.options.width);
                this.$menu.css('min-width', this.options.width);
                this.$button.css('width', '100%');
            } else {
                this.$element.css('min-width', '42px');
            }
        },
        setHeight: function() {
            if (this.options.height) {
                this.$menu.css('overflow', 'hidden');
                this.$menuInner.css({
                    'max-height': this.options.height,
                    'overflow-y': 'auto'
                });
            }
        },
        getText: function() {
            return this.$button.text();
        },
        getValue: function() {
            return this.$hiddenField.val();
        },
        setValue: function(value) {
            var a = this.$menuInner.children('a[data-value="' + value + '"]:first');
            this.setSelected(a);
        },
        enable: function() {
            this.$button.removeAttr('disabled');
        },
        disable: function() {
            this.$button.attr('disabled', 'disabled');
        },
        setSelected: function(a) {
            if (a.length && this.previouslySelected !== a) {
                var text = a.text();
                var value = a.data('value');
                this.previouslySelected = a;
                this.$button.html(text);
                this.$hiddenField.val(value);
                this.$menu.find('.active').removeClass('active');
                a.addClass('active');
            }
        },
        moveUp: function () {
            var items = this.$menuInner.find('a:not(.d-none,.disabled)');
            var active = this.$menuInner.find('.active');
            var index = items.index(active);
            if (typeof items[index - 1] !== 'undefined') {
                this.$menuInner.find('.active').removeClass('active');
                items[index - 1].classList.add('active');
                processElementOffset(this.$menuInner[0], items[index - 1]);
            }
        },
        moveDown: function () {
            var items = this.$menuInner.find('a:not(.d-none,.disabled)');
            var active = this.$menuInner.find('.active');
            var index = items.index(active);
            if (typeof items[index + 1] !== 'undefined') {
                this.$menuInner.find('.active').removeClass('active');
                if (items[index + 1]) {
                    items[index + 1].classList.add('active');
                    processElementOffset(this.$menuInner[0], items[index + 1]);
                }
            }
        },
        selectItem: function () {
            var that = this;
            var selected = this.$menuInner.find('.active');
            if (selected.hasClass('d-none') || selected.hasClass('disabled')) {
                return;
            }
            setTimeout(function() {
                that.$button.focus();
            }, 5);
            selected && this.setSelected(selected);
            this.$button.dropdown('toggle');
        },
        clickListener: function() {
            var that = this;
            this.$element.on('show.bs.dropdown', function() {
                var selected = that.$menuInner.find('.active');
                selected && setTimeout(function() {
                    var el = selected[0];
                    var p = selected[0].parentNode;
                    if (!(p.scrollTop <= el.offsetTop - p.offsetTop && (p.scrollTop + p.clientHeight) > el.offsetTop + el.clientHeight)) {
                        el.parentNode.scrollTop = el.offsetTop - el.parentNode.offsetTop;
                    }
                }, 0);
            });
            this.$element.on('hide.bs.dropdown', function() {
                that.previouslySelected && that.setSelected(that.previouslySelected);
            });
            this.$element.on('shown.bs.dropdown', function() {
                that.previouslySelected = that.$menuInner.find('.active');
                that.$searchbox.focus();
            });
            this.$menuInner.on('click', 'a', function (e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('disabled')) {
                    e.stopPropagation();
                } else {
                    that.setSelected($this);
                }
            });
        },
        buttonListener: function () {
            var that = this;
            if (this.options.search) {
                return;
            }
            this.$button.on('keydown', function (e) {
                switch (e.keyCode) {
                    case 9: // Tab
                        if (that.$element.hasClass('show')) {
                            e.preventDefault();
                        }
                        break;
                    case 13: // Enter
                        if (that.$element.hasClass('show')) {
                            e.preventDefault();
                            that.selectItem();
                        }
                        break;
                    case 27: // Esc
                        if (that.$element.hasClass('show')) {
                            e.preventDefault();
                            e.stopPropagation();
                            that.$button.focus();
                            that.previouslySelected && that.setSelected(that.previouslySelected);
                            that.$button.dropdown('toggle');
                        }
                        break;
                    case 38: // Up
                        if (that.$element.hasClass('show')) {
                            e.preventDefault();
                            e.stopPropagation();
                            that.moveUp();
                        }
                        break;
                    case 40: // Down
                        if (that.$element.hasClass('show')) {
                            e.preventDefault();
                            e.stopPropagation();
                            that.moveDown();
                        }
                        break;
                    default:
                        break;
                }
            });
        },
        searchListener: function() {
            var that = this;
            if (!this.options.search) {
                this.$searchbox.parent().toggleClass('d-none', true);
                return;
            }
            function disableParents(element) {
                var item = element;
                var level = item.data('level');
                while (typeof item === 'object' && item.length > 0 && level > 1) {
                    level--;
                    item = item.prevAll('a[data-level="' + level + '"]:first');
                    if (item.hasClass('d-none')) {
                        item.toggleClass('disabled', true);
                        item.removeClass('d-none');
                    }
                }
            }
            this.$searchbox.on('keydown', function (e) {
                switch (e.keyCode) {
                    case 9: // Tab
                        e.preventDefault();
                        e.stopPropagation();
                        that.$menuInner.click();
                        that.$button.focus();
                        break;
                    case 13: // Enter
                        that.selectItem();
                        break;
                    case 27: // Esc
                        e.preventDefault();
                        e.stopPropagation();
                        that.$button.focus();
                        that.previouslySelected && that.setSelected(that.previouslySelected);
                        that.$button.dropdown('toggle');
                        break;
                    case 38: // Up
                        e.preventDefault();
                        that.moveUp();
                        break;
                    case 40: // Down
                        e.preventDefault();
                        that.moveDown();
                        break;
                    default:
                        break;
                }
            });
            this.$searchbox.on('input propertychange', function (e) {
                e.preventDefault();
                var searchString = that.$searchbox.val().toLowerCase();
                var items = that.$menuInner.find('a');
                if (searchString.length === 0) {
                    items.each(function() {
                        var item = $(this);
                        item.toggleClass('disabled', false);
                        item.toggleClass('d-none', false);
                    });
                } else {
                    items.each(function() {
                        var item = $(this);
                        var text = item.text().toLowerCase();
                        if (text.indexOf(searchString) !== -1) {
                            item.toggleClass('disabled', false);
                            item.toggleClass('d-none', false);
                            if (that.options.hierarchy) {
                                disableParents(item);
                            }
                        } else {
                            item.toggleClass('disabled', false);
                            item.toggleClass('d-none', true);
                        }
                    });
                }
            });
        }
    };

    var Plugin = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var method;
        var chain = this.each(function() {
            var $this   = $(this);
            var data    = $this.data('HierarchySelect');
            var options = typeof option === 'object' && option;
            if (!data) {
                $this.data('HierarchySelect', (data = new HierarchySelect(this, options)));
            }
            if (typeof option === 'string') {
                method = data[option].apply(data, args);
            }
        });

        return (method === undefined) ? chain : method;
    };

    var old = $.fn.hierarchySelect;

    $.fn.hierarchySelect = Plugin;
    $.fn.hierarchySelect.defaults = {
        width: 'auto',
        height: '256px',
        hierarchy: true,
        search: true
    };
    $.fn.hierarchySelect.Constructor = HierarchySelect;

    $.fn.hierarchySelect.noConflict = function () {
        $.fn.hierarchySelect = old;
        return this;
    };

    function processElementOffset(parent, element) {
        if (parent.offsetHeight + parent.scrollTop < element.offsetTop + element.offsetHeight) {
            parent.scrollTop = element.offsetTop + element.offsetHeight - parent.offsetHeight;
        } else if (parent.scrollTop >= element.offsetTop - parent.offsetTop) {
            parent.scrollTop = element.offsetTop - parent.offsetTop;
        }
    }
})(jQuery);
