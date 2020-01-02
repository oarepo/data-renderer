<template lang="pug">
q-page.q-ma-lg
    q-btn.float-right(icon="launch"
        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererPage.vue"
        type="a" target="_blank" flat) View source

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
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererDefault.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Default rendering
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-default(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererSlotThumbnail.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with #[code v-slot:value-thumbnail]
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-thumbnail(:query="query")


        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererSlotRootThumbnail.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with #[code v-slot:-value-thumbnail]
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-root-thumbnail(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererSlotValueContact.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with #[code v-slot:value-contact]
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-value-contact(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererSlotTreeDefinition.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with tree definition
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-slot-tree-definition(:query="query")

    h6 Supplying custom component
    .row.q-col-gutter-sm
        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererComponentCreator.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component for Creator
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererComponentCreatorLabel.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component for Creator label
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-label(:query="query")


        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererComponentCreatorValue.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component for Creator value
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-value(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererComponentCreatorSkip.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Skipping creator with a custom component set to null
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-skip(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererComponentCreatorDefinition.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Rendered with custom component in definition
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-component-creator-definition(:query="query")

    h6 Dynamic definition
    .row.q-col-gutter-sm
        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererDynamic.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium No definition at all
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererDynamicContact.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Definition with dynamic contact details
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic-contact(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererDynamicContactDefinition.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Dynamic definition with custom definition of Contact
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic-contact-definition(:query="query")

        .div.col-4
            .q-card.full-height
                q-card-section
                    q-btn.float-right(icon="launch"
                        href="https://github.com/oarepo/invenio-oarepo-ui-quasar/tree/invenio-3.2/src/components/misc/DataRendererDynamicNoContact.vue"
                        type="a" target="_blank" flat size="x-small") View source
                    .text-weight-medium Dynamic definition with removed Contact
                    q-separator.q-mb-md.q-mt-sm
                    data-renderer-dynamic-no-contact(:query="query")

</template>

<script>
import DataRendererDefault from './DataRendererDefault';
import DataRendererSlotThumbnail from './DataRendererSlotThumbnail';
import DataRendererSlotRootThumbnail from './DataRendererSlotRootThumbnail';
import DataRendererSlotValueContact from './DataRendererSlotValueContact';
import DataRendererSlotTreeDefinition from './DataRendererSlotTreeDefinition';
import DataRendererComponentCreator from './DataRendererComponentCreator';
import DataRendererComponentCreatorLabel from './DataRendererComponentCreatorLabel';
import DataRendererComponentCreatorValue from './DataRendererComponentCreatorValue';
import DataRendererComponentCreatorSkip from './DataRendererComponentCreatorSkip';
import DataRendererComponentCreatorDefinition from './DataRendererComponentCreatorDefinition';
import DataRendererDynamic from './DataRendererDynamic';
import DataRendererDynamicContact from './DataRendererDynamicContact';
import DataRendererDynamicContactDefinition from './DataRendererDynamicContactDefinition';
import DataRendererDynamicNoContact from './DataRendererDynamicNoContact';

export default {
    components: {
        'data-renderer-default': DataRendererDefault,
        'data-renderer-slot-thumbnail': DataRendererSlotThumbnail,
        'data-renderer-slot-root-thumbnail': DataRendererSlotRootThumbnail,
        'data-renderer-slot-value-contact': DataRendererSlotValueContact,
        'data-renderer-slot-tree-definition': DataRendererSlotTreeDefinition,
        'data-renderer-component-creator': DataRendererComponentCreator,
        'data-renderer-component-creator-label': DataRendererComponentCreatorLabel,
        'data-renderer-component-creator-value': DataRendererComponentCreatorValue,
        'data-renderer-component-creator-skip': DataRendererComponentCreatorSkip,
        'data-renderer-component-creator-definition': DataRendererComponentCreatorDefinition,
        'data-renderer-dynamic': DataRendererDynamic,
        'data-renderer-dynamic-contact': DataRendererDynamicContact,
        'data-renderer-dynamic-contact-definition': DataRendererDynamicContactDefinition,
        'data-renderer-dynamic-no-contact': DataRendererDynamicNoContact
    },
    props: {
        query: Object
    },
};
</script>
