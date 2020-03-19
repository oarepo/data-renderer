function createDynamicArrayLayout ({ /*value, paths, layout,*/ schema, vue }) {
  return vue.$oarepo.dataRenderer.layouts[schema]
}

function createDynamicObjectLayout ({ /*paths, layout,*/ value, schema, vue }) {
  const props = Object.keys(value)
  const itemDef = vue.$oarepo.dataRenderer.layouts[schema]
  return props.map(prop => {
    const item = { ...itemDef, prop }
    item.label = { ...item.label, label: prop }
    return item
  })
}

export {
  createDynamicArrayLayout,
  createDynamicObjectLayout
}
