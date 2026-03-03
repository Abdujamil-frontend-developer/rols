import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Admin from "@/pages/admin";
import Products from "@/pages/products";
import Page1 from "@/pages/tabs/page1";
import Page2 from "@/pages/tabs/page2";
import { routes } from "@/constants/routes";
import { Permissions } from "@/constants/permissions";



export const publicRoutes = [
    {
        path: routes.AUTH,
        element: Auth,
    },
];

export const privateRoutes = [
    {
        path: routes.HOME,
        element: Home,
    },
    {
        path: routes.ADMIN,
        element: Admin, 
        access: [Permissions.READ_USER, Permissions.WRITE_USER, Permissions.EDIT_USER],
    },
    {
        path: routes.PRODUCTS,
        element: Products,
    },
    {
        path: routes.PAGE1,
        element: Page1,
    },
    {
        path: routes.PAGE2,
        element: Page2,
    },
];
