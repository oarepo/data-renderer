<template lang="pug">
data-renderer(:data="data" :definition="d2" :url="url" :schema="query.schema")
    template(v-slot:-value-thumbnail="{value}")
        div
            img(:src="value" style="height: 40px;")
</template>

<script>
import { DataRenderer } from '@oarepo/invenio-quasar';
export default {
    components: {
        'data-renderer': DataRenderer
    },
    props: {
        query: Object
    },
    data: function () {
        return {
            url: '/',
            data: {
                '$schema': 'https://restaurovani.vscht.cz/schemas/draft/krokd/restoration-object-v1.0.0.json',
                'id': '1',
                'title': 'Object 1',
                'thumbnail': 'https://cis-login.vscht.cz/static/web/logo_small.png',
                'creator': 'Mary Black',
                'contact': {
                    phone: '+420123123123',
                    email: 'mary.black@gmail.com'
                }
            },
            d2: [
                {
                    path: 'thumbnail',
                    wrapper: {
                        class: ['float-left', 'q-ma-sm q-mr-lg']
                    }
                },
                {
                    path: 'title',
                    value: {
                        class: ['text-h6']
                    }
                },
                {
                    path: 'creator',
                    label: 'Creator'
                },
                {
                    path: 'contact',
                    label: 'Contact'
                }
            ],
        };
    }
};
</script>
