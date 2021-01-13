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
// import auth from "@/auth/authService";
import firebase from 'firebase/app'
import 'firebase/auth'

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
            component: () => import('@/layouts/main/Main.vue'),
            children: [
                // =============================================================================
                // Theme Routes
                // =============================================================================
                {
                    path: '/',
                    redirect: '/dashboard'
                },
                {
                    path: '/capture/:ids',
                    name: 'capture',
                    component: () => import('@/views/capture/Capture.vue'),
                    meta: {
                        title: "Capture - Qualizy",
                        rule: 'visitor'
                    }
                },

                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/tasks/Tasks.vue'),
                    meta: {
                        title: "Dashboard - Qualizy",
                        rule: 'visitor'
                    }
                },

                {
                    path: '/fooditems',
                    name: 'fooditems',
                    component: () => import('@/views/fooditems/FoodItems.vue'),
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
                    component: () => import('@/views/templates/Templates.vue'),
                    meta: {
                        title: "Templates - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/templates/template-new',
                    name: 'template-new',
                    component: () => import('@/views/template-new/TemplateNew.vue'),
                    meta: {
                        title: "Template New - Qualizy",
                        rule: 'visitor',
                        parent: 'templates',
                    },
                },
                {
                    path: '/templates/template-edit/:id/:state',
                    name: 'template-edit',
                    component: () => import('@/views/template-edit/TemplateEdit.vue'),
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
                    component: () => import('@/views/schedule/Schedule.vue'),
                    meta: {
                        title: "Schedules - Qualizy",
                        rule: 'visitor',

                    }
                },
                {
                    path: '/report',
                    name: 'report',
                    component: () => import('@/views/report/Report.vue'),
                    meta: {
                        title: "Report - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/create-report',
                    name: 'create-report',
                    component: () => import('@/views/report/Report-Create.vue'),
                    meta: {
                        title: "Report - Qualizy",
                        rule: 'visitor',
                        parent: 'report',
                    }
                },
                {
                    path: '/report-view/:id',
                    name: 'report-view',
                    component: () => import('@/views/report/Report-View.vue'),
                    meta: {
                        title: "Report View - Qualizy",
                        rule: 'visitor',
                        parent: 'report',
                    }
                },
                {
                    path: '/analytics',
                    name: 'analytics',
                    component: () => import('@/views/analytics/Analytics.vue'),
                    meta: {
                        title: "Analytics - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/team',
                    name: 'team',
                    component: () => import('@/views/team/Team.vue'),
                    meta: {
                        title: "User Manager - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/profile/Profile.vue'),
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
                    component: () => import('@/views/company/Company.vue'),
                    meta: {
                        title: "Company - Qualizy",
                        rule: 'visitor',
                        // rule: 'super admin',
                    }
                },
                {
                    path: '/knowledge',
                    name: 'knowledge-base',
                    component: () => import('@/views/knowledge/Knowledge.vue'),
                    meta: {
                        title: "Knowledge Base Admin - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/article/:id',
                    name: 'articles',
                    component: () => import('@/views/articles/Articles.vue'),
                    meta: {
                        title: "Knowledge Base Articles - Qualizy",
                        rule: 'visitor',
                        parent: 'knowledge-base',
                    }
                },
                {
                    path: '/chat',
                    name: 'chat',
                    component: () => import('@/views/chat/Chat.vue'),
                    meta: {
                        title: "Chat - Qualizy",
                        rule: 'visitor',
                    }
                },

                {
                    path: '/knowledge-page',
                    name: 'knowledge-page',
                    component: () => import('@/views/knowledge-page/Knowledge.vue'),
                    meta: {
                        title: "Knowledge Base - Qualizy",
                        rule: 'visitor',
                    }
                },
                {
                    path: '/category-page/:id',
                    name: 'category',
                    component: () => import('@/views/category-page/Category.vue'),
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
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
                // =============================================================================
                // PAGES
                // =============================================================================

                {
                    path: '/pages/login',
                    name: 'page-login',
                    component: () => import('@/views/pages/Login.vue'),
                    meta: {
                        title: "Login - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/forgot-password',
                    name: 'page-forgot-password',
                    component: () => import('@/views/pages/ForgotPassword.vue'),
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
                    component: () => import('@/views/pages/Register.vue'),
                    meta: {
                        title: "Register - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/digit',
                    name: 'page-digit',
                    component: () => import('@/views/pages/Digit.vue'),
                    meta: {
                        title: "Digit Login - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/error-404',
                    name: 'page-error-404',
                    component: () => import('@/views/pages/Error404.vue'),
                    meta: {
                        title: "Not found - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/not-authorized',
                    name: 'page-not-authorized',
                    component: () => import('@/views/pages/NotAuthorized.vue'),
                    meta: {
                        title: "Not Authorized - Qualizy",
                        rule: 'public'
                    }
                },
                {
                    path: '/pages/public-templates',
                    name: 'page-template',
                    component: () => import('@/views/pages/publicTemplate/PublicTemplates.vue'),
                    meta: {
                        title: "Public Template - Qualizy",
                        rule: 'public'
                    }
                },

                {
                    path: '/public-report/:id',
                    name: 'pubic-report',
                    component: () => import('@/views/pages/publicReport/publicReport.vue'),
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
    if (nearestWithTitle){
        title = nearestWithTitle.meta.title
    }
    window.gist.track("(Visit a page) <a href='"+location.href+"'>"+title+"</a>", {});
    gist.trackPageView();
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    if (nearestWithTitle) document.title = nearestWithTitle.meta.title + " - Digital HACCP, Food Traceabilty and HSE solutions" ;
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
        router.push({
            path: '/pages/login',
            query: {
                to: to.path
            }
        }).catch((err) => {});
    })

});

export default router