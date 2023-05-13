export default ({ labelText, onInput, type = "text" }) => ({
    data: {
        value: ""
    },
    class: "labeled-input",
    children: [{
        tag: "label",
        text: labelText,
        condition: data => data.value
    }, {
        tag: "input",
        type,
        onInput(event) {
            this.data.value = event.target.value;
            this.update();
            onInput(event);
        },
        placeholder: labelText
    }]
});