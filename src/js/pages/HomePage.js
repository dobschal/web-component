import { router } from "../router.js";

const data = {
    name: "Klaus",
    count: 0,
    newName: "",
    address: {
        street: "Herderstraße"
    },
    items: [{
        name: "Klaus"
    }, {
        name: "Ronny"
    }, {
        name: "Claudia"
    }]
};

export default {
    data,
    class: "page",
    children: [{
        tag: "h1",
        text: "You are beautiful {{ name }}!"
    }, {
        tag: "button",
        type: "button",
        text: "To Login",
        onClick() {
            router.navigate("/login");
        }
    },
    {
        tag: "p",
        text: "{{ name }} wohnt hier: <i>{{ address.street }}!</i>"
    }, {
        tag: "input",
        type: "text",
        placeholder: "name",
        value: "{{ name }}",
        autofocus: true,
        onInput(event) {
            this.data.name = event.target.value;
            this.update();
        }
    }, {
        tag: "p",
        text: "Yeah, <b>that</b> is nice!"
    }, {
        tag: "button",
        type: "button",
        text: "Count up",
        onClick() {
            this.data.count++;
            this.update();
        }
    }, {
        tag: "span",
        text: "The result is: {{ count }}"
    }, {
        tag: "form",
        onSubmit(event) {
            event.preventDefault();
            if (!this.data.newName) return;
            this.data.items.push({
                name: this.data.newName
            });
            this.data.newName = "";
            this.update();
        },
        children: [{
            tag: "input",
            type: "text",
            placeholder: "New Name",
            value: "{{ newName }}",
            autofocus: true,
            onInput(event) {
                this.data.newName = event.target.value;
                this.update();
            }
        }, {
            tag: "button",
            type: "submit",
            text: "Add Name",
            condition: data => data.newName.length > 0
        }]
    }, {
        tag: "ul",
        loop: ["items", {
            tag: "li",
            text: "{{name}}",
            onClick() {
                console.log("Yeah!", this.data);
                this.parentData.items.splice(this.data.index, 1);
                this.update();
            }
        }]
    }]
};