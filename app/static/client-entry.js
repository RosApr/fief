// node_modules/.pnpm/fre@2.8.6-fix6/node_modules/fre/dist/fre.js
var e = {};
var t = (t2, n2, o2) => {
  t2 = t2 || e, n2 = n2 || e, Object.keys(t2).forEach((e2) => o2(e2, t2[e2], n2[e2])), Object.keys(n2).forEach((e2) => !t2.hasOwnProperty(e2) && o2(e2, void 0, n2[e2]));
};
var n = (e2, n2, o2) => {
  t(n2, o2, (n3, o3, l2) => {
    o3 === l2 || "children" === n3 || ("style" !== n3 || te(l2) ? "o" === n3[0] && "n" === n3[1] ? (n3 = n3.slice(2).toLowerCase(), o3 && e2.removeEventListener(n3, o3), e2.addEventListener(n3, l2)) : !(n3 in e2) || e2 instanceof SVGElement ? null == l2 || false === l2 ? e2.removeAttribute(n3) : e2.setAttribute && (null == e2 || e2.setAttribute(n3, l2)) : e2[n3] = l2 || "" : t(o3, l2, (t2, o4, l3) => {
      o4 !== l3 && (e2[n3][t2] = l3 || "");
    }));
  });
};
var o = [];
var l = 0;
var r = () => {
  l = 0;
};
var s = (e2, t2) => {
  const [n2, o2] = h(l++);
  return 0 === n2.length && (n2[0] = ee(t2) ? t2() : t2), n2[1] = (t3) => {
    let l2 = e2 ? e2(n2[0], t3) : ee(t3) ? t3(n2[0]) : t3;
    n2[0] !== l2 && (n2[0] = l2, "undefined" != typeof window && U(o2));
  }, n2;
};
var u = (e2, t2) => d(e2, t2, "effect");
var d = (e2, t2, n2) => {
  const [o2, r2] = h(l++);
  m(o2[1], t2) && (o2[0] = e2, o2[1] = t2, r2.hooks[n2].push(o2));
};
var a = (e2, t2) => {
  const n2 = h(l++)[0];
  return m(n2[1], t2) ? (n2[1] = t2, n2[0] = e2()) : n2[0];
};
var f = (e2) => a(() => ({ current: e2 }), []);
var h = (e2) => {
  const t2 = $(), n2 = t2.hooks || (t2.hooks = { list: [], effect: [], layout: [] });
  return e2 >= n2.list.length && n2.list.push([]), [n2.list[e2], t2];
};
var y = (e2) => {
  const t2 = ({ value: e3, children: t3 }) => {
    const n2 = f(e3), l2 = a(() => /* @__PURE__ */ new Set(), o);
    return n2.current !== e3 && (n2.current = e3, l2.forEach((e4) => e4())), t3;
  };
  return t2.initialValue = e2, t2;
};
var k = (e2) => {
  const t2 = s(null, null)[1];
  let n2;
  u(() => () => null == n2 ? void 0 : n2.delete(t2), o);
  const l2 = D($(), e2);
  return l2 ? (n2 = l2.hooks.list[1][0].add(t2), l2.hooks.list[0][0].current) : e2.initialValue;
};
var m = (e2, t2) => !e2 || e2.length !== t2.length || t2.some((t3, n2) => !Object.is(t3, e2[n2]));
var v = [];
var g = [];
var b = 0;
var E = (e2) => {
  g.push(e2) && A();
};
var w = (e2) => {
  v.push({ callback: e2 }), E(M);
};
var C = (e2) => {
  const t2 = () => g.splice(0, 1).forEach((e3) => e3());
  if (!e2 && "undefined" != typeof queueMicrotask) return () => queueMicrotask(t2);
  if ("undefined" != typeof MessageChannel) {
    const { port1: e3, port2: n2 } = new MessageChannel();
    return e3.onmessage = t2, () => n2.postMessage(null);
  }
  return () => setTimeout(t2);
};
var A = C(false);
var M = () => {
  b = x() + 5;
  let e2 = L(v);
  for (; e2 && !V(); ) {
    const { callback: t2 } = e2;
    e2.callback = null;
    const n2 = t2();
    n2 ? e2.callback = n2 : v.shift(), e2 = L(v);
  }
  e2 && (A = C(V())) && E(M);
};
var V = () => x() >= b;
var x = () => performance.now();
var L = (e2) => e2[0];
var N = (e2) => {
  var t2, o2;
  if (!e2) return;
  S(e2.ref, e2.node), O(e2.child);
  let { op: l2, ref: r2, cur: i } = e2.action || {}, s2 = null === (t2 = null == e2 ? void 0 : e2.parent) || void 0 === t2 ? void 0 : t2.node, u2 = null;
  if (8 === (null == s2 ? void 0 : s2.nodeType) && ("Suspense" === (null == s2 ? void 0 : s2.nodeValue) && (u2 = s2), s2 = s2.parentNode), 4 & l2 || 64 & l2) {
    let t3 = null;
    e2.isComp && (t3 = null === (o2 = null == e2 ? void 0 : e2.node) || void 0 === o2 ? void 0 : o2.firstChild), s2.insertBefore(null == i ? void 0 : i.node, null != u2 ? u2 : null == r2 ? void 0 : r2.node), e2.isComp && (e2.node = t3);
  }
  if (2 & l2) {
    const t3 = e2.node;
    n(t3, e2.alternate.props || {}, e2.props);
  }
  e2.action = null, O(e2.sibling);
};
function O(e2) {
  (null == e2 ? void 0 : e2.memo) ? O(e2.sibling) : N(e2);
}
var S = (e2, t2) => {
  e2 && (ee(e2) ? e2(t2) : e2.current = t2);
};
var T = (e2) => {
  null == e2 || e2.forEach((e3) => {
    e3.kids && T(e3.kids), S(e3.ref, null);
  });
};
var j = (e2, t2 = true) => {
  var n2, o2, l2;
  e2.isComp ? e2.hooks && e2.hooks.list.forEach((e3) => e3[2] && e3[2]()) : (t2 && (null === (o2 = null === (n2 = e2.node) || void 0 === n2 ? void 0 : n2.parentNode) || void 0 === o2 || o2.removeChild(e2.node), t2 = false), T(e2.kids), S(e2.ref, null)), null === (l2 = null == e2 ? void 0 : e2.kids) || void 0 === l2 || l2.forEach((e3) => j(e3, t2));
};
var q = null;
var P = (e2, t2) => {
  t2.firstChild && t2.removeChild(t2.firstChild), U({ node: t2, props: { children: e2 } });
};
var U = (e2) => {
  e2.dirty || (e2.dirty = true, w(() => B(e2)));
};
var B = (e2) => {
  for (; e2 && !V(); ) e2 = F(e2);
  return e2 ? B.bind(null, e2) : null;
};
var D = (e2, t2) => {
  let n2 = e2.parent;
  for (; n2; ) {
    if (n2.type === t2) return n2;
    n2 = n2.parent;
  }
  return null;
};
var F = (e2) => {
  if (e2.isComp = ee(e2.type), e2.isComp) {
    if (G(e2)) return e2.memo = false, z(e2);
    try {
      J(e2);
    } catch (t2) {
      if (t2 instanceof Promise) return ((e3, t3) => {
        const n2 = D(e3, ae);
        if (!n2) throw t3;
        return n2.kids = [], R(n2, Q(n2.props.fallback)), t3.then(() => U(n2)), n2;
      })(e2, t2).child;
      throw t2;
    }
  } else K(e2);
  return e2.child || z(e2);
};
var G = (e2) => {
  var t2, n2;
  if (e2.type.memo && e2.type === (null === (t2 = e2.alternate) || void 0 === t2 ? void 0 : t2.type) && (null === (n2 = e2.alternate) || void 0 === n2 ? void 0 : n2.props)) {
    if (!(e2.type.shouldUpdate || I)(e2.props, e2.alternate.props)) return true;
  }
  return false;
};
var z = (e2) => {
  for (; e2; ) {
    if (H(e2), e2.dirty) return e2.dirty = false, N(e2), null;
    if (e2.sibling) return e2.sibling;
    e2 = e2.parent;
  }
  return null;
};
var H = (e2) => {
  e2.isComp && e2.hooks && (Y(e2.hooks.layout), w(() => Y(e2.hooks.effect)));
};
var I = (e2, t2) => {
  for (let n2 in e2) if (!(n2 in t2)) return true;
  for (let n2 in t2) if (e2[n2] !== t2[n2]) return true;
};
var J = (e2) => {
  r(), _(e2), e2.node = e2.node || ((e3) => {
    const t3 = document.createDocumentFragment(), n2 = document.createComment(e3.type.name);
    return t3.appendChild(n2), t3;
  })(e2);
  let t2 = e2.type(e2.props);
  R(e2, Q(t2));
};
var K = (e2) => {
  e2.node || ("svg" === e2.type && (e2.lane |= 16), e2.node = ((e3) => {
    const t2 = "#text" === e3.type ? document.createTextNode("") : 16 & e3.lane ? document.createElementNS("http://www.w3.org/2000/svg", e3.type) : document.createElement(e3.type);
    return n(t2, {}, e3.props), t2;
  })(e2)), R(e2, e2.props.children);
};
var Q = (e2) => te(e2) ? ie(e2) : e2;
var R = (e2, t2) => {
  let n2 = e2.kids || [], o2 = e2.kids = X(t2);
  const l2 = Z(n2, o2);
  for (let t3 = 0, n3 = null, r2 = o2.length; t3 < r2; t3++) {
    const r3 = o2[t3];
    r3.action = l2[t3], 16 & e2.lane && (r3.lane |= 16), r3.parent = e2, t3 > 0 ? n3.sibling = r3 : e2.child = r3, n3 = r3;
  }
};
function W(e2, t2) {
  t2.hooks = e2.hooks, t2.ref = e2.ref, t2.node = e2.node, t2.kids = e2.kids, t2.alternate = e2;
}
var X = (e2) => e2 ? ce(e2) ? e2 : [e2] : [];
var Y = (e2) => {
  e2.forEach((e3) => e3[2] && e3[2]()), e2.forEach((e3) => e3[2] = e3[0]()), e2.length = 0;
};
var Z = (e2, t2) => {
  let n2 = 0, o2 = 0, l2 = e2.length - 1, r2 = t2.length - 1, i = {}, s2 = (e3, t3) => e3.type === t3.type && e3.key === t3.key, u2 = [], c = [];
  for (; n2 <= l2 && o2 <= r2 && s2(e2[l2], t2[r2]); ) W(e2[l2], t2[r2]), u2.push({ op: 2 }), l2--, r2--;
  for (; n2 <= l2 && o2 <= r2 && s2(e2[n2], t2[o2]); ) W(e2[n2], t2[o2]), c.push({ op: 2 }), n2++, o2++;
  for (let e3 = o2; e3 <= r2; e3++) t2[e3].key && (i[t2[e3].key] = e3);
  for (; n2 <= l2 || o2 <= r2; ) {
    const u3 = e2[n2], d2 = t2[o2];
    if (null === u3) n2++;
    else if (r2 + 1 <= o2) j(u3), n2++;
    else if (l2 + 1 <= n2) c.push({ op: 4, cur: d2, ref: u3 }), o2++;
    else if (s2(u3, d2)) W(u3, d2), c.push({ op: 2 }), n2++, o2++;
    else {
      const l3 = u3.key ? i[u3.key] : null;
      null == l3 ? (j(u3), n2++) : o2 <= l3 ? (c.push({ op: 4, cur: d2, ref: u3 }), o2++) : (W(u3, t2[l3]), c.push({ op: 64, cur: u3, ref: e2[n2] }), e2[n2] = null, n2++);
    }
  }
  for (let e3 = u2.length - 1; e3 >= 0; e3--) c.push(u2[e3]);
  return c;
};
var $ = () => q || null;
var _ = (e2) => q = e2;
var ee = (e2) => "function" == typeof e2;
var te = (e2) => "number" == typeof e2 || "string" == typeof e2;
var ne = (e2, t2, ...n2) => {
  (n2 = le(oe((t2 = t2 || {}).children || n2))).length && (t2.children = 1 === n2.length ? n2[0] : n2);
  const o2 = t2.key || null, l2 = t2.ref || null;
  return o2 && (t2.key = void 0), l2 && (t2.ref = void 0), re(e2, t2, o2, l2);
};
var oe = (e2) => e2 ? ce(e2) ? e2 : [e2] : [];
var le = (e2, t2 = []) => (e2.forEach((e3) => {
  var n2;
  ce(e3) ? le(e3, t2) : null != (n2 = e3) && true !== n2 && false !== n2 && t2.push(te(e3) ? ie(e3) : e3);
}), t2);
var re = (e2, t2, n2, o2) => ({ type: e2, props: t2, key: n2, ref: o2 });
var ie = (e2) => ({ type: "#text", props: { nodeValue: e2 + "" } });
var ce = Array.isArray;
function ae(e2) {
  return e2.children;
}

// ctx.ts
var LoaderDataContext = y({});
if (!globalThis.__fre_globalFiber) {
  globalThis.__fre_globalFiber = {
    current: y({})
    // 存储 currentFiber 的实际值
  };
}
function useLoaderData() {
  if (typeof window !== "undefined") {
    const aaa = window["__FRE_LOADER_DATA__"];
    console.log(aaa);
    return aaa;
  }
  return k(globalThis.__fre_globalFiber.current);
}

// app/routes/index.tsx
function routes_default() {
  const data = useLoaderData();
  console.log(data);
  return /* @__PURE__ */ ne("div", null, /* @__PURE__ */ ne("h1", null, "Hello ", data.hello), /* @__PURE__ */ ne("img", { src: "/static/example.jpg", style: { width: "400px" } }));
}

// client-entry.tsx
P(/* @__PURE__ */ ne(routes_default, null), document.getElementById("app"));
