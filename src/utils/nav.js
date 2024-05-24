export default function nav() {
    const offcanvasElement = document.getElementById("offcanvasDarkNavbar");
    const backdropElement = document.querySelector(".offcanvas-backdrop");

    offcanvasElement.classList.remove("show");
    backdropElement.classList.remove("show");

    document.body.style.overflow = ""; 
    document.body.style.paddingRight = "";
}