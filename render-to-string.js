import { resetCursor, resetFiber, useFiber } from "fre"

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
])

const NON_DIMENSIONAL = /^(opacity|zIndex|fontWeight|lineHeight|zoom|flex|flexGrow|flexShrink)$/

function attributeHook(name, value, isComponent) {
    const type = typeof value

    if (name === 'dangerouslySetInnerHTML') return false
    if (value == null || type === 'function') return ''

    if (!isComponent && (value === false ||
        ((name === 'class' || name === 'style') && value === ''))) {
        return ''
    }

    if (type !== 'string') {
        return `\n\t${name}={${value}}`
    }

    return `\n\t${name}="${encodeEntities(value)}"`
}

async function renderToString(vnode, isSvgMode = false, selectValue) {
    resetFiber(null)
    if (vnode == null || typeof vnode === 'boolean') return ''

    const { type: nodeName, props = {} } = vnode

    if (nodeName === '#text' && props.nodeValue) {
        return encodeEntities(props.nodeValue)
    }

    if (typeof nodeName === 'function') {
        return await renderComponent(vnode, isSvgMode, selectValue)
    }

    return await renderElement(nodeName, props, isSvgMode, selectValue)
}

async function renderComponent(vnode, isSvgMode, selectValue) {
    resetCursor()
    resetFiber(vnode)

    let tempVnode = vnode.type.call(vnode, vnode.props)

    if (vnode.action?.length) {
        resetCursor()
        const cleanups = await Promise.all(vnode.action.map(fn => Promise.resolve(fn())))
        vnode.action = []

        tempVnode = vnode.type.call(vnode, vnode.props)

        cleanups.filter(Boolean).forEach(cleanup => cleanup())
    }

    delete vnode.action
    resetFiber(null)

    return renderToString(tempVnode, isSvgMode, selectValue)
}

async function renderElement(nodeName, props, isSvgMode, selectValue) {
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

        if (attrName === 'dangerouslySetInnerHTML') {
            innerHtml = value?.__html || ''
            return
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

                htmlStr += await renderToString(child, childSvgMode, selectValue)
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

function useAction(fn) {
    const currentFiber = useFiber()
    (currentFiber.action || (currentFiber.action = [])).push(fn)
}

export { useAction, renderToString }
