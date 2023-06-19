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

const images = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/95/Hubble_captures_crisp_new_image_of_Jupiter_and_Europa_%2850354436493%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg"
]

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
        .then((data) => {
            get_url_param();
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

    // fix data
    data.forEach(item => {
        item.latitude = parseFloat(item.latitude);
        item.longitude = parseFloat(item.longitude); 

        let shortA = item.short_name;
        let shortB = shortA.toLowerCase();
        let shortC = shortB.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'');
        let shortD = shortC.replaceAll(' ', '_')

        item.short_name = shortD
    })
    console.log(data)
        
    // load marker
    data.forEach(item => {
        const name = item.name;
        const id = item.id;
        const lat = item.latitude;
        const lon = item.longitude;
        const short = item.short_name;

        const marker = L.marker([lat, lon],
            {alt: name}
        )
        .addTo(map)
        .bindPopup(name);

        sContent = '<button class="button" aria-controls="map-content" aria-label="' + name + '" aria-expanded="false" data-name="' + name + '" data-short="' + short + '" data-id="' + id + '" tabindex="' + id + '">' + name + '</button>'
        sidebarA_container.innerHTML += sContent;
    });

    // add buttons
    const buttons = document.querySelectorAll(".button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", update_sidebarB)
        buttons[i].addEventListener("click", set_url_param)
    }
}

function update_sidebarB(the_id){

    myid = 1;
    if (the_id > 0){
        myid = the_id
    }
    else {
        myid = this.getAttribute('data-id')
    }

    selectedData = map_data[myid - 1]

    id = selectedData['id']
    name = selectedData['name'] 
    lat = selectedData['latitude']
    lon = selectedData['longitude']
    abstract = selectedData['abstract']
    description = selectedData['description']
    curiosity = selectedData['curiosity']
    senses = selectedData['senses']
    
    let content = ''
    content += '<li aria-label="Didascalia immagine">' + '<div id="cover" style="background-image: url(' + images[myid] + ')">' + '</div>'
    content += '<li aria-label="Id">' + id + '</li>'
    content += '<li aria-label="Nome">' + '<h3>' + name + '</h3></li>'
    content += '<li aria-label="Latitudine">' + lat + '</li>'
    content += '<li aria-label="Longitudine">' + lon + '</li>'
    content += '<br/>'

    content += '<li aria-label="Descrizione">' + abstract + '</li>'
    content += '<br/>'
    content += '<li aria-label="Longitudine">' + description + '</li>'
    content += '<li aria-label="Longitudine">' + curiosity + '</li>'
    content += '<li aria-label="Longitudine">' + senses + '</li>'
    sidebarB_container.innerHTML = content;

    set_view(lat,lon)
}

function set_view(lat,lon){
    map.setView([lat, lon], default_zoom+1);
}

function get_url_param(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let the_id = urlParams.get('id')

    if (the_id !== null){
        update_sidebarB(the_id)
    }
}

function set_url_param() {
    let id = this.getAttribute('data-id')
    let name = this.getAttribute('data-short')
    const newURL = new URL(window.location.href);

    // set location
    let newParams = {
        id: id, 
        lo: name
    };
      
    // Update or add the parameters to the URL
    Object.keys(newParams).forEach(key => {
        newURL.searchParams.set(key, newParams[key]);
    });

    // Replace the current URL without refreshing the page
    window.history.replaceState({}, '', newURL);
}