const routes = [
  {
    path: "/",
    redirect: to => {
      // the function receives the target route as the argument
      // we return a redirect path/location here.
      return { path: '/home' }
    },
  },

  {
    path: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/login/Index.vue"), name: 'login' }
    ],


  },
  {
    path: "/register",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/register/Index.vue"), name: 'register' }
    ],


  },
  {
    path: "/otp",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/otp/Index.vue"), name: 'otp' }
    ],


  },

  {
    path: "/home",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/home/Index.vue"), name: 'home' }
    ],
  },


  {
    path: "/category/:id/products",

    component: () => import("layouts/MainLayout.vue"),

    children: [
      { path: "", component: () => import("pages/category/Index.vue"), name: 'category' }
    ],
  },

  {
    path: "/category/:category_id/products/:price_min/:price_max/sort/:sort",

    component: () => import("layouts/MainLayout.vue"),

    children: [
      { path: "", component: () => import("pages/filters/Index.vue"), name: 'category-by-filter' }
    ],
  },


  {
    path: "/nearby-stores",

    component: () => import("layouts/MainLayout.vue"),

    children: [
      { path: "", component: () => import("pages/nearbystores/Index.vue"), name: 'nearby_stores' }
    ],
  },

  {
    path: "/checkout",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/checkout/Index.vue"), name: "checkout" }
    ],
  },

  {
    path: "/profile",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/profile/Index.vue"), name: "profile" }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/orders",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/orders/Index.vue"), name: "orders" }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/transactions",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/transactions/Index.vue"), name: "transactions" }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/smart-shop",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/smartshop/Index.vue"), name: "smart_shop" }
    ],
  },
  {
    path: "/smart-buy",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/smartbuy/Index.vue"), name: "smart_buy" }
    ],
  },
  {
    path: "/smart-offers",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/smartoffers/Index.vue"), name: "smart_offers" }
    ],
  },

  {
    path: "/faqs",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/faqs/Index.vue"), name: "faqs" }
    ],
  },


  {
    path: "/terms",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/terms/Index.vue"), name: "terms" }
    ],
  },

  {
    path: "/privacy",

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/privacy/Index.vue"), name: "privacy" }
    ],
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];



export default routes;
