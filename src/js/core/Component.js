export function render(plainNode) {
    if (typeof plainNode.update !== "function") {
        plainNode.update = () => render(plainNode);
    }
    let isUpdate = plainNode.element instanceof HTMLElement;
    if (!isUpdate) {
        plainNode.element = document.createElement(plainNode.tag ?? "div");
    }
    for (const key in plainNode) {
        if (["tag", "element", "data", "update", "slot"].includes(key)) continue;
        if (typeof _renderHandler[key.toLowerCase()] === "function") {
            if (_renderHandler[key.toLowerCase()](plainNode, key)) continue;
            else return;
        }
        if (key.startsWith("on")) {
            if (isUpdate) continue;
            plainNode.element.addEventListener(key.substring(2).toLowerCase(), plainNode[key].bind(plainNode));
            continue;
        }
        plainNode.element.setAttribute(key, _parseString(plainNode[key], plainNode.data));
    }
    return plainNode.element;
}

const _renderHandler = {

    value(plainNode) {
        plainNode.element.value = _parseString(plainNode.value, plainNode.data);
        return true;
    },

    oncreate(plainNode, key) {
        plainNode[key].call(plainNode, plainNode.element);
        return true;
    },

    condition(plainNode) {
        return plainNode.condition(plainNode.data);
    },

    text(plainNode) {
        plainNode.element.innerHTML = _parseString(plainNode.text, plainNode.data);
        return true;
    },

    children(plainNode) {
        for (let i = 0; i < plainNode.children.length; i++) {
            const childPlainNode = plainNode.children[i];
            if (typeof childPlainNode.data === "undefined") {
                childPlainNode.data = plainNode.data;
            }
            if (typeof childPlainNode.update === "undefined") {
                childPlainNode.update = plainNode.update;
            }
            const isFocusedInput = childPlainNode.tag === "input" && childPlainNode.element && childPlainNode.element === document.activeElement;
            const childElement = render(childPlainNode);
            if (!childElement) {
                if (childPlainNode.element && childPlainNode.element.parentNode) {
                    childPlainNode.element.parentNode.removeChild(childPlainNode.element);
                }
                continue;
            }
            if (plainNode.element.children[i] === childElement) {
                continue;
            }
            plainNode.element.insertBefore(childElement, plainNode.element.children[i + 1]);
            if (isFocusedInput) {
                setTimeout(() => {
                    childPlainNode.element.focus();
                });
            }
        }

        // Remove nodes from DOM that aren't in the PlainNode anymore.
        for (let i = 0; i < plainNode.element.children.length; i++) {
            const childElement = plainNode.element.children[i];
            if (!plainNode.children.find(childPlainNode => childPlainNode.element === childElement)) {
                childElement.parentNode.removeChild(childElement);
            }
        }
        return true;
    },

    loop(plainNode) {
        const arrayKey = plainNode.loop[0];
        const array = plainNode.data[arrayKey];
        array.forEach((itemData, index) => {
            if (itemData.node) {
                itemData.node.data.index = index;
                return render(itemData.node);
            }
            itemData.node = {
                ...plainNode.loop[1]
            };
            itemData.node.data = itemData;
            itemData.node.data.index = index;
            itemData.node.parentData = plainNode.data;
            itemData.node.update = plainNode.update;
            plainNode.element.appendChild(render(itemData.node));
        });
        for (let i = 0; i < plainNode.element.children.length; i++) {
            const childElement = plainNode.element.children[i];
            if (!array.find(itemData => itemData.node.element === childElement)) {
                childElement.parentNode.removeChild(childElement);
            }
        }
        return true;
    }
};

function _parseString(string = "", data = {}) {
    return (string + "").replace(/{{[^}]+}}/g, match => {
        const key = match.substring(2, match.length - 2).trim();
        if (key.includes(".")) {
            let subData = data;
            for (const subKey of key.split(".")) {
                subData = subData[subKey];
            }
            return subData;
        }
        return data[key] ?? "";
    });
}