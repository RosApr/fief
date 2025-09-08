const defaultObj = {};
const jointIter = (aProps, bProps, callback) => {
    aProps = aProps || defaultObj;
    bProps = bProps || defaultObj;
    Object.keys(aProps).forEach((k) => callback(k, aProps[k], bProps[k]));
    Object.keys(bProps).forEach((k) => !aProps.hasOwnProperty(k) && callback(k, undefined, bProps[k]));
};
const updateElement = (dom, aProps, bProps) => {
    jointIter(aProps, bProps, (name, a, b) => {
        if (a === b || name === 'children') ;
        else if (name === 'style' && !isStr(b)) {
            jointIter(a, b, (styleKey, aStyle, bStyle) => {
                if (aStyle !== bStyle) {
                    dom[name][styleKey] = bStyle || '';
                }
            });
        }
        else if (name[0] === 'o' && name[1] === 'n') {
            name = name.slice(2).toLowerCase();
            if (a)
                dom.removeEventListener(name, a);
            dom.addEventListener(name, b);
        }
        else if (name in dom && !(dom instanceof SVGElement)) {
            dom[name] = b || '';
        }
        else if (b == null || b === false) {
            dom.removeAttribute(name);
        }
        else {
            dom.setAttribute && (dom === null || dom === void 0 ? void 0 : dom.setAttribute(name, b));
        }
    });
};
const createElement = (fiber) => {
    const dom = fiber.type === '#text'
        ? document.createTextNode('')
        : fiber.lane & 16
            ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
            : document.createElement(fiber.type);
    updateElement(dom, {}, fiber.props);
    return dom;
};

const EMPTY_ARR = [];
let cursor = 0;
const resetCursor = () => {
    cursor = 0;
};
const useState = (initState) => {
    return useReducer(null, initState);
};
const useReducer = (reducer, initState) => {
    const [hook, current] = getSlot(cursor++);
    if (hook.length === 0) {
        hook[0] = isFn(initState) ? initState() : initState;
    }
    hook[1] = (value) => {
        let v = reducer
            ? reducer(hook[0], value)
            : isFn(value)
                ? value(hook[0])
                : value;
        if (hook[0] !== v) {
            hook[0] = v;
            if (typeof window !== 'undefined') {
                update(current);
            }
        }
    };
    return hook;
};
const useEffect = (cb, deps) => {
    return effectImpl(cb, deps, 'effect');
};
const useLayout = (cb, deps) => {
    return effectImpl(cb, deps, 'layout');
};
const effectImpl = (cb, deps, key) => {
    const [hook, current] = getSlot(cursor++);
    if (isChanged(hook[1], deps)) {
        hook[0] = cb;
        hook[1] = deps;
        current.hooks[key].push(hook);
    }
};
const useMemo = (cb, deps) => {
    const hook = getSlot(cursor++)[0];
    if (isChanged(hook[1], deps)) {
        hook[1] = deps;
        return (hook[0] = cb());
    }
    return hook[0];
};
const useCallback = (cb, deps) => {
    return useMemo(() => cb, deps);
};
const useRef = (current) => {
    return useMemo(() => ({ current }), []);
};
const getSlot = (cursor) => {
    const current = useFiber();
    const hooks = current.hooks || (current.hooks = { list: [], effect: [], layout: [] });
    if (cursor >= hooks.list.length) {
        hooks.list.push([]);
    }
    return [hooks.list[cursor], current];
};
const createContext = (value) => {
    const C = ({ value, children }) => {
        const ref = useRef(value);
        const subs = useMemo(() => new Set(), EMPTY_ARR);
        if (ref.current !== value) {
            ref.current = value;
            subs.forEach(cb => cb());
        }
        return children;
    };
    C.initialValue = value;
    return C;
};
const useContext = (ctx) => {
    const update = useReducer(null, null)[1];
    let subs;
    useEffect(() => () => subs === null || subs === void 0 ? void 0 : subs.delete(update), EMPTY_ARR);
    const fiber = getBoundary(useFiber(), ctx);
    return fiber
        ? (subs = (fiber.hooks.list[1][0]).add(update),
            fiber.hooks.list[0][0].current)
        : ctx.initialValue;
};
const isChanged = (a, b) => {
    return (!a ||
        a.length !== b.length ||
        b.some((arg, index) => !Object.is(arg, a[index])));
};

