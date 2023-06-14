function manage_url(){

    const urlParams = new URLSearchParams(window.location.search);
    // console.log(urlParams);

    const buttons = document.querySelectorAll(".button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", set_url_param)
    }

    function set_url_param() {
        let id = this.id
        console.log(id)

        urlParams.set('luogo', id);
        window.location.search = urlParams;
        set_background(id)
    }

}

function set_background(){
    let color;

    let search = new URLSearchParams(window.location.search);
    let id = search.get('luogo');

    if (id == 1) color = "red";
    else if (id == 2) color = "lightblue";
    else if (id == 3) color = "blue";
    else if (id == 4) color = "purple";
    else if (id == 5) color = "gray";
    else color = "yellow";

    const elem = document.getElementById("test");
    elem.style.backgroundColor = color;
    console.log(id,color)
}

window.addEventListener('load', function () {
    // console.log('ready')
    manage_url()
    set_background();
})