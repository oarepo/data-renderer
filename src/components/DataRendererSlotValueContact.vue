<template lang="pug">
data-renderer(:data="data" :definition="d1" :url="url" :schema="query.schema")
    template(v-slot:value-contact="{value}")
        table(style="border-collapse: collapse;")
            tr #[td Phone: ] {{ value.phone }}
            tr #[td Email: ] {{ value.email }}
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
            d1: [
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
                    path: 'thumbnail',
                    label: 'Thumbnail'
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
