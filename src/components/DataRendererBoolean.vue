<template lang="pug">
    data-renderer(:data="data" :layout="d1" :url="url" :schema="query.schema")
</template>

<script>
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
                'a': true
            },
            d1: [
                {
                    path: 'title',
                    value: {
                        class: ['text-h6']
                    }
                },
                {
                    path: 'a',
                    label: 'a'
                }
            ],
        };
    }
};
</script>
