import Navigo from "navigo";
import { render } from "./core/Component.js";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import DefaultLayout from "./layouts/DefaultLayout.js";

export const router = new Navigo("/");
let activeLayout = undefined;

router
    .on("/login", () => showPage(DefaultLayout, LoginPage))
    .on("/", () => showPage(DefaultLayout, HomePage));

function showPage(layout, page) {
    if (activeLayout !== layout) {
        activeLayout = layout;
        renderInto("body", layout);
    }
    renderInto("#page", page);
}

function renderInto(query, plainNode) {
    const parentElement = document.querySelector(query);
    if (!parentElement) console.log("Cannot find: ", query);
    parentElement.innerHTML = "";
    parentElement.append(render(plainNode));
}