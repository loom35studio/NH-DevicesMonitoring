function openPopup(id) {
    let popup = document.getElementById(id);
    popup.classList.add("opened");
}

function closePopup(id) {
    let popup = document.getElementById(id);
    popup.classList.remove("opened");
}

function reloadPopup(id) {
    closePopup(id); 
    location.reload(true);
}