function manage_url(){

    const urlParams = new URLSearchParams(window.location.search);
    // console.log(urlParams);

    const buttons = document.querySelectorAll(".button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", set_url_param)
    }

    function set_url_param() {
        let id = this.id
        set_background(id)

        let newParams = {
            loc: id
        };

        const newURL = new URL(window.location.href);
          
        // Update or add the parameters to the URL
        Object.keys(newParams).forEach(key => {
            newURL.searchParams.set(key, newParams[key]);
        });

        // Replace the current URL without refreshing the page
        window.history.replaceState({}, '', newURL);
    }
}

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
    manage_url()
    set_background();

    map();
})