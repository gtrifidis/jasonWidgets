/*
 * Source code in this file is part of the d3 library
 * https://github.com/mbostock/d3
 * Copyright (c) 2010-2015, Michael Bostock
 * All rights reserved.
 */
jw.data = {};

jw.data.map = function (object, f) {
    var map = new jw_Map();
    if (object instanceof jw_Map) {
        object.forEach(function (key, value) {
            map.set(key, value);
        });
    } else if (Array.isArray(object)) {
        var i = -1, n = object.length, o;
        if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    } else {
        for (var key in object) map.set(key, object[key]);
    }
    return map;
};
function jw_Map() {
    this._ = Object.create(null);
}
var jw_map_proto = "__proto__", jw_map_zero = "\x00";
jw_class(jw_Map, {
    has: jw_map_has,
    get: function (key) {
        return this._[jw_map_escape(key)];
    },
    set: function (key, value) {
        return this._[jw_map_escape(key)] = value;
    },
    remove: jw_map_remove,
    keys: jw_map_keys,
    values: function () {
        var values = [];
        for (var key in this._) values.push(this._[key]);
        return values;
    },
    entries: function () {
        var entries = [];
        for (var key in this._) entries.push({
            key: jw_map_unescape(key),
            value: this._[key]
        });
        return entries;
    },
    size: jw_map_size,
    empty: jw_map_empty,
    forEach: function (f) {
        for (var key in this._) f.call(this, jw_map_unescape(key), this._[key]);
    }
});
function jw_map_escape(key) {
    return (key += "") === jw_map_proto || key[0] === jw_map_zero ? jw_map_zero + key : key;
}
function jw_map_unescape(key) {
    return (key += "")[0] === jw_map_zero ? key.slice(1) : key;
}
function jw_map_has(key) {
    return jw_map_escape(key) in this._;
}
function jw_map_remove(key) {
    return (key = jw_map_escape(key)) in this._ && delete this._[key];
}
function jw_map_keys() {
    var keys = [];
    for (var key in this._) keys.push(jw_map_unescape(key));
    return keys;
}
function jw_map_size() {
    var size = 0;
    for (var key in this._)++size;
    return size;
}
function jw_map_empty() {
    for (var key in this._) return false;
    return true;
}

function jw_class(ctor, properties) {
    for (var key in properties) {
        Object.defineProperty(ctor.prototype, key, {
            value: properties[key],
            enumerable: false
        });
    }
}
jw.data.nest = function () {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
        if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
        var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new jw_Map(), values;
        while (++i < n) {
            object = array[i];
            keyValue = key.field ? object[key.field] : key.callBack(object);
            if (values = valuesByKey.get(keyValue)) {
                values.push(object);
            } else {
                valuesByKey.set(keyValue, [object]);
            }
        }
        if (mapType) {
            object = mapType();
            setter = function (keyValue, values) {
                object.set(keyValue, map(mapType, values, depth));
            };
        } else {
            object = {};
            setter = function (keyValue, values) {
                object[keyValue] = map(mapType, values, depth);
            };
        }
        valuesByKey.forEach(setter);
        return object;
    }
    function entries(map, depth) {
        if (depth >= keys.length) return map;
        var array = [], sortKey = sortKeys[depth++];
        map.forEach(function (key, keyMap) {
            array.push({
                key: key,
                values: entries(keyMap, depth),
                level:depth - 1
            });
        });
        return sortKey ? array.sort(function (a, b) {
            return sortKey(a.key, b.key);
        }) : array;
    }
    nest.map = function (array, mapType) {
        return map(mapType, array, 0);
    };
    nest.entries = function (array) {
        return entries(map(jw.data.map, array, 0), 0);
    };
    nest.key = function (callBack,field) {
        keys.push({callBack:callBack,field:field});
        return nest;
    };
    nest.sortKeys = function (order) {
        sortKeys[keys.length - 1] = order;
        return nest;
    };
    nest.sortValues = function (order) {
        sortValues = order;
        return nest;
    };
    nest.rollup = function (f) {
        rollup = f;
        return nest;
    };
    return nest;
};