import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/books",
      name: "books",
      component: () => import("../views/BooksView.vue"),
    },
    {
      path: "/categories",
      name: "categories",
      component: () => import("../views/CategoriesView.vue"),
    },
    {
      path: "/authors",
      name: "authors",
      component: () => import("../views/AuthorsView.vue"),
    },
  ],
});

export default router;
