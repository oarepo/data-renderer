<template lang="pug">
data-renderer(:data="data" :layout="d1" :url="url" :schema="query.schema" :showEmpty="true")
</template>

<script>
export default {
    props: {
        query: Object
    },
    data: function () {
        return {
            url: '/',
            data: {},
            d1: {
                defaultValue: { firstname: 'a', lastname: 'b' },
                children: ['firstname', 'lastname']
            }
        }
    }
}
</script>
