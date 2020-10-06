/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          // i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [{
  url: "/dashboard",
  name: "Tasks",
  slug: "tasks",
  icon: "ClipboardIcon",
  i18n: "tasks",
},
{
  url: "/fooditems",
  name: "Food Item",
  slug: "fooditems",
  icon: "fastfood",
  i18n: "food items",
  feather: false
},
{
  url: "/schedule",
  name: "Schedule",
  slug: "schedule",
  icon: "CalendarIcon",
  i18n: "schedule",
},
{
  url: "/templates",
  name: "Templates",
  slug: "templates",
  icon: "BookOpenIcon",
  i18n: "templates",
},
// {
//   url: '/analytics',
//   name: 'Analytics',
//   slug: 'analytics',
//   icon: 'PieChartIcon',
//   i18n: 'analytics'
// },
{
  url: "/report",
  name: "Report",
  slug: "report",
  icon: "FileTextIcon",
  i18n: "reports",
},

{
  url: "/team",
  name: "Users Management",
  slug: "team",
  icon: "UsersIcon",
  i18n: "users management",
},

{
  url: '/company',
  name: "Company Profile",
  slug: "settings-company",
  i18n: "company profile",
  icon: "BriefcaseIcon",

},

{
  url: '/knowledge',
  name: "Knowledge Base",
  icon: "BookIcon",
  slug: 'knowledge-base',
  i18n: "knowledge base",
},
// {
//   url: '/profile',
//   name: "my profile",
//   slug: "settings-myprofile",
//   i18n: "my profile",
//   icon: "UserIcon",
// },
{
  url: "/chat",
  name: "Chat",
  slug: "chat",
  icon: "MessageSquareIcon",
  i18n: "Chat",
},
  // {
  //   url: null,
  //   name: 'Settings',
  //   icon: 'SettingsIcon',
  //   i18n: 'settings',
  //   submenu: [
  //   ]
  // },

]
