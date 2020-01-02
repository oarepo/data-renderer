<template lang="pug">
data-renderer(:data="data" :url="url" :schema="query.schema"
    :nestedChildren="true" :pathDefinitions="contactDefinition")

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
            contactDefinition: {
                'contact': {
                    path: 'contact',
                    label: 'Contact',
                    wrapper: {
                        class: ['q-card--bordered']
                    },
                    nestedChildren: true,
                    children: [
                        {
                            path: 'email',
                            label: 'E-mail'
                        },
                        {
                            path: 'phone',
                            label: 'Phone'
                        }
                    ]
                }
            },
        };
    }
};
</script>
