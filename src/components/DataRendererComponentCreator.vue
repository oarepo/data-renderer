<template lang="pug">
data-renderer(:data="data" :layout="d1" :url="url"
    :schema="query.schema" :pathLayouts="creatorCustomComponent")

</template>

<script>

/* eslint no-console:off */

const CustomComponent = {
    props: [
        'context',
        'layout',
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

export default {
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
            creatorCustomComponent: {
                'creator': {
                    wrapper: {
                        component: CustomComponent
                    }
                }
            },

        };
    }
};
</script>
