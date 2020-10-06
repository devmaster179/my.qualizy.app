<template>
    <div id="workplace-search" class="vs-inputx vs-input--input p-2 ">
         <div class="input-key-value">
            <div class="input-key-value-item ml-4 mt-1" v-for="(item , key) in selectedKey" :key = "key">
                <selected-value :item="item" :index="key" @removeFilter="removeFilter"/>
            </div>
            <div class="txt-input p-2">
                <input type="text" class="large pl-2" :placeholder="placeholder" v-model="searchText"
                    @click="focus"
                    @blur.native="blur"
                />
                <ul class="search-list" v-if="viewSearchList">
                    <li class="cursor-pointer" 
                        v-for="(item , key) in searchList" :key="key" @click="selectKey(item)">
                        {{item.key | capitalize}}
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div class="vs-dropdown--menu--after" style="top: 10px;"></div> -->
    </div>
</template>

<script>
import SelectedValue from './SelectedValue.vue'

export default {
    components: {
        SelectedValue
    },
    props: {
        placeholder: {
            type: String,
            default: 'Search...'
        },
        searchList: {
            type: Array,
            default:[]
        }
    },
    data() {
        return {
            searchText: "",
            viewSearchList: false,
            selectedKey: []
        }
    },
    methods: {
        focus() {
            this.viewSearchList = !this.viewSearchList
        },
        blur() {
            this.viewSearchList = false
        },
        selectKey(item) {
            if(item.type === 'string'){
                this.selectedKey.push({
                    item: item,
                    operator: 'same',
                    value: ''
                })
            } else {
                this.selectedKey.push({
                    item: item,
                    operator: 'equal',
                    value: ''
                })
            }

            this.viewSearchList = false

        },
        removeFilter(index) {
            this.selectedKey = this.selectedKey.filter((item,i) => {
                return index !== i
            })
        }
    }
}
</script>

<style scoped>
    /* #workplace-search{
    } */
    ul.search-list{
        position: absolute;
        z-index: 10;
        width: 200px;
        background: white;
        border-radius: .5rem;
        -webkit-box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
        box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
        -webkit-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }
    ul.search-list li{
        padding: 10px;
        border-radius: .5rem;
    }
    ul.search-list li:hover{
        background-color: rgba(var(--vs-primary), 1);
        color: aliceblue;
    }
    .input-key-value{
        display: inline;

    }
    .txt-input {
        display: inline-block;
        /* max-width: 30%; */
    }
    .txt-input>input {
        border: none;
        background-color: transparent;
        font-size: 1.2em;
    }
    .input-key-value-item {
        display: inline-block;
        white-space: nowrap;
    }
    

</style>