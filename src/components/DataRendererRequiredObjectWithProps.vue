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
            d1: [
                {
                    "path": "parent",
                    "children": [
                        {
                            "label": "child-1",
                            "path": "child-1"
                        },
                        {
                            "label": "child-2",
                            "path": "child-2"
                        },
                        {
                            "label": "child-3",
                            "path": "child-3"
                        },
                        {
                            "label": "child-4",
                            "path": "child-4"
                        }
                    ]
                }
            ],
        };
    }
};
</script>
