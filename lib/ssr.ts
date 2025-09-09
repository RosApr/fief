import { h, resetCursor, resetFiber } from "fre"

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
])

const NON_DIMENSIONAL = /^(opacity|zIndex|fontWeight|lineHeight|zoom|flex|flexGrow|flexShrink)$/

function attributeHook(name, value, isComponent) {
    const type = typeof value

    if (value == null || type === 'function') return ''

    if (!isComponent && (value === false ||
        ((name === 'class' || name === 'style') && value === ''))) {
        return ''
    }

    if (type !== 'string') {
        return ` ${name}={${value}}`
    }

    return ` ${name}="${encodeEntities(value)}"`
}

function renderToString(vnode, isSvgMode = false, selectValue) {
    if (vnode == null || typeof vnode === 'boolean') return ''

    const { type: nodeName, props = {} } = vnode

    if (nodeName === '#text' && props.nodeValue) {
        return encodeEntities(props.nodeValue)
    }

    if (typeof nodeName === 'function') {
        return renderComponent(vnode, isSvgMode, selectValue)
    }

    return renderElement(nodeName, props, isSvgMode, selectValue)
}

function renderComponent(vnode, isSvgMode, selectValue) {

    resetCursor()
    resetFiber(vnode)


    let child = vnode.type.call(vnode, vnode.props)
    child.parent = vnode

    return `<!-- ${vnode.type.name} -->${renderToString(child, isSvgMode, selectValue)}<!-- ${vnode.type.name} -->`
}

function renderElement(nodeName, props, isSvgMode, selectValue) {
    let htmlStr = `<${nodeName}`
    let innerHtml = ''
    const children = []

    Object.entries(props).forEach(([name, value]) => {
        if (name === 'children' || name === 'key' || name === 'ref') return

        let attrName = name === 'className' ? 'class' : name

        if (isSvgMode && attrName.match(/^xlink:?./)) {
            attrName = attrName.toLowerCase().replace(/^xlink:?/, 'xlink:')
        }

        if (attrName === 'style' && value && typeof value === 'object') {
            value = styleObjToCss(value)
        }

        if (attrName === 'value') {
            if (nodeName === 'select') {
                selectValue = value
                return
            } else if (nodeName === 'option' && selectValue == value) {
                htmlStr += ' selected'
            }
        }

        const attrStr = attributeHook(attrName, value, false)
        if (attrStr) htmlStr += attrStr
    })

    htmlStr += '>'

    if (VOID_ELEMENTS.has(nodeName)) {
        htmlStr = htmlStr.replace(/>$/, ' />')
        return htmlStr
    }

    if (innerHtml) {
        htmlStr += innerHtml
    } else {
        getChildren(children, props.children)
        for (const child of children) {
            if (child != null && child !== false) {
                const childSvgMode = nodeName === 'svg'
                    ? true
                    : nodeName === 'foreignObject'
                        ? false
                        : isSvgMode

                htmlStr += renderToString(child, childSvgMode, selectValue)
            }
        }
    }

    htmlStr += `</${nodeName}>`

    return htmlStr
}

const encodeEntities = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function styleObjToCss(styleObj) {
    let cssStr = ''
    for (const [prop, value] of Object.entries(styleObj)) {
        if (value == null) continue

        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()

        let cssValue = value
        if (typeof value === 'number' && !NON_DIMENSIONAL.test(prop)) {
            cssValue += 'px'
        }

        cssStr += `${cssProp}: ${cssValue}; `
    }
    return cssStr.trim() || undefined
}

function getChildren(accumulator, children) {
    if (Array.isArray(children)) {
        children.forEach(child => getChildren(accumulator, child))
    } else if (children != null && children !== false) {
        accumulator.push(children)
    }
    return accumulator
}

export { renderToString }