/* eslint-disable no-mixed-spaces-and-tabs */
/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'

import firebase from 'firebase/app'
import 'firebase/auth'

const MainLayout = () => import(/* webpackPrefetch: true */ /* webpackChunkName: "main" */'@/layouts/main/Main.vue');
const Test = () => import(/* webpackPrefetch: true */ '@/views/report/Print/Test.vue');
const Capture = () => import(/* webpackPrefetch: true */ '@/views/capture/Capture.vue');
const Tasks = () => import(/* webpackPrefetch: true */ '@/views/tasks/Tasks.vue');
const FoodItems = () => import(/* webpackPrefetch: true */ '@/views/fooditems/FoodItems.vue');
const Templates = () => import(/* webpackPrefetch: true */ '@/views/templates/Templates.vue');
const TemplateNew = () => import(/* webpackPrefetch: true */ '@/views/template-new/TemplateNew.vue');
const TemplateEdit = () => import(/* webpackPrefetch: true */ '@/views/template-edit/TemplateEdit.vue');
const Schedule = () => import(/* webpackPrefetch: true */ '@/views/schedule/Schedule.vue');
const Report = () => import(/* webpackPrefetch: true */ '@/views/report/Report.vue');
const ReportCreate = () => import(/* webpackPrefetch: true */ '@/views/report/Report-Create.vue');
const ReportView = () => import(/* webpackPrefetch: true */ '@/views/report/Report-View.vue');
const Analytics = () => import(/* webpackPrefetch: true */ '@/views/analytics/Analytics.vue');
const Team = () => import(/* webpackPrefetch: true */ '@/views/team/Team.vue');
const Profile = () => import(/* webpackPrefetch: true */ '@/views/profile/Profile.vue');
const Company = () => import(/* webpackPrefetch: true */ '@/views/company/Company.vue');
const Knowledge = () => import(/* webpackPrefetch: true */ '@/views/knowledge/Knowledge.vue');
const Articles = () => import(/* webpackPrefetch: true */ '@/views/articles/Articles.vue');
const Chat = () => import(/* webpackPrefetch: true */ '@/views/chat/Chat.vue');
const KnowledgePage = () => import(/* webpackPrefetch: true */ '@/views/knowledge-page/Knowledge.vue');
const Category = () => import(/* webpackPrefetch: true */ '@/views/category-page/Category.vue');
const FullPage = () => import(/* webpackPrefetch: true */'@/layouts/full-page/FullPage.vue');
const Login = () => import(/* webpackPrefetch: true */'@/views/pages/Login.vue');
const ForgotPassword = () => import(/* webpackPrefetch: true */'@/views/pages/ForgotPassword.vue');
const Register = () => import(/* webpackPrefetch: true */'@/views/pages/Register.vue');
const Digit = () => import(/* webpackPrefetch: true */'@/views/pages/Digit.vue');
const Error404 = () => import(/* webpackPrefetch: true */'@/views/pages/Error404.vue');
const NotAuthorized = () => import(/* webpackPrefetch: true */'@/views/pages/NotAuthorized.vue');
const PublicTemplates = () => import(/* webpackPrefetch: true */'@/views/pages/publicTemplate/PublicTemplates.vue');
const PublicReport = () => import(/* webpackPrefetch: true */'@/views/pages/publicReport/publicReport.vue');

Vue.use(Router)

