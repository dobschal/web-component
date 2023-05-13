import Navigo from "navigo";
import { render } from "./core/Component.js";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import DefaultLayout from "./layouts/DefaultLayout.js";

export const routes = {
    "/login": [DefaultLayout, LoginPage],
    "/": [DefaultLayout, HomePage]
};

export const router = new Navigo("/");
export let activeLayout;

for (const path in routes) {
    router.on(path, () => _showPage(routes[path][0], routes[path][1]));
}

function _showPage(layout, page) {
    if (activeLayout !== layout) {
        activeLayout = layout;
        _renderInto("body", layout);
    }
    _renderInto("#page", page);
}

function _renderInto(query, plainNode) {
    const parentElement = document.querySelector(query);
    parentElement.innerHTML = "";
    parentElement.append(render(plainNode));
}