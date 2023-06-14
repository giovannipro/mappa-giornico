function manage_url(){
    // console.log('ready')

    // const queryString = window.location;
    // let params = new URLSearchParams(queryString.search);
    // console.log(queryString)


    const buttons = document.querySelectorAll(".button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", myFunction)
    }

    function myFunction() {
        let id = this.id
        console.log(id)
        // params.append(id);
    }



}



// let url = new URL("https://example.com?foo=1&bar=2");
// let params = new URLSearchParams(url.search);

// //Add a second foo parameter.
// params.append("foo", 4);
// //Query string is now: 'foo=1&bar=2&foo=4'






window.addEventListener('load', function () {
    console.log('ready')
    manage_url()
})