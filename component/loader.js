async function load(file, element) {
    try {
        const isDiv = element.tagName == "DIV"
        if (!isDiv) {
            const message = `Element must be "DIV" got "${element.tagName}" instead`
            throw new Error(message)
        }
        const respone = await fetch(file)
        if (!respone.ok) {
            const message = `File not found: ${file}`
            throw new Error(message)
        }
        const text = await respone.text()
        const virtualDOM = document.createElement("div")
        virtualDOM.innerHTML = text
        const scripts = virtualDOM.querySelectorAll("script")
        scripts.forEach((script) => {
            const element = document.createElement("script")
            const attributes = Array.from(script.attributes)
            attributes.forEach((attribute) => {
                element.setAttribute(attribute.name, attribute.value)
            })
            element.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(element, script)
        })
        element.replaceWith(virtualDOM)
        while(virtualDOM.firstChild) {
            virtualDOM.parentNode.insertBefore(virtualDOM.firstChild, virtualDOM)
        }
        virtualDOM.parentNode.removeChild(virtualDOM)
    } catch (error) {
        const message = error.message
        console.error(message)
    }
}

function loadAll() {
    const divs = document.querySelectorAll("div[load]")
    divs.forEach((div) => {
        file = div.getAttribute("load")
        load(file, div)
    })
}
