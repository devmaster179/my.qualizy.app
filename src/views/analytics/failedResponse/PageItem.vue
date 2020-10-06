<template>
    <div>
        <div class="p-4 template-item border cursor-pointer border-solid d-theme-border-grey-light border-t-0 border-r-0 border-l-0 flex justify-between items-center">
            <span>{{page.title | truncate(30)}}</span>
            <vs-icon icon-pack='feather' icon="icon-chevron-right"/>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        page: {
            type: Object
        }
    }
}
</script>