import LabeledInput from "../partial/LabeledInput.js";
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
    }, LabeledInput({
        labelText: "Username",
        onInput() {
            console.log("Value changed");
        }
    }), LabeledInput({
        labelText: "Password",
        type: "password",
        onInput() {
            console.log("Value changed");
        }
    })]
};