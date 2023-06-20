// map
const map_container = "map_container";
let min_zoom = 14;
let default_zoom = 16;
let max_zoom = 19;
let map_center = [46.4019, 8.8752];
let map_data;
let sidebar_content;

const markers = [];

const map = L.map(map_container, {
    center: map_center,
    zoom: default_zoom
});

// state machine
const STATE_A = 'stateA'; // open the general map
const STATE_B = 'stateB'; // open a specific location
const STATE_C = 'stateC'; // click on a button
let currentState;
let myId = 1; 

// Marker icons
let defaultIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: ""
});

let activeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: ""
});


let currentId = 0;

const images = [
    'assets/imgs/museo-leventina_1.jpg', 
]

// sidebar
const sidebarA_container = document.getElementById("sidebarA_content");
const sidebarB_container = document.getElementById("sidebarB_content");
const sidebarC_container = document.getElementById("sidebarC_content");

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
            updateState()

            // update_sidebarB()
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
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
        
    // load markers
    sidebar_content = '';
    data.forEach(item => {
        const name = item.name;
        const id = item.id;
        const lat = item.latitude;
        const lon = item.longitude;
        const short = item.short_name;

        const marker = L.marker([lat, lon],{
            alt: name,
            icon: defaultIcon,
            className: name
        })
        .bindPopup(name)
        .on('mouseover', function () {
            this.openPopup()
        })
        .on('mouseout', function () {
            this.closePopup()
        })
        .addTo(map)
        
        // on click: open sidebar B
        marker.on('click', function () {
            update_sidebarB(id)
            reset_icon_color();
            this.setIcon(activeIcon);
            set_url_param(id,name)
        })

        // on mouse hover show pop up
        marker.on('mouseover', function () {
            this.bindPopup(name)
        })

        markers.push(marker);

        sidebar_content += '<button class="button" aria-controls="map-content" aria-label="' + name + '" aria-expanded="false" data-name="' + name + '" data-short="' + short + '" data-id="' + id + '" tabindex="' + id + '">' + name + '</button>'
    });

    update_sidebarA(sidebar_content)
    activeButtons();
}

function activeButtons(){

    const buttons = document.querySelectorAll(".button");
    for (let i = 0; i < buttons.length; i++) {

        (function(i) {
            buttons[i].addEventListener("click", function(){
                update_sidebarB(this.getAttribute('data-id'))
            
                // update url
                let the_id = (buttons[i].getAttribute('data-id')).toString()
                let the_name = (buttons[i].getAttribute('data-name')).toString()
                set_url_param(the_id,the_name)
            })
        })(i);
    }
}

function highlight_marker(id){
    reset_icon_color()

    const the_marker = markers[id - 1]; 
    the_marker.setIcon(activeIcon);
}

function reset_icon_color(){
    markers.forEach(marker => {
        const markerElement = marker.getElement();
        marker.setIcon(defaultIcon)
    });
}

function update_sidebarA(content){
    sidebarA_container.innerHTML = content;
    update_sidebarC(content, 'A')
}

function update_sidebarB(id){

    the_id = parseInt(id)
    selectedData = map_data[the_id - 1]

    id = selectedData['id']
    name = selectedData['name'] 
    lat = selectedData['latitude']
    lon = selectedData['longitude']
    abstract = selectedData['abstract']
    period = selectedData['period']
    description = selectedData['description']
    curiosity = selectedData['curiosity']
    senses = selectedData['senses']
    
    let content = ''

    // cover
    content += '<div id="cover" aria-label="Didascalia immagine">'
    // content += '<div style="background-image: url(' + images[the_id] + '), url(' + images[the_id + 1] + ')">' + '</div>'
    content += '<div id="cover_image">'
    content += '<img alt="img_1" src="' + images[0] +'">' + '</img>'
    content += '<img alt="img_1" src="' + images[0] +'">' + '</img>'
    content += '<img alt="img_1" src="' + images[0] +'">' + '</img>'
    content += '</div>'

    content += '<div id="location_header">'
    content += '<div aria-label="nome">' + '<h3>' + name + '</h3></div>'
    content += '<div aria-label="periodo">' +  period + '</div></div>'
    content += '</div>'

    // content
    content += '<div id="content">'
    content += '<div class="info"><p>Storia</p>'
    content += '<p>' + abstract + '</p></div>'

    content += '<div class="info"><p>Descrizione</p>'
    content += '<p>' + description + '</p></div>'

    content += '<div class="info"><p>Curiosità</p>'
    content += '<p>' + curiosity + '</p></div>'

    content += '<div class="info"><p>Esperienza sensoriale</p>'
    content += '<p>' + senses + '</p></div>'

    content += '<div>'

    sidebarB_container.innerHTML = content;

    // set the view
    if (currentState == STATE_A){
        set_view(map_center[0], map_center[1], default_zoom - 2)
        currentState = STATE_B
    }
    else {
        update_sidebarC(content, 'B')
        set_view(lat,lon,default_zoom)
    }

    highlight_marker(id)
}

function update_sidebarC(content,sidebar){
    sidebarC_container.id = 'sidebar' + sidebar + '_content'

    let the_content = '';
    if (sidebar == 'B'){

        the_content += '<div id="close_sidebarB">x</div>'
        the_content += content
        sidebarC_container.innerHTML = the_content;

        closeSidebar()
    }
    else {
        the_content = content;
        sidebarC_container.innerHTML = the_content;
    }
    
    function closeSidebar() {

        let close = document.getElementById('close_sidebarB')

        close.addEventListener('click', function() {
            sidebarC_container.id = 'sidebarA_content'
            sidebarC_container.innerHTML = sidebar_content;
            activeButtons()
        })
    }
}


function set_view(lat,lon, zoom){
    map.setView([lat, lon], zoom+1);
}

function updateState(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let the_id = urlParams.get('id')

    if (the_id !== null){
        currentState = STATE_B;
        myId = the_id
    }
    else {
        currentState = STATE_A;
    }

    update_sidebarB(myId)
}

function set_url_param(id,name) {

    const newURL = new URL(window.location.href);

    let newParams = {
        id: id, 
        loc: name
    };
      
    // update or add the parameters to the URL
    Object.keys(newParams).forEach(key => {
        newURL.searchParams.set(key, newParams[key]);
    });

    // replace the current URL without refreshing the page
    window.history.replaceState({}, '', newURL);
}