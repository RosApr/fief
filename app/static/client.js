var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// fre-esm.js
function commitSibling(fiber) {
  if (fiber === null || fiber === void 0 ? void 0 : fiber.memo) {
    commitSibling(fiber.sibling);
  } else {
    commit(fiber);
  }
}
function clone(a2, b2) {
  b2.hooks = a2.hooks;
  b2.ref = a2.ref;
  b2.node = a2.node;
  b2.kids = a2.kids;
  b2.alternate = a2;
  b2.hydrating = a2.hydrating;
}
function Suspense(props) {
  return props.children;
}
var defaultObj, jointIter, updateElement, createElement, cursor, resetCursor, useState, useReducer, useEffect, effectImpl, getSlot, isChanged, queue, threshold, transitions, deadline, startTransition, schedule, task, translate, flush, shouldYield, getTime, peek, commit, refer, kidsRefer, removeElement, currentFiber, domCursor, options, render, update, reconcile, getBoundary, suspense, capture, isMemo, sibling, bubble, shouldUpdate, fragment, updateHook, updateHost, simpleVnode, reconcileChidren, arrayfy$1, side, diff, useFiber, resetFiber, isFn, isStr, h2, arrayfy, some, flat, createVnode, createText, isArr;
var init_fre_esm = __esm({
  "fre-esm.js"() {
    defaultObj = {};
    jointIter = (aProps, bProps, callback) => {
      aProps = aProps || defaultObj;
      bProps = bProps || defaultObj;
      Object.keys(aProps).forEach((k2) => callback(k2, aProps[k2], bProps[k2]));
      Object.keys(bProps).forEach((k2) => !aProps.hasOwnProperty(k2) && callback(k2, void 0, bProps[k2]));
    };
    updateElement = (dom, aProps, bProps) => {
      jointIter(aProps, bProps, (name, a2, b2) => {
        if (a2 === b2 || name === "children") ;
        else if (name === "style" && !isStr(b2)) {
          jointIter(a2, b2, (styleKey, aStyle, bStyle) => {
            if (aStyle !== bStyle) {
              dom[name][styleKey] = bStyle || "";
            }
          });
        } else if (name[0] === "o" && name[1] === "n") {
          name = name.slice(2).toLowerCase();
          if (a2)
            dom.removeEventListener(name, a2);
          dom.addEventListener(name, b2);
        } else if (name in dom && !(dom instanceof SVGElement)) {
          dom[name] = b2 || "";
        } else if (b2 == null || b2 === false) {
          dom.removeAttribute(name);
        } else {
          dom.setAttribute && (dom === null || dom === void 0 ? void 0 : dom.setAttribute(name, b2));
        }
      });
    };
    createElement = (fiber) => {
      const dom = fiber.type === "#text" ? document.createTextNode("") : fiber.lane & 16 ? document.createElementNS("http://www.w3.org/2000/svg", fiber.type) : document.createElement(fiber.type);
      updateElement(dom, {}, fiber.props);
      return dom;
    };
    cursor = 0;
    resetCursor = () => {
      cursor = 0;
    };
    useState = (initState) => {
      return useReducer(null, initState);
    };
    useReducer = (reducer, initState) => {
      const [hook, current] = getSlot(cursor++);
      if (hook.length === 0) {
        hook[0] = isFn(initState) ? initState() : initState;
      }
      hook[1] = (value) => {
        let v2 = reducer ? reducer(hook[0], value) : isFn(value) ? value(hook[0]) : value;
        if (hook[0] !== v2) {
          hook[0] = v2;
          if (typeof window !== "undefined") {
            update(current);
          }
        }
      };
      return hook;
    };
    useEffect = (cb, deps) => {
      return effectImpl(cb, deps, "effect");
    };
    effectImpl = (cb, deps, key) => {
      const [hook, current] = getSlot(cursor++);
      if (isChanged(hook[1], deps)) {
        hook[0] = cb;
        hook[1] = deps;
        current.hooks[key].push(hook);
      }
    };
    getSlot = (cursor2) => {
      const current = useFiber();
      const hooks = current.hooks || (current.hooks = { list: [], effect: [], layout: [] });
      if (cursor2 >= hooks.list.length) {
        hooks.list.push([]);
      }
      return [hooks.list[cursor2], current];
    };
    isChanged = (a2, b2) => {
      return !a2 || a2.length !== b2.length || b2.some((arg, index) => !Object.is(arg, a2[index]));
    };
    queue = [];
    threshold = 5;
    transitions = [];
    deadline = 0;
    startTransition = (cb) => {
      transitions.push(cb) && translate();
    };
    schedule = (callback) => {
      queue.push({ callback });
      startTransition(flush);
    };
    task = (pending) => {
      const cb = () => transitions.splice(0, 1).forEach((c2) => c2());
      if (!pending && typeof queueMicrotask !== "undefined") {
        return () => queueMicrotask(cb);
      }
      if (typeof MessageChannel !== "undefined") {
        const { port1, port2 } = new MessageChannel();
        port1.onmessage = cb;
        return () => port2.postMessage(null);
      }
      return () => setTimeout(cb);
    };
    translate = task(false);
    flush = () => {
      deadline = getTime() + threshold;
      let job = peek(queue);
      while (job && !shouldYield()) {
        const { callback } = job;
        job.callback = null;
        const next = callback();
        if (next) {
          job.callback = next;
        } else {
          queue.shift();
        }
        job = peek(queue);
      }
      job && (translate = task(shouldYield())) && startTransition(flush);
    };
    shouldYield = () => {
      return getTime() >= deadline;
    };
    getTime = () => performance.now();
    peek = (queue2) => queue2[0];
    commit = (fiber) => {
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
        if ((parent === null || parent === void 0 ? void 0 : parent.nodeValue) === "Suspense") {
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
    refer = (ref, dom) => {
      if (ref)
        isFn(ref) ? ref(dom) : ref.current = dom;
    };
    kidsRefer = (kids) => {
      kids === null || kids === void 0 ? void 0 : kids.forEach((kid) => {
        kid.kids && kidsRefer(kid.kids);
        refer(kid.ref, null);
      });
    };
    removeElement = (fiber, flag = true) => {
      var _a, _b, _c;
      if (fiber.isComp) {
        fiber.hooks && fiber.hooks.list.forEach((e2) => e2[2] && e2[2]());
      } else {
        if (flag) {
          (_b = (_a = fiber.node) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(fiber.node);
          flag = false;
        }
        kidsRefer(fiber.kids);
        refer(fiber.ref, null);
      }
      (_c = fiber === null || fiber === void 0 ? void 0 : fiber.kids) === null || _c === void 0 ? void 0 : _c.forEach((v2) => removeElement(v2, flag));
    };
    currentFiber = null;
    domCursor = null;
    options = {};
    render = (vnode, node) => {
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
    update = (fiber) => {
      if (!fiber.dirty) {
        fiber.dirty = true;
        schedule(() => reconcile(fiber));
      }
    };
    reconcile = (fiber) => {
      while (fiber && !shouldYield()) {
        fiber = capture(fiber);
      }
      return fiber ? reconcile.bind(null, fiber) : null;
    };
    getBoundary = (fiber, name) => {
      let current = fiber.parent;
      while (current) {
        if (current.type === name)
          return current;
        current = current.parent;
      }
      return null;
    };
    suspense = (fiber, promise) => {
      const boundary = getBoundary(fiber, Suspense);
      if (!boundary)
        throw promise;
      boundary.kids = [];
      reconcileChidren(boundary, simpleVnode(boundary.props.fallback));
      promise.then(() => update(boundary));
      return boundary;
    };
    capture = (fiber) => {
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
        } catch (e2) {
          if (e2 instanceof Promise) {
            return suspense(fiber, e2).child;
          } else
            throw e2;
        }
      } else {
        updateHost(fiber);
      }
      return fiber.child || sibling(fiber);
    };
    isMemo = (fiber) => {
      var _a, _b;
      if (fiber.type.memo && fiber.type === ((_a = fiber.alternate) === null || _a === void 0 ? void 0 : _a.type) && ((_b = fiber.alternate) === null || _b === void 0 ? void 0 : _b.props)) {
        let scu = fiber.type.shouldUpdate || shouldUpdate;
        if (!scu(fiber.props, fiber.alternate.props)) {
          return true;
        }
      }
      return false;
    };
    sibling = (fiber) => {
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
    bubble = (fiber) => {
      if (fiber.isComp) {
        if (fiber.hooks) {
          side(fiber.hooks.layout);
          schedule(() => side(fiber.hooks.effect));
        }
      }
    };
    shouldUpdate = (a2, b2) => {
      for (let i in a2)
        if (!(i in b2))
          return true;
      for (let i in b2)
        if (a2[i] !== b2[i])
          return true;
    };
    fragment = (fiber) => {
      const f2 = document.createDocumentFragment();
      const c2 = document.createComment(fiber.type.name);
      f2.appendChild(c2);
      return f2;
    };
    updateHook = (fiber) => {
      resetCursor();
      resetFiber(fiber);
      fiber.node = fiber.node || fragment(fiber);
      let children = fiber.type(fiber.props);
      reconcileChidren(fiber, simpleVnode(children));
    };
    updateHost = (fiber) => {
      if (!fiber.node) {
        if (fiber.type === "svg")
          fiber.lane |= 16;
        fiber.node = createElement(fiber);
      } else if (fiber.hydrating) {
        updateElement(fiber.node, {}, fiber.props);
      }
      reconcileChidren(fiber, fiber.props.children);
    };
    simpleVnode = (type) => isStr(type) ? createText(type) : type;
    reconcileChidren = (fiber, children) => {
      let aCh = fiber.kids || [], bCh = fiber.kids = arrayfy$1(children);
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
        } else {
          fiber.child = child;
        }
        prev = child;
      }
    };
    arrayfy$1 = (arr) => !arr ? [] : isArr(arr) ? arr : [arr];
    side = (effects) => {
      effects.forEach((e2) => e2[2] && e2[2]());
      effects.forEach((e2) => e2[2] = e2[0]());
      effects.length = 0;
    };
    diff = (aCh, bCh) => {
      let aHead = 0, bHead = 0, aTail = aCh.length - 1, bTail = bCh.length - 1, bMap = {}, same = (a2, b2) => a2.type === b2.type && a2.key === b2.key, temp = [], actions = [];
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
        } else if (bTail + 1 <= bHead) {
          removeElement(aElm);
          aHead++;
        } else if (aTail + 1 <= aHead) {
          actions.push({ op: 4, cur: bElm, ref: aElm });
          bHead++;
        } else if (same(aElm, bElm)) {
          clone(aElm, bElm);
          actions.push({ op: 2 });
          aHead++;
          bHead++;
        } else {
          const foundB = aElm.key ? bMap[aElm.key] : null;
          if (foundB == null) {
            removeElement(aElm);
            aHead++;
          } else {
            if (bHead <= foundB) {
              actions.push({ op: 4, cur: bElm, ref: aElm });
              bHead++;
            } else {
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
    useFiber = () => currentFiber || null;
    resetFiber = (fiber) => currentFiber = fiber;
    isFn = (x2) => typeof x2 === "function";
    isStr = (s2) => typeof s2 === "number" || typeof s2 === "string";
    h2 = (type, props, ...kids) => {
      props = props || {};
      kids = flat(arrayfy(props.children || kids));
      if (kids.length)
        props.children = kids.length === 1 ? kids[0] : kids;
      const key = props.key || null;
      const ref = props.ref || null;
      if (key)
        props.key = void 0;
      if (ref)
        props.ref = void 0;
      return createVnode(type, props, key, ref);
    };
    arrayfy = (arr) => !arr ? [] : isArr(arr) ? arr : [arr];
    some = (x2) => x2 != null && x2 !== true && x2 !== false;
    flat = (arr, target = []) => {
      arr.forEach((v2) => {
        isArr(v2) ? flat(v2, target) : some(v2) && target.push(isStr(v2) ? createText(v2) : v2);
      });
      return target;
    };
    createVnode = (type, props, key, ref) => ({
      type,
      props,
      key,
      ref
    });
    createText = (vnode) => ({ type: "#text", props: { nodeValue: vnode + "" } });
    isArr = Array.isArray;
  }
});

// const.ts
var MIME_TYPE;
var init_const = __esm({
  "const.ts"() {
    MIME_TYPE = Object.freeze({
      js: "text/javascript",
      html: "text/html",
      htm: "text/html",
      css: "text/css",
      csv: "text/csv",
      xml: "text/xml",
      xsl: "text/xml",
      plain: "text/plain",
      txt: "text/plain",
      text: "text/plain",
      conf: "text/plain",
      markdown: "text/markdown",
      md: "text/markdown",
      mdx: "text/markdown",
      yaml: "application/yaml",
      yml: "application/yml",
      ecma: "application/ecmascript",
      gzip: "application/gzip",
      gz: "application/gzip",
      tgz: "application/gzip",
      json: "application/json",
      tar: "application/tar",
      otf: "font/otf",
      woff: "font/woff",
      woff2: "font/woff2",
      avif: "image/avif",
      gif: "image/gif",
      heif: "image/heif",
      heic: "image/heic",
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      pjpg: "image/pjeg",
      svg: "image/svg+xml",
      tif: "image/tif",
      tiff: "image/tiff",
      webp: "image/webp",
      dng: "image/dng",
      ico: "image/x-icon",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      mpeg: "video/mpeg",
      mov: "video/quicktime"
    });
  }
});

// node_modules/.pnpm/fre@2.8.6-fix4/node_modules/fre/dist/fre.js
function O(e2) {
  (null == e2 ? void 0 : e2.memo) ? O(e2.sibling) : N(e2);
}
function X(e2, t2) {
  t2.hooks = e2.hooks, t2.ref = e2.ref, t2.node = e2.node, t2.kids = e2.kids, t2.alternate = e2, t2.hydrating = e2.hydrating;
}
function fe(e2) {
  return e2.children;
}
var e, t, n, o, r, l, s, u, a, c, f, h3, y, k, m, v, g, b, E, w, C, x, A, M, V, L, N, S, T, j, q, P, D, F, G, $, z, H, I, J, K, Q, R, W, Y, Z, _, ee, te, ne, oe, ue, ce;
var init_fre = __esm({
  "node_modules/.pnpm/fre@2.8.6-fix4/node_modules/fre/dist/fre.js"() {
    e = {};
    t = (t2, n2, o2) => {
      t2 = t2 || e, n2 = n2 || e, Object.keys(t2).forEach((e2) => o2(e2, t2[e2], n2[e2])), Object.keys(n2).forEach((e2) => !t2.hasOwnProperty(e2) && o2(e2, void 0, n2[e2]));
    };
    n = (e2, n2, o2) => {
      t(n2, o2, (n3, o3, r2) => {
        o3 === r2 || "children" === n3 || ("style" !== n3 || oe(r2) ? "o" === n3[0] && "n" === n3[1] ? (n3 = n3.slice(2).toLowerCase(), o3 && e2.removeEventListener(n3, o3), e2.addEventListener(n3, r2)) : !(n3 in e2) || e2 instanceof SVGElement ? null == r2 || false === r2 ? e2.removeAttribute(n3) : e2.setAttribute && (null == e2 || e2.setAttribute(n3, r2)) : e2[n3] = r2 || "" : t(o3, r2, (t2, o4, r3) => {
          o4 !== r3 && (e2[n3][t2] = r3 || "");
        }));
      });
    };
    o = [];
    r = 0;
    l = () => {
      r = 0;
    };
    s = (e2, t2) => {
      const [n2, o2] = h3(r++);
      return 0 === n2.length && (n2[0] = ne(t2) ? t2() : t2), n2[1] = (t3) => {
        let r2 = e2 ? e2(n2[0], t3) : ne(t3) ? t3(n2[0]) : t3;
        n2[0] !== r2 && (n2[0] = r2, "undefined" != typeof window && D(o2));
      }, n2;
    };
    u = (e2, t2) => a(e2, t2, "effect");
    a = (e2, t2, n2) => {
      const [o2, l2] = h3(r++);
      m(o2[1], t2) && (o2[0] = e2, o2[1] = t2, l2.hooks[n2].push(o2));
    };
    c = (e2, t2) => {
      const n2 = h3(r++)[0];
      return m(n2[1], t2) ? (n2[1] = t2, n2[0] = e2()) : n2[0];
    };
    f = (e2) => c(() => ({ current: e2 }), []);
    h3 = (e2) => {
      const t2 = ee(), n2 = t2.hooks || (t2.hooks = { list: [], effect: [], layout: [] });
      return e2 >= n2.list.length && n2.list.push([]), [n2.list[e2], t2];
    };
    y = (e2) => {
      const t2 = ({ value: e3, children: t3 }) => {
        const n2 = f(e3), r2 = c(() => /* @__PURE__ */ new Set(), o);
        return n2.current !== e3 && (n2.current = e3, r2.forEach((e4) => e4())), t3;
      };
      return t2.initialValue = e2, t2;
    };
    k = (e2) => {
      const t2 = s(null, null)[1];
      let n2;
      u(() => () => null == n2 ? void 0 : n2.delete(t2), o);
      const r2 = G(ee(), e2);
      return r2 ? (n2 = r2.hooks.list[1][0].add(t2), r2.hooks.list[0][0].current) : e2.initialValue;
    };
    m = (e2, t2) => !e2 || e2.length !== t2.length || t2.some((t3, n2) => !Object.is(t3, e2[n2]));
    v = [];
    g = [];
    b = 0;
    E = (e2) => {
      g.push(e2) && x();
    };
    w = (e2) => {
      v.push({ callback: e2 }), E(A);
    };
    C = (e2) => {
      const t2 = () => g.splice(0, 1).forEach((e3) => e3());
      if (!e2 && "undefined" != typeof queueMicrotask) return () => queueMicrotask(t2);
      if ("undefined" != typeof MessageChannel) {
        const { port1: e3, port2: n2 } = new MessageChannel();
        return e3.onmessage = t2, () => n2.postMessage(null);
      }
      return () => setTimeout(t2);
    };
    x = C(false);
    A = () => {
      b = V() + 5;
      let e2 = L(v);
      for (; e2 && !M(); ) {
        const { callback: t2 } = e2;
        e2.callback = null;
        const n2 = t2();
        n2 ? e2.callback = n2 : v.shift(), e2 = L(v);
      }
      e2 && (x = C(M())) && E(A);
    };
    M = () => V() >= b;
    V = () => performance.now();
    L = (e2) => e2[0];
    N = (e2) => {
      var t2, o2;
      if (!e2) return;
      S(e2.ref, e2.node), O(e2.child);
      let { op: r2, ref: l2, cur: i } = e2.action || {}, s2 = null === (t2 = null == e2 ? void 0 : e2.parent) || void 0 === t2 ? void 0 : t2.node, u2 = null;
      if (8 === (null == s2 ? void 0 : s2.nodeType) && ("Suspense" === (null == s2 ? void 0 : s2.nodeValue) && (u2 = s2), s2 = s2.parentNode), 4 & r2 || 64 & r2) {
        let t3 = null;
        e2.isComp && (t3 = null === (o2 = null == e2 ? void 0 : e2.node) || void 0 === o2 ? void 0 : o2.firstChild), s2.insertBefore(null == i ? void 0 : i.node, null != u2 ? u2 : null == l2 ? void 0 : l2.node), e2.isComp && (e2.node = t3);
      }
      if (2 & r2) {
        const t3 = e2.node;
        n(t3, e2.alternate.props || {}, e2.props);
      }
      e2.action = null, O(e2.sibling);
    };
    S = (e2, t2) => {
      e2 && (ne(e2) ? e2(t2) : e2.current = t2);
    };
    T = (e2) => {
      null == e2 || e2.forEach((e3) => {
        e3.kids && T(e3.kids), S(e3.ref, null);
      });
    };
    j = (e2, t2 = true) => {
      var n2, o2, r2;
      e2.isComp ? e2.hooks && e2.hooks.list.forEach((e3) => e3[2] && e3[2]()) : (t2 && (null === (o2 = null === (n2 = e2.node) || void 0 === n2 ? void 0 : n2.parentNode) || void 0 === o2 || o2.removeChild(e2.node), t2 = false), T(e2.kids), S(e2.ref, null)), null === (r2 = null == e2 ? void 0 : e2.kids) || void 0 === r2 || r2.forEach((e3) => j(e3, t2));
    };
    q = null;
    P = null;
    D = (e2) => {
      e2.dirty || (e2.dirty = true, w(() => F(e2)));
    };
    F = (e2) => {
      for (; e2 && !M(); ) e2 = $(e2);
      return e2 ? F.bind(null, e2) : null;
    };
    G = (e2, t2) => {
      let n2 = e2.parent;
      for (; n2; ) {
        if (n2.type === t2) return n2;
        n2 = n2.parent;
      }
      return null;
    };
    $ = (e2) => {
      if (e2.isComp = ne(e2.type), P && e2.hydrating && (P.type !== e2.type && P.type !== (e2.type.name && "$" + e2.type.name) || (e2.kids = P.kids), P = P.next), e2.isComp) {
        if (z(e2)) return e2.memo = false, H(e2);
        try {
          K(e2);
        } catch (t2) {
          if (t2 instanceof Promise) return ((e3, t3) => {
            const n2 = G(e3, fe);
            if (!n2) throw t3;
            return n2.kids = [], W(n2, R(n2.props.fallback)), t3.then(() => D(n2)), n2;
          })(e2, t2).child;
          throw t2;
        }
      } else Q(e2);
      return e2.child || H(e2);
    };
    z = (e2) => {
      var t2, n2;
      if (e2.type.memo && e2.type === (null === (t2 = e2.alternate) || void 0 === t2 ? void 0 : t2.type) && (null === (n2 = e2.alternate) || void 0 === n2 ? void 0 : n2.props)) {
        if (!(e2.type.shouldUpdate || J)(e2.props, e2.alternate.props)) return true;
      }
      return false;
    };
    H = (e2) => {
      for (; e2; ) {
        if (I(e2), e2.dirty) return e2.dirty = false, N(e2), null;
        if (e2.sibling) return e2.sibling;
        e2 = e2.parent;
      }
      return null;
    };
    I = (e2) => {
      e2.isComp && e2.hooks && (Z(e2.hooks.layout), w(() => Z(e2.hooks.effect)));
    };
    J = (e2, t2) => {
      for (let n2 in e2) if (!(n2 in t2)) return true;
      for (let n2 in t2) if (e2[n2] !== t2[n2]) return true;
    };
    K = (e2) => {
      l(), te(e2), e2.node = e2.node || ((e3) => {
        const t3 = document.createDocumentFragment(), n2 = document.createComment(e3.type.name);
        return t3.appendChild(n2), t3;
      })(e2);
      let t2 = e2.type(e2.props);
      W(e2, R(t2));
    };
    Q = (e2) => {
      e2.node ? e2.hydrating && n(e2.node, {}, e2.props) : ("svg" === e2.type && (e2.lane |= 16), e2.node = ((e3) => {
        const t2 = "#text" === e3.type ? document.createTextNode("") : 16 & e3.lane ? document.createElementNS("http://www.w3.org/2000/svg", e3.type) : document.createElement(e3.type);
        return n(t2, {}, e3.props), t2;
      })(e2)), W(e2, e2.props.children);
    };
    R = (e2) => oe(e2) ? ue(e2) : e2;
    W = (e2, t2) => {
      let n2 = e2.kids || [], o2 = e2.kids = Y(t2);
      const r2 = _(n2, o2);
      for (let t3 = 0, n3 = null, l2 = o2.length; t3 < l2; t3++) {
        const l3 = o2[t3];
        l3.action = r2[t3], 16 & e2.lane && (l3.lane |= 16), e2.hydrating && (l3.hydrating = true), l3.parent = e2, t3 > 0 ? n3.sibling = l3 : e2.child = l3, n3 = l3;
      }
    };
    Y = (e2) => e2 ? ce(e2) ? e2 : [e2] : [];
    Z = (e2) => {
      e2.forEach((e3) => e3[2] && e3[2]()), e2.forEach((e3) => e3[2] = e3[0]()), e2.length = 0;
    };
    _ = (e2, t2) => {
      let n2 = 0, o2 = 0, r2 = e2.length - 1, l2 = t2.length - 1, i = {}, s2 = (e3, t3) => e3.type === t3.type && e3.key === t3.key, u2 = [], d = [];
      for (; n2 <= r2 && o2 <= l2 && s2(e2[r2], t2[l2]); ) X(e2[r2], t2[l2]), u2.push({ op: 2 }), r2--, l2--;
      for (; n2 <= r2 && o2 <= l2 && s2(e2[n2], t2[o2]); ) X(e2[n2], t2[o2]), d.push({ op: 2 }), n2++, o2++;
      for (let e3 = o2; e3 <= l2; e3++) t2[e3].key && (i[t2[e3].key] = e3);
      for (; n2 <= r2 || o2 <= l2; ) {
        const u3 = e2[n2], a2 = t2[o2];
        if (null === u3) n2++;
        else if (l2 + 1 <= o2) j(u3), n2++;
        else if (r2 + 1 <= n2) d.push({ op: 4, cur: a2, ref: u3 }), o2++;
        else if (s2(u3, a2)) X(u3, a2), d.push({ op: 2 }), n2++, o2++;
        else {
          const r3 = u3.key ? i[u3.key] : null;
          null == r3 ? (j(u3), n2++) : o2 <= r3 ? (d.push({ op: 4, cur: a2, ref: u3 }), o2++) : (X(u3, t2[r3]), d.push({ op: 64, cur: u3, ref: e2[n2] }), e2[n2] = null, n2++);
        }
      }
      for (let e3 = u2.length - 1; e3 >= 0; e3--) d.push(u2[e3]);
      return d;
    };
    ee = () => q || null;
    te = (e2) => q = e2;
    ne = (e2) => "function" == typeof e2;
    oe = (e2) => "number" == typeof e2 || "string" == typeof e2;
    ue = (e2) => ({ type: "#text", props: { nodeValue: e2 + "" } });
    ce = Array.isArray;
  }
});

// render-to-string.js
var init_render_to_string = __esm({
  "render-to-string.js"() {
    init_fre();
  }
});

// engine.tsx
function useLoaderData() {
  return k(globalThis.__fre_globalFiber.current);
}
var LoaderDataContext;
var init_engine = __esm({
  "engine.tsx"() {
    init_const();
    init_render_to_string();
    init_fre();
    LoaderDataContext = y({});
    if (!globalThis.__fre_globalFiber) {
      globalThis.__fre_globalFiber = {
        current: y({})
        // 存储 currentFiber 的实际值
      };
    }
  }
});

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default,
  loader: () => loader
});
async function loader() {
  const res = await fetch("http://localhost:3000/api/meta");
  const data = await res.json();
  return data;
}
function routes_default() {
  const data = useLoaderData();
  console.log(data);
  return /* @__PURE__ */ h2("div", null, /* @__PURE__ */ h2("h1", null, "Hello ", data.hello), /* @__PURE__ */ h2("img", { src: "/static/example.jpg", style: { width: "400px" } }));
}
var init_routes = __esm({
  "app/routes/index.tsx"() {
    init_engine();
    init_fre_esm();
  }
});

// app/routes/about/index.tsx
var about_exports = {};
__export(about_exports, {
  default: () => about_default
});
function about_default() {
  return /* @__PURE__ */ h("div", null, "About index page");
}
var init_about = __esm({
  "app/routes/about/index.tsx"() {
  }
});

// client-entry.tsx
init_fre_esm();
var routes = {
  "/": () => Promise.resolve().then(() => (init_routes(), routes_exports)),
  "/about": () => Promise.resolve().then(() => (init_about(), about_exports))
  // 添加更多路由...
};
function App() {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      const path = window.location.pathname || "/";
      const componentModule = routes[path] || routes["/"];
      try {
        const module2 = await componentModule();
        setComponent(module2.default);
      } catch (error) {
        console.error("\u52A0\u8F7D\u7EC4\u4EF6\u5931\u8D25:", error);
      } finally {
        setLoading(false);
      }
    };
    loadComponent();
    const handlePopState = () => loadComponent();
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  if (loading) {
    return /* @__PURE__ */ h2("div", null, "\u52A0\u8F7D\u4E2D...");
  }
  console.log(Component);
  return Component ? /* @__PURE__ */ h2(Component, null) : /* @__PURE__ */ h2("div", null, "\u9875\u9762\u672A\u627E\u5230");
}
async function hydrate() {
  const loaderDataScript = document.getElementById("__FRE_LOADER_DATA__");
  const loaderData = loaderDataScript ? JSON.parse(loaderDataScript.textContent || "{}") : {};
  if (globalThis.__fre_globalFiber) {
    globalThis.__fre_globalFiber.current.value = loaderData;
  }
  render(/* @__PURE__ */ h2(App, null), document.getElementById("app"));
}
hydrate().catch((err) => {
  console.error("\u5BA2\u6237\u7AEF\u6C34\u5408\u5931\u8D25:", err);
});
