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
    }

}


window.addEventListener('load', function () {
    // console.log('ready')
    manage_url()
})