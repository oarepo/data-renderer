<template lang="pug">
data-renderer(:data="data" :definition="d1" :url="url"
    :schema="query.schema" :components="creatorValueCustomComponent")

</template>

<script>
import { DataRenderer } from '@oarepo/invenio-quasar';

/* eslint no-console:off */

const CustomComponent = {
    props: [
        'context',
        'definition',
        'data',
        'paths',
        'value',
        'values'
    ],
    render(h) {
        console.log('Custom component props', this.$props);
        console.log('Custom component attrs', this.$attrs);
        return h('span', {
            attrs: {
                title: 'See console log for details'
            },
            class: 'text-red',
        }, 'This is a custom component');
    }
};

const CustomTableComponent = {
    props: [
        'context',
        'definition',
        'data',
        'paths',
        'value',
        'values'
    ],
    render(h) {
        console.log('Custom table component props', this.$props);
        console.log('Custom table component attrs', this.$attrs);
        return h('td', {
            attrs: {
                title: 'See console log for details'
            },
            class: 'text-red',
        }, 'This is a custom component used only in a table');
    }
};

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
            creatorValueCustomComponent: {
                'value-creator': CustomComponent,
                'value-creator$table': CustomTableComponent
            },
        };
    }
};
</script>
