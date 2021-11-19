import App from './app'
import Theme from "./ui/theme"
//import App from "./sandbox/wizard"

async function start() {
    Theme.apply(Theme.defaultDarkTheme)
    await App.start()
    removeSplash()
}

void start()

function removeSplash() {
    const splash = document.getElementById("splash-screen")
    if (splash) {
        splash.classList.add("vanish")
        window.setTimeout(() => document.body.removeChild(splash), 600)
    }
}
