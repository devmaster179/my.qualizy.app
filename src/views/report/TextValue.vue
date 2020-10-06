<template>
    <span :class="{'text-success':color=='success'}" style="word-break: break-word;">{{calcText}}<span class="text-danger cursor-pointer" v-if="calcTextTail()" @click.stop="showAll=!showAll">{{calcTextTail()}}</span></span>
</template>

<script>
export default {
    props:{
        text:{
            type: String
        },
        color: {
            type:String,
            default: ''
        }
    },

    computed: {
        calcTextTail() {
            return () => {
                if(this.text.length > 20){
                    if(this.showAll)
                    return ' less'
                    return ' ...'
                }
                else
                    return ''
            }
        },
        calcText() {
            if(this.showAll) return this.text
            if(this.text.length > 20)
                return this.text.substring(0,16)
            return this.text
        }
    },
    
    data() {
        return {
            showAll: false
        }
    }
}
</script>