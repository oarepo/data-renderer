<template lang="pug">
q-page.q-ma-lg

    .q-gutter-sm.fixed-top-right.z-max.q-pt-xs.q-pr-lg.text-white
        span Display schema:
        q-radio(v-model="query.schema" val="inline" label="inline" color="yellow")
        q-radio(v-model="query.schema" val="block" label="block" color="yellow")
        q-radio(v-model="query.schema" val="table" label="table" color="yellow")
        q-radio(v-model="query.schema" val="flex" label="flex" color="yellow")

    h6 Default rendering and slots
    .row.q-col-gutter-sm
        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererDefault.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Default rendering
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-default(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererLink.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Default rendering with links
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-link(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererSlotThumbnail.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with #[code v-slot:value-thumbnail]
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-thumbnail(:query="query")


        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererSlotRootThumbnail.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with #[code v-slot:-value-thumbnail]
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-root-thumbnail(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererSlotValueContact.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with #[code v-slot:value-contact]
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-value-contact(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererSlotTreeLayout.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with tree layout
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-tree-layout(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererSimpleArray.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Simple array
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-simple-array(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererComplexArray.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Complex array
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-complex-array(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererComplexDynamicArray.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Complex dynamic array
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-complex-dynamic-array(:query="query")

    h6 Supplying custom component
    .row.q-col-gutter-sm
        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererComponentCreator.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component for Creator
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererComponentCreatorLabel.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component for Creator label
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-label(:query="query")


        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererComponentCreatorValue.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component for Creator value
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-value(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererComponentCreatorSkip.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Skipping creator with a custom component set to null
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-skip(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererComponentCreatorLayout.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component in layout
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-layout(:query="query")

    h6 Dynamic layout
    .row.q-col-gutter-sm
        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererDynamic.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium No layout at all
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererDynamicContact.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Layout with dynamic contact details
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic-contact(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererDynamicContactLayout.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Dynamic layout with custom layout of Contact
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic-contact-layout(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/data-renderer/blob/master/src/components/DataRendererDynamicNoContact.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Dynamic layout with removed Contact
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic-no-contact(:query="query")

</template>

<script>
import DataRendererDefault from './DataRendererDefault';
import DataRendererSlotThumbnail from './DataRendererSlotThumbnail';
import DataRendererSlotRootThumbnail from './DataRendererSlotRootThumbnail';
import DataRendererSlotValueContact from './DataRendererSlotValueContact';
import DataRendererSlotTreeLayout from './DataRendererSlotTreeLayout';
import DataRendererComponentCreator from './DataRendererComponentCreator';
import DataRendererComponentCreatorLabel from './DataRendererComponentCreatorLabel';
import DataRendererComponentCreatorValue from './DataRendererComponentCreatorValue';
import DataRendererComponentCreatorSkip from './DataRendererComponentCreatorSkip';
import DataRendererComponentCreatorLayout from './DataRendererComponentCreatorLayout';
import DataRendererDynamic from './DataRendererDynamic';
import DataRendererDynamicContact from './DataRendererDynamicContact';
import DataRendererDynamicContactLayout from './DataRendererDynamicContactLayout';
import DataRendererDynamicNoContact from './DataRendererDynamicNoContact';
import DataRendererLink from './DataRendererLink'
import DataRendererSimpleArray from './DataRendererSimpleArray'
import DataRendererComplexArray from './DataRendererComplexArray'
import DataRendererComplexDynamicArray from './DataRendererComplexDynamicArray'

export default {
    components: {
        'data-renderer-default': DataRendererDefault,
        'data-renderer-slot-thumbnail': DataRendererSlotThumbnail,
        'data-renderer-slot-root-thumbnail': DataRendererSlotRootThumbnail,
        'data-renderer-slot-value-contact': DataRendererSlotValueContact,
        'data-renderer-slot-tree-layout': DataRendererSlotTreeLayout,
        'data-renderer-component-creator': DataRendererComponentCreator,
        'data-renderer-component-creator-label': DataRendererComponentCreatorLabel,
        'data-renderer-component-creator-value': DataRendererComponentCreatorValue,
        'data-renderer-component-creator-skip': DataRendererComponentCreatorSkip,
        'data-renderer-component-creator-layout': DataRendererComponentCreatorLayout,
        'data-renderer-dynamic': DataRendererDynamic,
        'data-renderer-dynamic-contact': DataRendererDynamicContact,
        'data-renderer-dynamic-contact-layout': DataRendererDynamicContactLayout,
        'data-renderer-dynamic-no-contact': DataRendererDynamicNoContact,
        'data-renderer-link': DataRendererLink,
        'data-renderer-simple-array': DataRendererSimpleArray,
        'data-renderer-complex-array': DataRendererComplexArray,
        'data-renderer-complex-dynamic-array': DataRendererComplexDynamicArray
    },
    props: {
        query: Object
    },
};
</script>
