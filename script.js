const form = document.querySelector("form")
const appender = document.querySelector(".appender")
const errorMsg = document.querySelector(".error-msg")
let List = JSON.parse(localStorage.getItem("List")) || []

if (localStorage.getItem("List")) {
    List.map((link) => {
                // Display the links
                const linkDisplay = `
                <div class="links-display">
                <p class="original">${link.original}</p>
    
    
                <span class="shorts">
                <p class="short-link">${link.short}</p>
                <span class="copy btn">Copy</span>
                </span>
            </div>
            `
    
            // Add the generated link to the DOM
            appender.insertAdjacentHTML("beforebegin", linkDisplay)
    })
}

async function getUrl() {
    const input = document.querySelector(".input")
    const copyBtn = document.getElementsByClassName("copy")
    const shortLink = document.getElementsByClassName("short-link")

    // When input is empty do nothing
    if (input.value.length === 0){
        input.classList.add("error")
        errorMsg.style.cssText = "opacity: 1;"

        setTimeout(() => {
            input.classList.remove("error")
            errorMsg.style.cssText = "opacity: 0;"
        }, 1500);
        
    }else{
        const res = await fetch (`https://api.shrtco.de/v2/shorten?url=${input.value}`);
        const response = await res.json();
        const og = input.value
        // Empty input
        input.value = ""

        const link = {
            original: response.result.original_link,
            short: response.result.full_short_link2
        }
    
        List.push(link)
        localStorage.setItem("List", JSON.stringify(List))

        // Display the links
        const linkDisplay = `
            <div class="links-display">
            <p class="original">${link.original}</p>


            <span class="shorts">
            <p class="short-link">${link.short}</p>
            <span class="copy btn">Copy</span>
            </span>
        </div>
        `

        // Add the generated link to the DOM
        appender.insertAdjacentHTML("beforebegin", linkDisplay)

        // Copy text to clipboard and update copy button text
        for (let i = 0; i < copyBtn.length; i++) {
            copyBtn[i].addEventListener("click", () => {
            navigator.clipboard.writeText(shortLink[i].textContent)
            copyBtn[i].textContent = "Copied!"
            copyBtn[i].classList.add("copied")

            setTimeout(() => {
                copyBtn[i].textContent = "Copy"
                copyBtn[i].classList.remove("copied")
            }, 1500); 
        })
        } 
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    
    getUrl()
})

