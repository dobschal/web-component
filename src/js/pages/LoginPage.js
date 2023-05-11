import { router } from "../router.js";

export default {
    class: "page",
    children: [{
        tag: "h1",
        text: "Login"
    }, {
        tag: "button",
        type: "button",
        text: "To Home",
        onClick() {
            router.navigate("/");
        }
    }]
};