const router = new Router({
    base: process.env.BASE_URL,
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    },
    routes: [

        {
            // =============================================================================
            // MAIN LAYOUT ROUTES
            // =============================================================================
            path: '',
            component: MainLayout,
            children: [
                // =============================================================================
                // Theme Routes
                // =============================================================================
                {
                    path: '/',
                    redirect: '/dashboard'
                },
                {
                    path: '/export-test',
                    name: 'export-test',
                    component: Test,
                },
                {
                    path: '/capture/:ids',
                    name: 'capture',
                    component: Capture,
                    meta: {
                        title: "Capture - Qualizy",
                        rule: 'visitor'
                    }
                },

                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: Tasks,
                    meta: {
                        title: "Dashboard - Qualizy",
                        rule: 'visitor'
                    }
                },

                {
                    path: '/fooditems',
                    name: 'fooditems',
                    component: FoodItems,
                    meta: {
                        title: "FoodItems - Qualizy",
                        rule: 'visitor',

                    }
                },
                // {
                //   path: '/plan/:id',
                //   name: 'plan',
                //   component: () => import('@/views/plan/Plan.vue'),
                //   meta: {
                //     title: "Plan - Qualizy",
                //     rule: 'visitor',
                //     breadcrumb: [{
                //         title: 'Home',
                //         url: '/'
                //       },
                //       {
                //         title: 'Plan',
                //         active: true
                //       },
                //     ],
                //     pageTitle: 'Plan',
                //   }
                // },

                {
                    path: '/templates',
                    name: 'templates',
                    component: Templates,
                    meta: {
                        title: "Templates - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/templates/template-new',
                    name: 'template-new',
                    component: TemplateNew,
                    meta: {
                        title: "Template New - Qualizy",
                        rule: 'visitor',
                        parent: 'templates',
                    },
                },
                {
                    path: '/templates/template-edit/:id/:state',
                    name: 'template-edit',
                    component: TemplateEdit,
                    meta: {
                        title: "Template Edit - Qualizy",
                        rule: 'visitor',
                        parent: 'templates',
                    },
                },

                // {
                //     path: '/templates/platform',
                //     name: 'library',
                //     component: () => import('@/views/template-new/Platform.vue'),
                //     meta: {
                //         title: "Template Plateform - Qualizy",
                //         rule: 'visitor',
                //         parent: 'templates',
                //     },
                // },
                // {
                //     path: '/templates/template-edit/:id',
                //     name: 'template-edit',
                //     component: () => import('@/views/template-edit/TemplateEdit.vue'),
                //     meta: {
                //         title: "Template Edit - Qualizy",
                //         rule: 'visitor',
                //         parent: 'templates',
                //     },
                // },
                {
                    path: '/schedule',
                    name: 'schedule',
                    component: Schedule,
                    meta: {
                        title: "Schedules - Qualizy",
                        rule: 'visitor',

                    }
                },
                {
                    path: '/report',
                    name: 'report',
                    component: Report,
                    meta: {
                        title: "Report - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/create-report',
                    name: 'create-report',
                    component: ReportCreate,
                    meta: {
                        title: "Report - Qualizy",
                        rule: 'visitor',
                        parent: 'report',
                    }
                },
                {
                    path: '/report-view/:id',
                    name: 'report-view',
                    component: ReportView,
                    meta: {
                        title: "Report View - Qualizy",
                        rule: 'visitor',
                        parent: 'report',
                    }
                },
                {
                    path: '/analytics',
                    name: 'analytics',
                    component: Analytics,
                    meta: {
                        title: "Analytics - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/team',
                    name: 'team',
                    component: Team,
                    meta: {
                        title: "User Manager - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: Profile,
                    meta: {
                        title: "Profile - Qualizy",
                        rule: 'visitor',
                        breadcrumb: [{
                            title: 'Home',
                            url: '/'
                        },
                        {
                            title: 'my profile',
                            active: true
                        }
                        ],
                        pageTitle: 'my profile'
                    }
                },
                {
                    path: '/company',
                    name: 'company',
                    component: Company,
                    meta: {
                        title: "Company - Qualizy",
                        rule: 'visitor',
                        // rule: 'super admin',
                    }
                },
                {
                    path: '/knowledge',
                    name: 'knowledge-base',
                    component: Knowledge,
                    meta: {
                        title: "Knowledge Base Admin - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/article/:id',
                    name: 'articles',
                    component: Articles,
                    meta: {
                        title: "Knowledge Base Articles - Qualizy",
                        rule: 'visitor',
                        parent: 'knowledge-base',
                    }
                },
                {
                    path: '/chat',
                    name: 'chat',
                    component: Chat,
                    meta: {
                        title: "Chat - Qualizy",
                        rule: 'visitor',
                    }
                },

                {
                    path: '/knowledge-page',
                    name: 'knowledge-page',
                    component: KnowledgePage,
                    meta: {
                        title: "Knowledge Base - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/category-page/:id',
                    name: 'category',
                    component: Category,
                    meta: {
                        title: "Articles of Knowledge Base - Qualizy",
                        rule: 'visitor',
                    }
                }
            ],
        },
        // =============================================================================
        // FULL PAGE LAYOUTS
        // =============================================================================
        {
            path: '',
            component: FullPage,
            children: [
                // =============================================================================
                // PAGES
                // =============================================================================

                {
                    path: '/pages/login',
                    name: 'page-login',
                    component: Login,
                    meta: {
                        title: "Login - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/forgot-password',
                    name: 'page-forgot-password',
                    component: ForgotPassword,
                    meta: {
                        title: "Forgot Password - Qualizy",
                        rule: 'public'
                    }
                },
                // {
                //   path: '/pages/phone',
                //   name: 'page-login-phone',
                //   component: () => import('@/views/pages/Phone-login.vue'),
                //   meta: {
                //     rule: 'public'
                //   }
                // },
                {
                    path: '/pages/register',
                    name: 'page-register',
                    component: Register,
                    meta: {
                        title: "Register - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/digit',
                    name: 'page-digit',
                    component: Digit,
                    meta: {
                        title: "Digit Login - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/error-404',
                    name: 'page-error-404',
                    component: Error404,
                    meta: {
                        title: "Not found - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/not-authorized',
                    name: 'page-not-authorized',
                    component: NotAuthorized,
                    meta: {
                        title: "Not Authorized - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/public-templates',
                    name: 'page-template',
                    component: PublicTemplates,
                    meta: {
                        title: "Public Template - Qualizy",
                        rule: 'public'
                    }
                },

                {
                    path: '/public-report/:id',
                    name: 'pubic-report',
                    component: PublicReport,
                    meta: {
                        title: "Public Report - Qualizy",
                        rule: 'public'
                    }
                },

            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/pages/error-404'
        }
    ],
})

router.afterEach((to, from) => {
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    let title = "Digital HACCP, Food Traceabilty and HSE solutions";
    if (nearestWithTitle) {
        title = nearestWithTitle.meta.title
    }
    window.gist.track("(Visit a page) <a href='" + location.href + "'>" + title + "</a>", {});
})

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    if (nearestWithTitle) document.title = nearestWithTitle.meta.title + " - Digital HACCP, Food Traceabilty and HSE solutions";
    firebase.auth().onAuthStateChanged(() => {
        const firebaseCurrentUser = firebase.auth().currentUser
        if (
            to.path === "/pages/login" ||
            to.path === "/pages/phone" ||
            to.path === "/pages/forgot-password" ||
            to.path === "/pages/error-404" ||
            to.path === "/pages/error-500" ||
            to.path === "/pages/register" ||
            to.path === "/callback" ||
            to.path === "/pages/comingsoon" ||
            to.path === "/pages/public-templates" ||
            to.path === "/pages/digit" ||
            to.path.includes("/public-report/") ||

            (localStorage.getItem('userInfo') !== undefined && firebaseCurrentUser !== null)
        ) {
            return next()
        }

        const visited = localStorage.getItem("visited");
        if (visited === null) {
            router.push({
                path: '/pages/register',
                query: {
                    to: to.path
                }
            }).catch((err) => { });    
        }else{
            router.push({
                path: '/pages/login',
                query: {
                    to: to.path
                }
            }).catch((err) => { });
        }
        
        localStorage.setItem("visited", true)
    })

});

export default router