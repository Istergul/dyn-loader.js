/*
 * Copyright (c) Sergei "Istergul" Menzhulov <istergul@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

if (typeof Array.isArray === "undefined") {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    };
}

/**
 * @method  add       add function to queue
 * @method  interate  call first function in queue and remove it from queue
 * @method  clear     clear queue
 */
var Queue = function () {
    this.members = [];
};

Queue.prototype = {
    add: function (f) {
        if (f instanceof Function) {
            this.members.push(f);
        }
    },
    iterate: function () {
        if (this.members.length > 0) {
            var func = this.members.shift();
            func.call(this);
        }
    },
    clear: function () {
        this.members = [];
    }
};

/**
 * @method  add             add paths to js and css
 * @method  _createNode     create DOM element with passed attributes
 * @method _postHandling    if DOM element loaded, go to the next iteration
 * @method run              run load process
 */
var DynamicLoader = function() {
    this.queue = new Queue();
    this._defaultClasses = {js: "dynJS", css: "dynCSS"};
};

DynamicLoader.prototype = {
    add: function(opts) {
        var i, tp, el, types;
        var lists = {"css": [], "js": []};
        var classNames = {"css": this._defaultClasses["css"], "js": this._defaultClasses["js"]};
        if (Array.isArray(opts)) {
            lists["js"] = opts;
        } else {
            types = ["css", "js"];
            for (el in types) {
                tp = types[el];
                if (opts.hasOwnProperty(tp)) {
                    if (opts[tp].hasOwnProperty('className')) {
                        lists[tp] = opts[tp].list;
                        classNames[tp] = opts[tp].className;
                    } else {
                        lists[tp] = opts[tp];
                    }
                }
            }
        }

        if (!!lists["css"].length) {
            for (i in lists["css"]) {
                this._createNode("link", "head", {
                    href: lists["css"][i],
                    rel: "stylesheet",
                    type: "text/css",
                    className: classNames["css"]
                });
            }
        }
        if (!!lists["js"].length) {
            for (i in lists["js"]) {
                this._createNode("script", "body", {
                    src: lists["js"][i],
                    type: "text/javascript",
                    className: classNames["js"]
                });
            }
        }
    },

    _createNode: function(nodeName, toNode, attrs) {
        var me = this;
        me.queue.add(function() {
            var appendNode, node, i;
            appendNode = document.getElementsByTagName(toNode);
            if (appendNode.length > 0) {
                appendNode = appendNode[0];
                node = document.createElement(nodeName);
                for (i in attrs) if (attrs.hasOwnProperty(i)) {
                    node[i] = attrs[i];
                }
                node.onload = node.onreadystatechange = function() {
                    me._postHandling.apply(this, [me, node]);
                };
                appendNode.appendChild(node);
            }
        });
    },

    _postHandling: function(me, node) {
        if ((!this.readyState) || (this.readyState === "loaded") || (this.readyState === "complete")) {
            me.queue.iterate();
            node.onload = node.onreadystatechange = null;
        }
    },

    run: function () {
        this.queue.iterate();
    }
};

