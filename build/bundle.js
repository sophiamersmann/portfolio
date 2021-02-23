
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const blobs = new Map([
      ['mail-front', 'M44.3,-65C56.3,-52.3,64.1,-37.8,67,-23.1C69.8,-8.5,67.7,6.4,63.4,20.9C59,35.3,52.5,49.4,41.6,56.3C30.7,63.3,15.3,63.2,-1.2,64.9C-17.7,66.5,-35.5,69.9,-49.3,63.8C-63.2,57.8,-73.2,42.4,-75.5,26.6C-77.8,10.7,-72.4,-5.5,-66.2,-20.5C-59.9,-35.4,-52.7,-49,-41.5,-62C-30.3,-74.9,-15.1,-87.3,0.5,-88C16.2,-88.7,32.3,-77.7,44.3,-65Z'],
      ['mail-back', 'M43.5,-62.1C55.3,-51.3,62.9,-37.1,69.7,-21.4C76.5,-5.7,82.5,11.5,80.4,28.7C78.4,45.8,68.3,63,53.5,74.4C38.8,85.8,19.4,91.5,2.4,88.2C-14.6,84.9,-29.2,72.6,-40.1,59.9C-50.9,47.2,-58.1,34.2,-65.9,19.3C-73.8,4.3,-82.4,-12.6,-79.2,-26.8C-76.1,-41,-61.2,-52.4,-46.1,-62.1C-30.9,-71.8,-15.5,-79.7,0.2,-80C15.9,-80.3,31.7,-72.9,43.5,-62.1Z'],
      ['twitter-front', 'M45.3,-63.4C56.8,-54.1,62.7,-38.2,63.8,-23.4C64.8,-8.7,61,5,54.8,15.8C48.5,26.7,39.8,34.8,30.3,39.3C20.8,43.9,10.4,45,-4.6,51.3C-19.6,57.6,-39.2,69.2,-48.7,64.7C-58.3,60.1,-57.9,39.4,-61.9,21.4C-66,3.4,-74.5,-11.8,-74,-27.3C-73.5,-42.9,-63.9,-58.9,-50.1,-67.4C-36.2,-75.9,-18.1,-77,-0.6,-76.2C17,-75.4,33.9,-72.7,45.3,-63.4Z'],
      ['twitter-back', 'M47.8,-63C63,-54.8,77.1,-42.2,82.6,-26.5C88.1,-10.9,85.1,7.9,78.8,25.1C72.5,42.2,62.9,57.8,49.2,68.5C35.5,79.2,17.8,85.1,1.9,82.5C-14,79.9,-27.9,68.8,-38,56.9C-48.2,45,-54.4,32.4,-60.4,18.6C-66.4,4.7,-72,-10.3,-68.3,-22.3C-64.6,-34.4,-51.5,-43.6,-38.5,-52.6C-25.6,-61.5,-12.8,-70.2,1.8,-72.6C16.3,-75,32.6,-71.2,47.8,-63Z'],
      ['github-front', 'M48.6,-64.5C63.6,-56,76.7,-42.6,77.7,-28C78.7,-13.4,67.5,2.5,60,17.7C52.6,32.9,48.8,47.5,39.4,56.6C30.1,65.6,15,69.2,-0.7,70.1C-16.3,71,-32.7,69.3,-44.1,60.8C-55.5,52.4,-62.1,37.3,-62.6,23.3C-63.1,9.2,-57.7,-3.9,-55.7,-20.5C-53.6,-37.2,-55,-57.4,-46.3,-68C-37.6,-78.6,-18.8,-79.7,-1,-78.3C16.8,-77,33.6,-73.1,48.6,-64.5Z'],
      ['github-back', 'M48.4,-63.6C64.1,-55.2,79.1,-42.9,84.1,-27.4C89.1,-11.8,84.1,6.9,77.1,24C70.1,41.1,61.2,56.5,48,65.3C34.8,74.1,17.4,76.3,1,74.9C-15.4,73.5,-30.7,68.5,-41.7,59C-52.7,49.4,-59.2,35.4,-65.9,20.1C-72.6,4.9,-79.4,-11.6,-77.1,-26.9C-74.7,-42.3,-63.1,-56.5,-48.7,-65.4C-34.3,-74.2,-17.1,-77.7,-0.4,-77.1C16.4,-76.6,32.7,-72,48.4,-63.6Z'],
    ]);

    /* src/components/Blob.svelte generated by Svelte v3.32.3 */
    const file = "src/components/Blob.svelte";

    function create_fragment(ctx) {
    	let svg;
    	let path;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", blobs.get(/*key*/ ctx[2]));
    			attr_dev(path, "transform", "translate(100 100)");
    			add_location(path, file, 10, 2, 216);
    			attr_dev(svg, "class", svg_class_value = "blob blob-" + /*position*/ ctx[1] + " blob-" + /*icon*/ ctx[0] + " svelte-mlv4ww");
    			attr_dev(svg, "viewBox", "0 0 200 200");
    			add_location(svg, file, 9, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*position, icon*/ 3 && svg_class_value !== (svg_class_value = "blob blob-" + /*position*/ ctx[1] + " blob-" + /*icon*/ ctx[0] + " svelte-mlv4ww")) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Blob", slots, []);
    	let { icon } = $$props;
    	let { position } = $$props;
    	const key = [icon, position].join("-");
    	const writable_props = ["icon", "position"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Blob> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    		if ("position" in $$props) $$invalidate(1, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({ blobs, icon, position, key });

    	$$self.$inject_state = $$props => {
    		if ("icon" in $$props) $$invalidate(0, icon = $$props.icon);
    		if ("position" in $$props) $$invalidate(1, position = $$props.position);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, position, key];
    }

    class Blob extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { icon: 0, position: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blob",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !("icon" in props)) {
    			console.warn("<Blob> was created without expected prop 'icon'");
    		}

    		if (/*position*/ ctx[1] === undefined && !("position" in props)) {
    			console.warn("<Blob> was created without expected prop 'position'");
    		}
    	}

    	get icon() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const icons = new Map([
      ['mail', 'M256 8C118.941 8 8 118.919 8 256c0 137.059 110.919 248 248 248 48.154 0 95.342-14.14 135.408-40.223 12.005-7.815 14.625-24.288 5.552-35.372l-10.177-12.433c-7.671-9.371-21.179-11.667-31.373-5.129C325.92 429.757 291.314 440 256 440c-101.458 0-184-82.542-184-184S154.542 72 256 72c100.139 0 184 57.619 184 160 0 38.786-21.093 79.742-58.17 83.693-17.349-.454-16.91-12.857-13.476-30.024l23.433-121.11C394.653 149.75 383.308 136 368.225 136h-44.981a13.518 13.518 0 0 0-13.432 11.993l-.01.092c-14.697-17.901-40.448-21.775-59.971-21.775-74.58 0-137.831 62.234-137.831 151.46 0 65.303 36.785 105.87 96 105.87 26.984 0 57.369-15.637 74.991-38.333 9.522 34.104 40.613 34.103 70.71 34.103C462.609 379.41 504 307.798 504 232 504 95.653 394.023 8 256 8zm-21.68 304.43c-22.249 0-36.07-15.623-36.07-40.771 0-44.993 30.779-72.729 58.63-72.729 22.292 0 35.601 15.241 35.601 40.77 0 45.061-33.875 72.73-58.161 72.73z'],
      ['twitter', 'M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z'],
      ['github', 'M256 70.7c-102.6 0-185.9 83.2-185.9 185.9 0 82.1 53.3 151.8 127.1 176.4 9.3 1.7 12.3-4 12.3-8.9V389.4c-51.7 11.3-62.5-21.9-62.5-21.9 -8.4-21.5-20.6-27.2-20.6-27.2 -16.9-11.5 1.3-11.3 1.3-11.3 18.7 1.3 28.5 19.2 28.5 19.2 16.6 28.4 43.5 20.2 54.1 15.4 1.7-12 6.5-20.2 11.8-24.9 -41.3-4.7-84.7-20.6-84.7-91.9 0-20.3 7.3-36.9 19.2-49.9 -1.9-4.7-8.3-23.6 1.8-49.2 0 0 15.6-5 51.1 19.1 14.8-4.1 30.7-6.2 46.5-6.3 15.8 0.1 31.7 2.1 46.6 6.3 35.5-24 51.1-19.1 51.1-19.1 10.1 25.6 3.8 44.5 1.8 49.2 11.9 13 19.1 29.6 19.1 49.9 0 71.4-43.5 87.1-84.9 91.7 6.7 5.8 12.8 17.1 12.8 34.4 0 24.9 0 44.9 0 51 0 4.9 3 10.7 12.4 8.9 73.8-24.6 127-94.3 127-176.4C441.9 153.9 358.6 70.7 256 70.7z'],
    ]);

    /* src/components/Icon.svelte generated by Svelte v3.32.3 */
    const file$1 = "src/components/Icon.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let path;
    	let path_d_value;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = icons.get(/*type*/ ctx[0]));
    			add_location(path, file$1, 7, 2, 127);
    			attr_dev(svg, "class", svg_class_value = "icon " + /*type*/ ctx[0] + " svelte-1cd6int");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$1, 6, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*type*/ 1 && path_d_value !== (path_d_value = icons.get(/*type*/ ctx[0]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*type*/ 1 && svg_class_value !== (svg_class_value = "icon " + /*type*/ ctx[0] + " svelte-1cd6int")) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { type } = $$props;
    	const writable_props = ["type"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ type, icons });

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { type: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[0] === undefined && !("type" in props)) {
    			console.warn("<Icon> was created without expected prop 'type'");
    		}
    	}

    	get type() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/LinkWrapper.svelte generated by Svelte v3.32.3 */

    const file$2 = "src/components/LinkWrapper.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", /*url*/ ctx[0]);
    			attr_dev(a, "class", "svelte-sfptub");
    			add_location(a, file$2, 4, 0, 38);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*url*/ 1) {
    				attr_dev(a, "href", /*url*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LinkWrapper", slots, ['default']);
    	let { url } = $$props;
    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LinkWrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ url });

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, $$scope, slots];
    }

    class LinkWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkWrapper",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*url*/ ctx[0] === undefined && !("url" in props)) {
    			console.warn("<LinkWrapper> was created without expected prop 'url'");
    		}
    	}

    	get url() {
    		throw new Error("<LinkWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<LinkWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const social = [
      { name: 'mail', url: 'mailto:sophia.mersmann.blog@gmail.com' },
      { name: 'twitter', url: 'https://twitter.com/sophiamersmann' },
      { name: 'github', url: 'https://github.com/sophiamersmann' },
    ];

    /* src/components/SocialMedia.svelte generated by Svelte v3.32.3 */
    const file$3 = "src/components/SocialMedia.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].name;
    	child_ctx[1] = list[i].url;
    	return child_ctx;
    }

    // (12:6) <LinkWrapper {url}>
    function create_default_slot(ctx) {
    	let blob0;
    	let t0;
    	let blob1;
    	let t1;
    	let icon;
    	let current;

    	blob0 = new Blob({
    			props: { icon: /*name*/ ctx[0], position: "back" },
    			$$inline: true
    		});

    	blob1 = new Blob({
    			props: { icon: /*name*/ ctx[0], position: "front" },
    			$$inline: true
    		});

    	icon = new Icon({
    			props: { type: /*name*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(blob0.$$.fragment);
    			t0 = space();
    			create_component(blob1.$$.fragment);
    			t1 = space();
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blob0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(blob1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blob0.$$.fragment, local);
    			transition_in(blob1.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blob0.$$.fragment, local);
    			transition_out(blob1.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blob0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(blob1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(12:6) <LinkWrapper {url}>",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each social as { name, url }
    function create_each_block(key_1, ctx) {
    	let div;
    	let linkwrapper;
    	let t;
    	let current;

    	linkwrapper = new LinkWrapper({
    			props: {
    				url: /*url*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(linkwrapper.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "brand-icon svelte-1sh4z0s");
    			add_location(div, file$3, 10, 4, 256);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(linkwrapper, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const linkwrapper_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				linkwrapper_changes.$$scope = { dirty, ctx };
    			}

    			linkwrapper.$set(linkwrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linkwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linkwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(linkwrapper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(10:2) {#each social as { name, url }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = social;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*name*/ ctx[0];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "social-media svelte-1sh4z0s");
    			add_location(div, file$3, 8, 0, 184);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*social*/ 0) {
    				each_value = social;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SocialMedia", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SocialMedia> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Blob, Icon, LinkWrapper, social });
    	return [];
    }

    class SocialMedia extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SocialMedia",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.32.3 */
    const file$4 = "src/components/Header.svelte";

    function create_fragment$4(ctx) {
    	let header;
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let socialmedia;
    	let current;
    	socialmedia = new SocialMedia({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Sophia Mersmann";
    			t2 = space();
    			create_component(socialmedia.$$.fragment);
    			if (img.src !== (img_src_value = "memoji.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Memoji");
    			attr_dev(img, "width", "120");
    			attr_dev(img, "height", "120");
    			attr_dev(img, "class", "svelte-cmqlpq");
    			add_location(img, file$4, 6, 4, 105);
    			attr_dev(h1, "class", "svelte-cmqlpq");
    			add_location(h1, file$4, 7, 4, 173);
    			attr_dev(div, "class", "brand svelte-cmqlpq");
    			add_location(div, file$4, 5, 2, 81);
    			attr_dev(header, "class", "svelte-cmqlpq");
    			add_location(header, file$4, 4, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, h1);
    			append_dev(header, t2);
    			mount_component(socialmedia, header, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(socialmedia.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(socialmedia.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(socialmedia);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SocialMedia });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/Tags.svelte generated by Svelte v3.32.3 */

    const file$5 = "src/components/Tags.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each tags as tag}
    function create_each_block$1(ctx) {
    	let span;
    	let t_value = /*tag*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-fed7kt");
    			add_location(span, file$5, 6, 4, 89);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tags*/ 1 && t_value !== (t_value = /*tag*/ ctx[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(6:2) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_value = /*tags*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "tags svelte-fed7kt");
    			add_location(div, file$5, 4, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tags*/ 1) {
    				each_value = /*tags*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tags", slots, []);
    	let { tags = [] } = $$props;
    	const writable_props = ["tags"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tags> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("tags" in $$props) $$invalidate(0, tags = $$props.tags);
    	};

    	$$self.$capture_state = () => ({ tags });

    	$$self.$inject_state = $$props => {
    		if ("tags" in $$props) $$invalidate(0, tags = $$props.tags);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tags];
    }

    class Tags extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { tags: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tags",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get tags() {
    		throw new Error("<Tags>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tags(value) {
    		throw new Error("<Tags>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.32.3 */
    const file$6 = "src/components/Card.svelte";

    // (25:2) <LinkWrapper {url}>
    function create_default_slot_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*imageUrl*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[0]);
    			attr_dev(img, "width", "512");
    			attr_dev(img, "height", "384");
    			attr_dev(img, "class", "svelte-1vlms5b");
    			add_location(img, file$6, 25, 4, 585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageUrl*/ 32 && img.src !== (img_src_value = /*imageUrl*/ ctx[5])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 1) {
    				attr_dev(img, "alt", /*title*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(25:2) <LinkWrapper {url}>",
    		ctx
    	});

    	return block;
    }

    // (30:6) <LinkWrapper {url}>
    function create_default_slot_1(ctx) {
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let t3;
    	let tags_1;
    	let current;

    	tags_1 = new Tags({
    			props: { tags: /*tags*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*subtitle*/ ctx[1]);
    			t3 = space();
    			create_component(tags_1.$$.fragment);
    			attr_dev(span0, "class", "title svelte-1vlms5b");
    			add_location(span0, file$6, 30, 8, 742);
    			attr_dev(span1, "class", "subtitle svelte-1vlms5b");
    			add_location(span1, file$6, 31, 8, 785);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t2);
    			insert_dev(target, t3, anchor);
    			mount_component(tags_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*subtitle*/ 2) set_data_dev(t2, /*subtitle*/ ctx[1]);
    			const tags_1_changes = {};
    			if (dirty & /*tags*/ 4) tags_1_changes.tags = /*tags*/ ctx[2];
    			tags_1.$set(tags_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tags_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tags_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t3);
    			destroy_component(tags_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(30:6) <LinkWrapper {url}>",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#if githubUrl}
    function create_if_block(ctx) {
    	let span;
    	let t1;
    	let linkwrapper;
    	let current;

    	linkwrapper = new LinkWrapper({
    			props: {
    				url: /*githubUrl*/ ctx[6],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "/";
    			t1 = space();
    			create_component(linkwrapper.$$.fragment);
    			attr_dev(span, "class", "separator svelte-1vlms5b");
    			add_location(span, file$6, 40, 8, 1043);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(linkwrapper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const linkwrapper_changes = {};
    			if (dirty & /*githubUrl*/ 64) linkwrapper_changes.url = /*githubUrl*/ ctx[6];

    			if (dirty & /*$$scope*/ 1024) {
    				linkwrapper_changes.$$scope = { dirty, ctx };
    			}

    			linkwrapper.$set(linkwrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linkwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linkwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			destroy_component(linkwrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:6) {#if githubUrl}",
    		ctx
    	});

    	return block;
    }

    // (42:8) <LinkWrapper url={githubUrl}>
    function create_default_slot$1(ctx) {
    	let div;
    	let t;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { type: "github" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("Source\n            ");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "icon-wrapper svelte-1vlms5b");
    			add_location(div, file$6, 42, 10, 1124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(42:8) <LinkWrapper url={githubUrl}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div3;
    	let linkwrapper0;
    	let t0;
    	let div2;
    	let div0;
    	let linkwrapper1;
    	let t1;
    	let div1;
    	let time;
    	let t2_value = /*date*/ ctx[3].toLocaleDateString("en-UK", /*dateOptions*/ ctx[7]) + "";
    	let t2;
    	let t3;
    	let current;

    	linkwrapper0 = new LinkWrapper({
    			props: {
    				url: /*url*/ ctx[4],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	linkwrapper1 = new LinkWrapper({
    			props: {
    				url: /*url*/ ctx[4],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*githubUrl*/ ctx[6] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(linkwrapper0.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			create_component(linkwrapper1.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			time = element("time");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "top svelte-1vlms5b");
    			add_location(div0, file$6, 28, 4, 690);
    			attr_dev(time, "datetime", /*machineDate*/ ctx[8]);
    			add_location(time, file$6, 36, 6, 913);
    			attr_dev(div1, "class", "bottom svelte-1vlms5b");
    			add_location(div1, file$6, 35, 4, 886);
    			attr_dev(div2, "class", "caption svelte-1vlms5b");
    			add_location(div2, file$6, 27, 2, 664);
    			attr_dev(div3, "class", "card");
    			add_location(div3, file$6, 23, 0, 540);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(linkwrapper0, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(linkwrapper1, div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, time);
    			append_dev(time, t2);
    			append_dev(div1, t3);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const linkwrapper0_changes = {};
    			if (dirty & /*url*/ 16) linkwrapper0_changes.url = /*url*/ ctx[4];

    			if (dirty & /*$$scope, imageUrl, title*/ 1057) {
    				linkwrapper0_changes.$$scope = { dirty, ctx };
    			}

    			linkwrapper0.$set(linkwrapper0_changes);
    			const linkwrapper1_changes = {};
    			if (dirty & /*url*/ 16) linkwrapper1_changes.url = /*url*/ ctx[4];

    			if (dirty & /*$$scope, tags, subtitle, title*/ 1031) {
    				linkwrapper1_changes.$$scope = { dirty, ctx };
    			}

    			linkwrapper1.$set(linkwrapper1_changes);
    			if ((!current || dirty & /*date*/ 8) && t2_value !== (t2_value = /*date*/ ctx[3].toLocaleDateString("en-UK", /*dateOptions*/ ctx[7]) + "")) set_data_dev(t2, t2_value);

    			if (/*githubUrl*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*githubUrl*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linkwrapper0.$$.fragment, local);
    			transition_in(linkwrapper1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linkwrapper0.$$.fragment, local);
    			transition_out(linkwrapper1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(linkwrapper0);
    			destroy_component(linkwrapper1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, []);
    	let { title } = $$props;
    	let { subtitle } = $$props;
    	let { tags = [] } = $$props;
    	let { date = new Date() } = $$props;
    	let { url } = $$props;
    	let { imageUrl } = $$props;
    	let { githubUrl } = $$props;
    	const dateOptions = { month: "short", year: "numeric" };
    	const pad = num => num.toString().padStart(2, 0);
    	const machineDate = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-");
    	const writable_props = ["title", "subtitle", "tags", "date", "url", "imageUrl", "githubUrl"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("tags" in $$props) $$invalidate(2, tags = $$props.tags);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("imageUrl" in $$props) $$invalidate(5, imageUrl = $$props.imageUrl);
    		if ("githubUrl" in $$props) $$invalidate(6, githubUrl = $$props.githubUrl);
    	};

    	$$self.$capture_state = () => ({
    		LinkWrapper,
    		Tags,
    		Icon,
    		title,
    		subtitle,
    		tags,
    		date,
    		url,
    		imageUrl,
    		githubUrl,
    		dateOptions,
    		pad,
    		machineDate
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("tags" in $$props) $$invalidate(2, tags = $$props.tags);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("imageUrl" in $$props) $$invalidate(5, imageUrl = $$props.imageUrl);
    		if ("githubUrl" in $$props) $$invalidate(6, githubUrl = $$props.githubUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		subtitle,
    		tags,
    		date,
    		url,
    		imageUrl,
    		githubUrl,
    		dateOptions,
    		machineDate
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			title: 0,
    			subtitle: 1,
    			tags: 2,
    			date: 3,
    			url: 4,
    			imageUrl: 5,
    			githubUrl: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Card> was created without expected prop 'title'");
    		}

    		if (/*subtitle*/ ctx[1] === undefined && !("subtitle" in props)) {
    			console.warn("<Card> was created without expected prop 'subtitle'");
    		}

    		if (/*url*/ ctx[4] === undefined && !("url" in props)) {
    			console.warn("<Card> was created without expected prop 'url'");
    		}

    		if (/*imageUrl*/ ctx[5] === undefined && !("imageUrl" in props)) {
    			console.warn("<Card> was created without expected prop 'imageUrl'");
    		}

    		if (/*githubUrl*/ ctx[6] === undefined && !("githubUrl" in props)) {
    			console.warn("<Card> was created without expected prop 'githubUrl'");
    		}
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tags() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tags(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageUrl() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageUrl(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get githubUrl() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set githubUrl(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const cards = [
      {
        title: 'Switching the light off',
        subtitle: 'Academic journals\' impact factors without their star articles',
        tags: ['data visualisation', 'design & development', 'self-initiated', 'd3.js', 'svelte.js'],
        date: new Date(2021, 1, 23),
        url: 'https://sophiamersmann.github.io/impact-factors/',
        imageUrl: 'cards/card-impact-factors.webp',
        githubUrl: 'https://github.com/sophiamersmann/impact-factors'
      },
      {
        title: 'kleineAnfragen visualisiert',
        subtitle: 'Visualisierung kleiner und großer Anfragen aus dem Bundestag und aus den Landesparlamenten (Daten von kleineAnfragen.de)',
        tags: ['data visualisation', 'design & development', 'self-initiated', 'd3.js', 'Vue.js', 'politics'],
        date: new Date(2021, 0, 25),
        url: 'https://sophiamersmann.github.io/kleine-anfragen-visualised/',
        imageUrl: 'cards/card-kleine-anfragen.webp',
        githubUrl: 'https://github.com/sophiamersmann/kleine-anfragen-visualised'
      },
      {
        title: 'Minesweeper',
        subtitle: 'Built with Vue.js',
        tags: ['design & development', 'self-initiated', 'Vue.js', 'games'],
        date: new Date(2020, 9, 1),
        url: 'https://sophiamersmann.github.io/minesweeper/',
        imageUrl: 'cards/card-minesweeper.webp',
        githubUrl: 'https://github.com/sophiamersmann/minesweeper'
      },
      {
        title: 'Newcomer Parties To European Parliaments',
        subtitle: 'A visualisation of parties elected into parliament for the first time',
        tags: ['data visualisation', 'data analysis', 'design & development', 'self-initiated', 'd3.js', 'politics'],
        date: new Date(2020, 7, 1),
        url: 'https://sophiamersmann.github.io/newcomer-parties/',
        imageUrl: 'cards/card-newcomer-parties.webp',
        githubUrl: 'https://github.com/sophiamersmann/newcomer-parties'
      },
      {
        title: 'Rummy Calendar',
        subtitle: 'Of weeks and months when all we had was playing cards',
        tags: ['data visualisation', 'data collection & analysis', 'design & development', 'self-initiated', 'd3.js', 'corona'],
        date: new Date(2020, 5, 1),
        url: 'https://sophiamersmann.github.io/rummy-calendar/',
        imageUrl: 'cards/card-rummy-calendar.webp',
        githubUrl: 'https://github.com/sophiamersmann/rummy-calendar'
      },
      {
        title: 'ProteinLens',
        subtitle: 'A web server to explore allosteric communication within a protein (developed in the Yaliraki Group at Imperial College London)',
        tags: ['webserver', 'data visualisation', 'Django', 'd3.js', 'bioinformatics', 'Imperical College London'],
        date: new Date(2019, 8, 1),
        url: 'https://proteinlens.io/',
        imageUrl: 'cards/card-proteinlens.webp',
        githubUrl: null,
      },
      {
        title: 'Posterior Error Probability Estimation for Peptide Search Engine Results in OpenMS',
        subtitle: 'As part of Google Summer of Code 2018 (Master thesis)',
        tags: ['research', 'master thesis', 'data visualisation', 'd3.js', 'Imperical College London'],
        date: new Date(2020, 8, 1),
        url: 'https://sophiamersmann.github.io/master-thesis/',
        imageUrl: 'cards/card-master-thesis.webp',
        githubUrl: 'https://github.com/sophiamersmann/master-thesis'
      }
    ];

    /* src/components/CardStack.svelte generated by Svelte v3.32.3 */
    const file$7 = "src/components/CardStack.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (8:2) {#each cards as card (card.title)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let card;
    	let current;
    	const card_spread_levels = [/*card*/ ctx[0]];
    	let card_props = {};

    	for (let i = 0; i < card_spread_levels.length; i += 1) {
    		card_props = assign(card_props, card_spread_levels[i]);
    	}

    	card = new Card({ props: card_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(card.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const card_changes = (dirty & /*cards*/ 0)
    			? get_spread_update(card_spread_levels, [get_spread_object(/*card*/ ctx[0])])
    			: {};

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(8:2) {#each cards as card (card.title)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = cards;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*card*/ ctx[0].title;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "stack svelte-149oxck");
    			add_location(div, file$7, 6, 0, 96);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cards*/ 0) {
    				each_value = cards;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardStack", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CardStack> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card, cards });
    	return [];
    }

    class CardStack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardStack",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.3 */
    const file$8 = "src/App.svelte";

    function create_fragment$8(ctx) {
    	let header;
    	let t;
    	let main;
    	let cardstack;
    	let current;
    	header = new Header({ $$inline: true });
    	cardstack = new CardStack({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			main = element("main");
    			create_component(cardstack.$$.fragment);
    			add_location(main, file$8, 6, 0, 139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(cardstack, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(cardstack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(cardstack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			destroy_component(cardstack);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, CardStack });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
