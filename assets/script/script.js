function set_background(){
    let color;

    let search = new URLSearchParams(window.location.search);
    let id = search.get('loc');

    if (id == 1) color = "red";
    else if (id == 2) color = "lightblue";
    else if (id == 3) color = "blue";
    else if (id == 4) color = "purple";
    else if (id == 5) color = "gray";
    else color = "yellow";

    const elem = document.getElementById("test");
    elem.style.backgroundColor = color;
}

window.addEventListener('load', function () {
    load_data();
})