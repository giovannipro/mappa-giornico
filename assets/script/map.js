// map
const map_container = "map_container";
let min_zoom = 15;
let default_zoom = 16;
let max_zoom = 19;
let map_center = [46.4019, 8.8752];
let map_data;

// sidebar
const sidebarA_container = document.getElementById("sidebarA_content");
const sidebarB_container = document.getElementById("sidebarB_content");

function load_data(){
    let data_link = "assets/php/get_data.php";

    fetch(data_link)
        .then(response => response.json())
        .then((data) => {
            map_data = data
            map(data)
            console.log(data)
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
}

function map(data){

    // map
    const map = L.map(map_container, {
        center: map_center,
        zoom: default_zoom
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: min_zoom,
        maxZoom: max_zoom,
        tileSize: 256
    }).addTo(map);

    // load marker
    data.forEach(item => {
        const name = item.name;
        const id = item.id;
        const lat = item.lat;
        const lng = item.lon;

        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(name);

        sContent = '<li class="button" data-id="' + id +'">' + name + '</li>'
        sidebarA_container.innerHTML += sContent;
    });

    // add buttons
    const buttons = document.querySelectorAll(".button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", update_sidebarB)
        buttons[i].addEventListener("click", set_url_param)
    }
}

function update_sidebarB(){
    id = this.getAttribute('data-id')
    selectedData = map_data[id - 1]

    let content = ''
    Object.keys(selectedData).forEach(key => {
        // console.log(key + ": " + selectedData[key]);

        content += '<li>'
        content += selectedData[key];
        content += '</li>'
    });

    sidebarB_container.innerHTML = content;
}

function set_url_param() {
    let id = this.getAttribute('data-id')
    const newURL = new URL(window.location.href);

    // set location
    let newParams = {
        l: id 
    };
      
    // Update or add the parameters to the URL
    Object.keys(newParams).forEach(key => {
        newURL.searchParams.set(key, newParams[key]);
    });

    // Replace the current URL without refreshing the page
    window.history.replaceState({}, '', newURL);
}