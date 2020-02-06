<template lang="pug">
    data-renderer(:data="data" :layout="d1" :url="url" :schema="query.schema" :showEmpty="true")
        //data-renderer(:data="data" :layout="d1" :url="url" :schema="query.schema")
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
                    a: {
                        b: '1'
                    }
                },
                d1: [
                    {
                        path: 'a',
                        label: 'a',
                        dynamic: true
                    }
                ]
            }
        }
    }
</script>
