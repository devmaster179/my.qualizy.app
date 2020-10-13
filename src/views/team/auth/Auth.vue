<template>
    <div class="auth-tab">
        <vx-card class="mt-4" style="min-width:400px;">
            <table class="w-full auth-table rounded-lg w-full border border-solid d-theme-border-grey-light">
                <thead>
                <tr>
                    <th rowspan="2" width="15%" class="border border-solid d-theme-border-grey-light border-t-0 border-l-0  border-b-0" style="min-width:100px;">Subject</th>
                    <th rowspan="2" width="15%" class="border border-solid d-theme-border-grey-light border-t-0 border-l-0  border-b-0" style="min-width:100px;">Actions</th>
                    <th colspan="4" class="border border-solid d-theme-border-grey-light border-t-0 border-l-0  border-r-0">Role</th>
                </tr>
                <tr>
                    <th class="border border-solid d-theme-border-grey-light border-t-0 border-l-0  border-b-0">Admin</th>
                    <th class="border border-solid d-theme-border-grey-light border-t-0 border-l-0  border-b-0">Supervisor</th>
                    <th class="border border-solid d-theme-border-grey-light border-t-0 border-l-0  border-b-0">Operator</th>
                    <th class="border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0  border-b-0">Auditor</th>
                </tr>
                </thead>
                <tbody v-for="(auth,key,index) in auths" :key="index">
                    <tr :key="index">
                        <td rowspan="4" class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">{{key | capitalize}}</td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">View</td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" @input="chnAuth(key,'admin' , 'view')" :value="auth.admin.view"/>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.supervisor.view" @input="chnAuth(key,'supervisor' , 'view')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.operator.view" @input="chnAuth(key,'operator' , 'view')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0 border-r-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.auditor.view" @input="chnAuth(key,'auditor' , 'view')"></vs-checkbox>
                        </td>
                    </tr>
                    <tr :key="'a'+index">
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">Create</td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.admin.create" @input="chnAuth(key,'admin' , 'create')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.supervisor.create" @input="chnAuth(key,'supervisor' , 'create')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.operator.create" @input="chnAuth(key,'operator' , 'create')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0 border-r-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.auditor.create" @input="chnAuth(key,'auditor' , 'create')"></vs-checkbox>
                        </td>
                    </tr>
                    <tr :key="'b'+index">
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">Edit</td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.admin.edit"  @input="chnAuth(key,'admin' , 'edit')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.supervisor.edit" @input="chnAuth(key,'supervisor' , 'edit')"></vs-checkbox>

                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.operator.edit" @input="chnAuth(key,'operator' , 'edit')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0 border-r-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.auditor.edit" @input="chnAuth(key,'auditor' , 'edit')"></vs-checkbox>
                        </td>
                    </tr>
                    <tr :key="'c'+index">
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">Delete</td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.admin.delete" @input="chnAuth(key,'admin' , 'delete')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.supervisor.delete" @input="chnAuth(key,'supervisor' , 'delete')"></vs-checkbox>

                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.operator.delete" @input="chnAuth(key,'operator' , 'delete')"></vs-checkbox>
                        </td>
                        <td class="border border-solid d-theme-border-grey-light border-l-0  border-b-0 border-r-0">
                            <vs-checkbox class="justify-center" color="success" :value="auth.auditor.delete" @input="chnAuth(key,'auditor' , 'delete')"></vs-checkbox>
                        </td>
                    </tr>
                </tbody>
            </table>
        </vx-card>
    </div>
</template>
<script>
import { db } from "@/firebase/firebaseConfig.js";

export default {
    computed: {
        auths() {
            return this.$store.getters['app/auth']
        }
    },
    methods: {
        chnAuth(key,role,action) {
            this.$store.commit("app/CHN_AUTH" , {key:key,role: role, action: action})
            db.collection('roles').doc(JSON.parse(localStorage.getItem("userInfo")).group).set(this.auths)
        }

    }
}
</script>

<style scoped>
    .auth-table {
        border-spacing: 0px;
    }
    .auth-table th{
        padding: 10px 0;
        vertical-align: bottom;
        text-align: center;
    }
    .auth-table td{
        padding: 7px 0;
        vertical-align: center;
        text-align: center;
    }
    .auth-table tbody  td, .auth-table tr td {
        transition: all .3s ease;
    }
    .auth-table tbody:hover td[rowspan], .auth-table tr:hover td {
        background: #61f5585f; 
    }
    /* .auth-table tr:hover{
        background: #61f5581f;
    } */

</style>