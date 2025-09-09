// node_modules/.pnpm/fre@2.8.6-fix4/node_modules/fre/dist/fre.js
var e = {};
var t = (t2, n2, o) => {
  t2 = t2 || e, n2 = n2 || e, Object.keys(t2).forEach((e2) => o(e2, t2[e2], n2[e2])), Object.keys(n2).forEach((e2) => !t2.hasOwnProperty(e2) && o(e2, void 0, n2[e2]));
};
var n = (e2, n2, o) => {
  t(n2, o, (n3, o2, r2) => {
    o2 === r2 || "children" === n3 || ("style" !== n3 || oe(r2) ? "o" === n3[0] && "n" === n3[1] ? (n3 = n3.slice(2).toLowerCase(), o2 && e2.removeEventListener(n3, o2), e2.addEventListener(n3, r2)) : !(n3 in e2) || e2 instanceof SVGElement ? null == r2 || false === r2 ? e2.removeAttribute(n3) : e2.setAttribute && (null == e2 || e2.setAttribute(n3, r2)) : e2[n3] = r2 || "" : t(o2, r2, (t2, o3, r3) => {
      o3 !== r3 && (e2[n3][t2] = r3 || "");
    }));
  });
};
var r = 0;
var l = () => {
  r = 0;
};
var v = [];
var g = [];
var b = 0;
var E = (e2) => {
  g.push(e2) && x();
};
var w = (e2) => {
  v.push({ callback: e2 }), E(A);
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
var x = C(false);
var A = () => {
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
var M = () => V() >= b;
var V = () => performance.now();
var L = (e2) => e2[0];
var N = (e2) => {
  var t2, o;
  if (!e2) return;
  S(e2.ref, e2.node), O(e2.child);
  let { op: r2, ref: l2, cur: i } = e2.action || {}, s = null === (t2 = null == e2 ? void 0 : e2.parent) || void 0 === t2 ? void 0 : t2.node, u = null;
  if (8 === (null == s ? void 0 : s.nodeType) && ("Suspense" === (null == s ? void 0 : s.nodeValue) && (u = s), s = s.parentNode), 4 & r2 || 64 & r2) {
    let t3 = null;
    e2.isComp && (t3 = null === (o = null == e2 ? void 0 : e2.node) || void 0 === o ? void 0 : o.firstChild), s.insertBefore(null == i ? void 0 : i.node, null != u ? u : null == l2 ? void 0 : l2.node), e2.isComp && (e2.node = t3);
  }
  if (2 & r2) {
    const t3 = e2.node;
    n(t3, e2.alternate.props || {}, e2.props);
  }
  e2.action = null, O(e2.sibling);
};
function O(e2) {
  (null == e2 ? void 0 : e2.memo) ? O(e2.sibling) : N(e2);
}
var S = (e2, t2) => {
  e2 && (ne(e2) ? e2(t2) : e2.current = t2);
};
var T = (e2) => {
  null == e2 || e2.forEach((e3) => {
    e3.kids && T(e3.kids), S(e3.ref, null);
  });
};
var j = (e2, t2 = true) => {
  var n2, o, r2;
  e2.isComp ? e2.hooks && e2.hooks.list.forEach((e3) => e3[2] && e3[2]()) : (t2 && (null === (o = null === (n2 = e2.node) || void 0 === n2 ? void 0 : n2.parentNode) || void 0 === o || o.removeChild(e2.node), t2 = false), T(e2.kids), S(e2.ref, null)), null === (r2 = null == e2 ? void 0 : e2.kids) || void 0 === r2 || r2.forEach((e3) => j(e3, t2));
};
var q = null;
var P = null;
var U = {};
var B = (e2, t2) => {
  U.hydrate && (P = U.hydrate(t2));
  let n2 = { node: t2, props: { children: e2 }, hydrating: !!U.hydrate };
  D(n2);
};
var D = (e2) => {
  e2.dirty || (e2.dirty = true, w(() => F(e2)));
};
var F = (e2) => {
  for (; e2 && !M(); ) e2 = $(e2);
  return e2 ? F.bind(null, e2) : null;
};
var G = (e2, t2) => {
  let n2 = e2.parent;
  for (; n2; ) {
    if (n2.type === t2) return n2;
    n2 = n2.parent;
  }
  return null;
};
var $ = (e2) => {
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
var z = (e2) => {
  var t2, n2;
  if (e2.type.memo && e2.type === (null === (t2 = e2.alternate) || void 0 === t2 ? void 0 : t2.type) && (null === (n2 = e2.alternate) || void 0 === n2 ? void 0 : n2.props)) {
    if (!(e2.type.shouldUpdate || J)(e2.props, e2.alternate.props)) return true;
  }
  return false;
};
var H = (e2) => {
  for (; e2; ) {
    if (I(e2), e2.dirty) return e2.dirty = false, N(e2), null;
    if (e2.sibling) return e2.sibling;
    e2 = e2.parent;
  }
  return null;
};
var I = (e2) => {
  e2.isComp && e2.hooks && (Z(e2.hooks.layout), w(() => Z(e2.hooks.effect)));
};
var J = (e2, t2) => {
  for (let n2 in e2) if (!(n2 in t2)) return true;
  for (let n2 in t2) if (e2[n2] !== t2[n2]) return true;
};
var K = (e2) => {
  l(), te(e2), e2.node = e2.node || ((e3) => {
    const t3 = document.createDocumentFragment(), n2 = document.createComment(e3.type.name);
    return t3.appendChild(n2), t3;
  })(e2);
  let t2 = e2.type(e2.props);
  W(e2, R(t2));
};
var Q = (e2) => {
  e2.node ? e2.hydrating && n(e2.node, {}, e2.props) : ("svg" === e2.type && (e2.lane |= 16), e2.node = ((e3) => {
    const t2 = "#text" === e3.type ? document.createTextNode("") : 16 & e3.lane ? document.createElementNS("http://www.w3.org/2000/svg", e3.type) : document.createElement(e3.type);
    return n(t2, {}, e3.props), t2;
  })(e2)), W(e2, e2.props.children);
};
var R = (e2) => oe(e2) ? ue(e2) : e2;
var W = (e2, t2) => {
  let n2 = e2.kids || [], o = e2.kids = Y(t2);
  const r2 = _(n2, o);
  for (let t3 = 0, n3 = null, l2 = o.length; t3 < l2; t3++) {
    const l3 = o[t3];
    l3.action = r2[t3], 16 & e2.lane && (l3.lane |= 16), e2.hydrating && (l3.hydrating = true), l3.parent = e2, t3 > 0 ? n3.sibling = l3 : e2.child = l3, n3 = l3;
  }
};
function X(e2, t2) {
  t2.hooks = e2.hooks, t2.ref = e2.ref, t2.node = e2.node, t2.kids = e2.kids, t2.alternate = e2, t2.hydrating = e2.hydrating;
}
var Y = (e2) => e2 ? ce(e2) ? e2 : [e2] : [];
var Z = (e2) => {
  e2.forEach((e3) => e3[2] && e3[2]()), e2.forEach((e3) => e3[2] = e3[0]()), e2.length = 0;
};
var _ = (e2, t2) => {
  let n2 = 0, o = 0, r2 = e2.length - 1, l2 = t2.length - 1, i = {}, s = (e3, t3) => e3.type === t3.type && e3.key === t3.key, u = [], d = [];
  for (; n2 <= r2 && o <= l2 && s(e2[r2], t2[l2]); ) X(e2[r2], t2[l2]), u.push({ op: 2 }), r2--, l2--;
  for (; n2 <= r2 && o <= l2 && s(e2[n2], t2[o]); ) X(e2[n2], t2[o]), d.push({ op: 2 }), n2++, o++;
  for (let e3 = o; e3 <= l2; e3++) t2[e3].key && (i[t2[e3].key] = e3);
  for (; n2 <= r2 || o <= l2; ) {
    const u2 = e2[n2], a = t2[o];
    if (null === u2) n2++;
    else if (l2 + 1 <= o) j(u2), n2++;
    else if (r2 + 1 <= n2) d.push({ op: 4, cur: a, ref: u2 }), o++;
    else if (s(u2, a)) X(u2, a), d.push({ op: 2 }), n2++, o++;
    else {
      const r3 = u2.key ? i[u2.key] : null;
      null == r3 ? (j(u2), n2++) : o <= r3 ? (d.push({ op: 4, cur: a, ref: u2 }), o++) : (X(u2, t2[r3]), d.push({ op: 64, cur: u2, ref: e2[n2] }), e2[n2] = null, n2++);
    }
  }
  for (let e3 = u.length - 1; e3 >= 0; e3--) d.push(u[e3]);
  return d;
};
var te = (e2) => q = e2;
var ne = (e2) => "function" == typeof e2;
var oe = (e2) => "number" == typeof e2 || "string" == typeof e2;
var re = (e2, t2, ...n2) => {
  (n2 = ie(le((t2 = t2 || {}).children || n2))).length && (t2.children = 1 === n2.length ? n2[0] : n2);
  const o = t2.key || null, r2 = t2.ref || null;
  return o && (t2.key = void 0), r2 && (t2.ref = void 0), se(e2, t2, o, r2);
};
var le = (e2) => e2 ? ce(e2) ? e2 : [e2] : [];
var ie = (e2, t2 = []) => (e2.forEach((e3) => {
  var n2;
  ce(e3) ? ie(e3, t2) : null != (n2 = e3) && true !== n2 && false !== n2 && t2.push(oe(e3) ? ue(e3) : e3);
}), t2);
var se = (e2, t2, n2, o) => ({ type: e2, props: t2, key: n2, ref: o });
var ue = (e2) => ({ type: "#text", props: { nodeValue: e2 + "" } });
var ce = Array.isArray;
function fe(e2) {
  return e2.children;
}

// app/routes/index.tsx
function routes_default() {
  return /* @__PURE__ */ re("div", null, /* @__PURE__ */ re("h1", null, "Hello"), /* @__PURE__ */ re("img", { src: "/static/example.jpg", style: { width: "400px" } }));
}

// hydrate.ts
function hydrate(domNode) {
  let head = null;
  let tail = null;
  const stack = [];
  function traverse(node) {
    if (node.nodeType === 8) {
      const name = node.textContent.trim();
      if (!name) return;
      if (stack.length && stack[stack.length - 1].type === `$${name}`) {
        stack.pop();
      } else {
        const newNode = { type: `$${name}`, next: null, kids: [] };
        if (head) {
          tail.next = newNode;
          tail = newNode;
        } else {
          head = newNode;
          tail = newNode;
        }
        if (stack.length) {
          stack[stack.length - 1].kids.push(newNode);
        }
        stack.push(newNode);
      }
      node.remove();
    } else if (stack.length) {
      const currentParent = stack[stack.length - 1];
      if (node.nodeType === 1) {
        const newNode = { type: node.tagName.toLowerCase(), next: null, kids: [], node, key: null };
        tail.next = newNode;
        tail = newNode;
        currentParent.kids.push(newNode);
        stack.push(newNode);
        node.childNodes.forEach(traverse);
        if (stack.length && stack[stack.length - 1].type === newNode.type) {
          stack.pop();
        }
        return;
      } else if (node.nodeType === 3) {
        const text = node.textContent.trim();
        if (text) {
          const newNode = { type: "#text", alternate: { props: { nodeValue: text } }, next: null, kids: [], node };
          tail.next = newNode;
          tail = newNode;
          currentParent.kids.push(newNode);
        }
      }
    }
    node.childNodes.forEach(traverse);
  }
  traverse(domNode);
  return {
    type: domNode.tagName.toLowerCase(),
    node: domNode,
    next: head,
    kids: [head]
  };
}

// client-entry.tsx
U.hydrate = hydrate;
B(/* @__PURE__ */ re(routes_default, null), document.getElementById("app"));
