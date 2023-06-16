// map
const map_container = "map_container";
let min_zoom = 14;
let default_zoom = 16;
let max_zoom = 19;
let map_center = [46.4019, 8.8752];
let map_data;

const map = L.map(map_container, {
    center: map_center,
    zoom: default_zoom
});

let currentId = 0;

// sidebar
const sidebarA_container = document.getElementById("sidebarA_content");
const sidebarB_container = document.getElementById("sidebarB_content");

function load_data(){
    let data_link = "assets/php/get_data.php";

    fetch(data_link)
        .then(response => response.json())
        .then((data) => {
            
            // sort
            data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

            // update index
            newId = 0
            for (let key in data) {
                newId += 1
                data[key].id = newId
            }
            
            map_data = data
            make_map(data)
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });

    get_url_param();
}

function make_map(data){

    // map info
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: min_zoom,
        maxZoom: max_zoom,
        tileSize: 256
    }).addTo(map);

    // sort data

    // load marker
    data.forEach(item => {
        const name = item.name;
        const id = item.id;
        const lat = item.lat;
        const lon = item.lon;
        let shortA = item.short_name;
        shortB = shortA.toLowerCase();
        shortC = shortB.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'');
        short = shortC.replaceAll(' ', '_')

        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(name);

        sContent = '<li class="button" data-name="' + name + '" data-short="' + short + '" data-id="' + id + '">' + name + '</li>'
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
    // console.log(currentId)

    // if (currentId != 0){
    // }
    // else {
    //     const queryString = window.location.search;
    //     const urlParams = new URLSearchParams(queryString);
    //     id = urlParams.get('id')
    // }

    myid = this.getAttribute('data-id')
    selectedData = map_data[myid - 1]
    // console.log(myid,selectedData)

    id = selectedData['id']
    name = selectedData['name'] 
    lat = selectedData['lat']
    lon = selectedData['lon']

    let content = ''
    content += '<li>' + id + '</li>'
    content += '<li>' + name + '</li>'
    content += '<li>' + lat + '</li>'
    content += '<li>' + lon + '</li>'
    sidebarB_container.innerHTML = content;

    set_view(lat,lon)
}

function set_view(lat,lon){
    map.setView([lat, lon], default_zoom+1);
}

function get_url_param(lat,lon){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const location = urlParams.get('l')

    // update_sidebarB()

    // // console.log(queryString)
    // // console.log(urlParams)
    // console.log(location)
}

function set_url_param() {
    let id = this.getAttribute('data-id')
    let name = this.getAttribute('data-short')
    const newURL = new URL(window.location.href);

    // set location
    let newParams = {
        // id: id, 
        lo: name
    };
      
    // Update or add the parameters to the URL
    Object.keys(newParams).forEach(key => {
        newURL.searchParams.set(key, newParams[key]);
    });

    // Replace the current URL without refreshing the page
    window.history.replaceState({}, '', newURL);
}