const queue = [];
const threshold = 5;
const transitions = [];
let deadline = 0;
const startTransition = (cb) => {
    transitions.push(cb) && translate();
};
const schedule = (callback) => {
    queue.push({ callback });
    startTransition(flush);
};
const task = (pending) => {
    const cb = () => transitions.splice(0, 1).forEach((c) => c());
    if (!pending && typeof queueMicrotask !== 'undefined') {
        return () => queueMicrotask(cb);
    }
    if (typeof MessageChannel !== 'undefined') {
        const { port1, port2 } = new MessageChannel();
        port1.onmessage = cb;
        return () => port2.postMessage(null);
    }
    return () => setTimeout(cb);
};
let translate = task(false);
const flush = () => {
    deadline = getTime() + threshold;
    let job = peek(queue);
    while (job && !shouldYield()) {
        const { callback } = job;
        job.callback = null;
        const next = callback();
        if (next) {
            job.callback = next;
        }
        else {
            queue.shift();
        }
        job = peek(queue);
    }
    job && (translate = task(shouldYield())) && startTransition(flush);
};
const shouldYield = () => {
    return getTime() >= deadline;
};
const getTime = () => performance.now();
const peek = (queue) => queue[0];

const commit = (fiber) => {
    var _a, _b;
    if (!fiber) {
        return;
    }
    refer(fiber.ref, fiber.node);
    commitSibling(fiber.child);
    let { op, ref, cur } = fiber.action || {};
    let parent = (_a = fiber === null || fiber === void 0 ? void 0 : fiber.parent) === null || _a === void 0 ? void 0 : _a.node;
    let suspenseNodeComment = null;
    if ((parent === null || parent === void 0 ? void 0 : parent.nodeType) === 8) {
        if ((parent === null || parent === void 0 ? void 0 : parent.nodeValue) === 'Suspense') {
            suspenseNodeComment = parent;
        }
        parent = parent.parentNode;
    }
    if (op & 4 || op & 64) {
        let comment = null;
        if (fiber.isComp) {
            comment = (_b = fiber === null || fiber === void 0 ? void 0 : fiber.node) === null || _b === void 0 ? void 0 : _b.firstChild;
        }
        parent.insertBefore(cur === null || cur === void 0 ? void 0 : cur.node, suspenseNodeComment !== null && suspenseNodeComment !== void 0 ? suspenseNodeComment : ref === null || ref === void 0 ? void 0 : ref.node);
        if (fiber.isComp) {
            fiber.node = comment;
        }
    }
    if (op & 2) {
        const node = fiber.node;
        updateElement(node, fiber.alternate.props || {}, fiber.props);
    }
    fiber.action = null;
    commitSibling(fiber.sibling);
};
function commitSibling(fiber) {
    if (fiber === null || fiber === void 0 ? void 0 : fiber.memo) {
        commitSibling(fiber.sibling);
    }
    else {
        commit(fiber);
    }
}
const refer = (ref, dom) => {
    if (ref)
        isFn(ref) ? ref(dom) : (ref.current = dom);
};
const kidsRefer = (kids) => {
    kids === null || kids === void 0 ? void 0 : kids.forEach((kid) => {
        kid.kids && kidsRefer(kid.kids);
        refer(kid.ref, null);
    });
};
const removeElement = (fiber, flag = true) => {
    var _a, _b, _c;
    if (fiber.isComp) {
        fiber.hooks && fiber.hooks.list.forEach((e) => e[2] && e[2]());
    }
    else {
        if (flag) {
            (_b = (_a = fiber.node) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(fiber.node);
            flag = false;
        }
        kidsRefer(fiber.kids);
        refer(fiber.ref, null);
    }
    (_c = fiber === null || fiber === void 0 ? void 0 : fiber.kids) === null || _c === void 0 ? void 0 : _c.forEach(v => removeElement(v, flag));
};

let domCursor = null;
if (!globalThis.currentFiber) {
    globalThis.currentFiber = null;
}
const options = {};
const render = (vnode, node) => {
    if (options.hydrate) {
        domCursor = options.hydrate(node);
    }
    let rootFiber = {
        node,
        props: { children: vnode },
        hydrating: !!options.hydrate
    };
    update(rootFiber);
};
const update = (fiber) => {
    if (!fiber.dirty) {
        fiber.dirty = true;
        schedule(() => reconcile(fiber));
    }
};
const reconcile = (fiber) => {
    while (fiber && !shouldYield()) {
        fiber = capture(fiber);
    }
    return fiber ? reconcile.bind(null, fiber) : null;
};
const getBoundary = (fiber, name) => {
    let current = fiber.parent;
    while (current) {
        if (current.type === name)
            return current;
        current = current.parent;
    }
    return null;
};
const suspense = (fiber, promise) => {
    const boundary = getBoundary(fiber, Suspense);
    if (!boundary)
        throw promise;
    boundary.kids = [];
    reconcileChidren(boundary, simpleVnode(boundary.props.fallback));
    promise.then(() => update(boundary));
    return boundary;
};
const capture = (fiber) => {
    fiber.isComp = isFn(fiber.type);
    if (domCursor && fiber.hydrating) {
        if (domCursor.type === fiber.type || domCursor.type === (fiber.type.name && `$${fiber.type.name}`)) {
            fiber.kids = domCursor.kids;
        }
        domCursor = domCursor.next;
    }
    if (fiber.isComp) {
        if (isMemo(fiber)) {
            fiber.memo = false;
            return sibling(fiber);
        }
        try {
            updateHook(fiber);
        }
        catch (e) {
            if (e instanceof Promise) {
                return suspense(fiber, e).child;
            }
            else
                throw e;
        }
    }
    else {
        updateHost(fiber);
    }
    return fiber.child || sibling(fiber);
};
const isMemo = (fiber) => {
    var _a, _b;
    if (fiber.type.memo &&
        fiber.type === ((_a = fiber.alternate) === null || _a === void 0 ? void 0 : _a.type) &&
        ((_b = fiber.alternate) === null || _b === void 0 ? void 0 : _b.props)) {
        let scu = fiber.type.shouldUpdate || shouldUpdate;
        if (!scu(fiber.props, fiber.alternate.props)) {
            return true;
        }
    }
    return false;
};
const sibling = (fiber) => {
    while (fiber) {
        bubble(fiber);
        if (fiber.dirty) {
            fiber.dirty = false;
            commit(fiber);
            return null;
        }
        if (fiber.sibling)
            return fiber.sibling;
        fiber = fiber.parent;
    }
    return null;
};
const bubble = (fiber) => {
    if (fiber.isComp) {
        if (fiber.hooks) {
            side(fiber.hooks.layout);
            schedule(() => side(fiber.hooks.effect));
        }
    }
};
const shouldUpdate = (a, b) => {
    for (let i in a)
        if (!(i in b))
            return true;
    for (let i in b)
        if (a[i] !== b[i])
            return true;
};
const fragment = (fiber) => {
    const f = document.createDocumentFragment();
    const c = document.createComment(fiber.type.name);
    f.appendChild(c);
    return f;
};
const updateHook = (fiber) => {
    resetCursor();
    resetFiber(fiber);
    fiber.node = fiber.node || fragment(fiber);
    let children = fiber.type(fiber.props);
    reconcileChidren(fiber, simpleVnode(children));
};
const updateHost = (fiber) => {
    if (!fiber.node) {
        if (fiber.type === 'svg')
            fiber.lane |= 16;
        fiber.node = createElement(fiber);
    }
    else if (fiber.hydrating) {
        updateElement(fiber.node, {}, fiber.props);
    }
    reconcileChidren(fiber, fiber.props.children);
};
const simpleVnode = (type) => isStr(type) ? createText(type) : type;
const reconcileChidren = (fiber, children) => {
    let aCh = fiber.kids || [], bCh = (fiber.kids = arrayfy$1(children));
    const actions = diff(aCh, bCh);
    for (let i = 0, prev = null, len = bCh.length; i < len; i++) {
        const child = bCh[i];
        child.action = actions[i];
        if (fiber.lane & 16) {
            child.lane |= 16;
        }
        if (fiber.hydrating) {
            child.hydrating = true;
        }
        child.parent = fiber;
        if (i > 0) {
            prev.sibling = child;
        }
        else {
            fiber.child = child;
        }
        prev = child;
    }
};
function clone(a, b) {
    b.hooks = a.hooks;
    b.ref = a.ref;
    b.node = a.node;
    b.kids = a.kids;
    b.alternate = a;
    b.hydrating = a.hydrating;
}
const arrayfy$1 = (arr) => !arr ? [] : isArr(arr) ? arr : [arr];
const side = (effects) => {
    effects.forEach((e) => e[2] && e[2]());
    effects.forEach((e) => (e[2] = e[0]()));
    effects.length = 0;
};
const diff = (aCh, bCh) => {
    let aHead = 0, bHead = 0, aTail = aCh.length - 1, bTail = bCh.length - 1, bMap = {}, same = (a, b) => (a.type === b.type && a.key === b.key), temp = [], actions = [];
    while (aHead <= aTail && bHead <= bTail) {
        if (!same(aCh[aTail], bCh[bTail]))
            break;
        clone(aCh[aTail], bCh[bTail]);
        temp.push({ op: 2 });
        aTail--;
        bTail--;
    }
    while (aHead <= aTail && bHead <= bTail) {
        if (!same(aCh[aHead], bCh[bHead]))
            break;
        clone(aCh[aHead], bCh[bHead]);
        actions.push({ op: 2 });
        aHead++;
        bHead++;
    }
    for (let i = bHead; i <= bTail; i++) {
        if (bCh[i].key)
            bMap[bCh[i].key] = i;
    }
    while (aHead <= aTail || bHead <= bTail) {
        const aElm = aCh[aHead], bElm = bCh[bHead];
        if (aElm === null) {
            aHead++;
        }
        else if (bTail + 1 <= bHead) {
            removeElement(aElm);
            aHead++;
        }
        else if (aTail + 1 <= aHead) {
            actions.push({ op: 4, cur: bElm, ref: aElm });
            bHead++;
        }
        else if (same(aElm, bElm)) {
            clone(aElm, bElm);
            actions.push({ op: 2 });
            aHead++;
            bHead++;
        }
        else {
            const foundB = aElm.key ? bMap[aElm.key] : null;
            if (foundB == null) {
                removeElement(aElm);
                aHead++;
            }
            else {
                if (bHead <= foundB) {
                    actions.push({ op: 4, cur: bElm, ref: aElm });
                    bHead++;
                }
                else {
                    clone(aElm, bCh[foundB]);
                    actions.push({ op: 64, cur: aElm, ref: aCh[aHead] });
                    aCh[aHead] = null;
                    aHead++;
                }
            }
        }
    }
    for (let i = temp.length - 1; i >= 0; i--) {
        actions.push(temp[i]);
    }
    return actions;
};
const useFiber = () => globalThis.currentFiber || null;
const resetFiber = (fiber) => globalThis.currentFiber = fiber;
const isFn = (x) => typeof x === 'function';
const isStr = (s) => typeof s === 'number' || typeof s === 'string';

const h = (type, props, ...kids) => {
    props = props || {};
    kids = flat(arrayfy(props.children || kids));
    if (kids.length)
        props.children = kids.length === 1 ? kids[0] : kids;
    const key = props.key || null;
    const ref = props.ref || null;
    if (key)
        props.key = undefined;
    if (ref)
        props.ref = undefined;
    return createVnode(type, props, key, ref);
};
const arrayfy = (arr) => !arr ? [] : isArr(arr) ? arr : [arr];
const some = (x) => x != null && x !== true && x !== false;
const flat = (arr, target = []) => {
    arr.forEach((v) => {
        isArr(v)
            ? flat(v, target)
            : some(v) && target.push(isStr(v) ? createText(v) : v);
    });
    return target;
};
const createVnode = (type, props, key, ref) => ({
    type,
    props,
    key,
    ref,
});
const createText = (vnode) => ({ type: '#text', props: { nodeValue: vnode + '' } });
function Fragment(props) {
    return props.children;
}
function memo(fn, compare) {
    fn.memo = true;
    fn.shouldUpdate = compare;
    return fn;
}
const isArr = Array.isArray;
function lazy(factory) {
    let status = 'unloaded';
    let result;
    let promise;
    const LazyComponent = (props) => {
        switch (status) {
            case 'loaded': return h(result, props);
            case 'loading': throw promise;
            default:
                status = 'loading';
                promise = factory().then((m) => {
                    status = 'loaded';
                    result = m.default;
                });
                throw promise;
        }
    };
    return LazyComponent;
}
function Suspense(props) {
    return props.children;
}

export { Fragment, Suspense, createContext, h as createElement, h, lazy, memo, options, render, resetCursor, resetFiber, shouldYield, schedule as startTransition, useCallback, useContext, useEffect, useFiber, useLayout, useLayout as useLayoutEffect, useMemo, useReducer, useRef, useState };
//# sourceMappingURL=fre.esm.js.map