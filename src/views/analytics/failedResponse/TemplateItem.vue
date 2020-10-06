<template>
    <div>
        <div class="px-4 py-2 template-item border cursor-pointer border-solid d-theme-border-grey-light border-t-0 border-r-0 border-l-0 flex justify-between items-center" @click.stop="show=!show">
            <div class="flex items-center">
                <vs-avatar :src="require(`@/assets/images/template_image/${template.content.templateImage}`)"></vs-avatar>
                <span class="font-medium">{{template.content.templateTitle | truncate(30)}}</span>
            </div>
            <vs-icon icon-pack='feather' icon="icon-chevron-right"/>
        </div>

        <transition-group tag="ul"   v-if="show">
            <li  class="ml-4" v-for="(page, pIndex) in template.content.pages" :key="'page'+pIndex">
                <page-item :page="page"/>
            </li>
        </transition-group>
    </div>
</template>

<script>
import PageItem from './PageItem.vue'
export default {
    props: {
        template: Object
    },
    components: {
        PageItem
    },
    data() {
        return {
            show: false
        }
    }
}
</script>

<style scoped>
    li , .template-item{
        transition: all 0.3s ease;
    }
    .template-item:hover {
        -webkit-transform: translateY(-4px);
        transform: translateY(-4px);
    }
</style>