function createDynamicArrayLayout ({ /*value, paths, layout,*/ schema, vue }) {
  return vue.$oarepo.dataRenderer.layouts[schema]
}

function createDynamicObjectLayout ({ /*paths, layout,*/ value, schema, vue }) {
  const props = Object.keys(value)
  const itemDef = vue.$oarepo.dataRenderer.layouts[schema]
  return props.map(prop => {
    const item = { ...itemDef, prop }
    if (!item.label.label) {
      item.label = { ...item.label, label: prop }
    }
    return item
  })
}

function createDynamicObjectPropLayout ({ /*paths, layout,*/ value, schema, vue }) {
  const itemDef = vue.$oarepo.dataRenderer.layouts[schema]
  const item = { ...itemDef }
  if (!item.label.label) {
    item.label = { ...item.label, label: value }
  }
  return item
}

export {
  createDynamicArrayLayout,
  createDynamicObjectLayout,
  createDynamicObjectPropLayout
}
