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

let amenityIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: ""
});

let currentLoc = '';
let myLoc = '';

const images = [
    'assets/imgs/museo-leventina_1.jpg', 
]

// const osm_api = 'https://api.openstreetmap.org/api/0.6/map?bbox=-0.111110,51.111110,0.111111,51.111111'

// const query_a = '[out:json];area[name="Giornico"]->.searchArea;(way["amenity"~"parking|toilets|public_transport"](area.searchArea););out center;>;out skel qt;'
// const query_b = '[out:json];(way(around:1400,46.4019, 8.8752););out center;' // [amenity]
// const overpass_api = 'https://overpass-api.de/api/interpreter?data=' + query_b

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

            for (let i = 0; i < data.length; i++) {
                data[i].id = parseInt(data[i].id);
            };
            // console.log(data)
            
            map_data = data
            make_map(data)
            updateState()
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
    })
        
    // load markers
    sidebar_content = '';
    let bounds = L.latLngBounds();
    count = 0;
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
        
        marker._id = short;

        // on click: open sidebar B
        marker.on('click', function () {
            update_sidebarB(short)
            reset_icon_color();
            this.setIcon(activeIcon);
            set_url_param(short)

            // update buttons
            buttons = document.querySelectorAll(".button");
            buttons.forEach(otherButton => {
                otherButton.classList.remove('selected');
            })
            the_button = document.getElementById(short)
            the_button.classList.add('selected')
        });

        // on mouse hover show pop up
        marker.on('mouseover', function () {
            this.bindPopup(name)
        })

        markers.push(marker);
        bounds.extend(marker.getLatLng());

        the_count = ''
        if (count == 0){
            the_count = 'count_' + count
        }
        count =+ 1;

        sidebar_content += '<button id="' + short +'" class="button ' + the_count + '" aria-controls="map-content" aria-label="' + name + '" aria-expanded="false" data-name="' + name + '" data-short="' + short + '" data-loc="' + short + '" tabindex="' + id + '">' + name + '</button>'
    });
    map.fitBounds(bounds);

    update_sidebarA(sidebar_content)
    activeButtons();
}

function activeButtons(){

    const buttons = document.querySelectorAll(".button");

    buttons.forEach((item, index) => {

        item.addEventListener('click', () => {
            
            // update background sidebar buttons
            const clickedButton = event.target;
            clickedButton.classList.toggle('selected');

            buttons.forEach(otherButton => {
                if (otherButton !== clickedButton) {
                    otherButton.classList.remove('selected');
                }
            });

            // console.log(clickedButton)
            // console.log(clickedButton.getAttribute('data-loc'))
            update_sidebarB(clickedButton.getAttribute('data-loc'))

            //update url
            let the_loc = (item.getAttribute('data-loc')).toString()
            let the_name = (item.getAttribute('data-name')).toString()
            set_url_param(the_loc,the_name)
        })
    })
}

function highlight_marker(id){
    reset_icon_color()

    markers.forEach(marker => {
        // console.log(marker._id,id)

        if (marker._id == id){
            marker.setIcon(activeIcon);
        }
    })   
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

function update_sidebarB(loc){
    let selectedData;

    if (loc == undefined || loc == '') {
        selectedData = map_data[0]
    }
    else {
        selectedData = getArrayByParameterValue(map_data,loc)
    }

    id = selectedData['id']
    name = selectedData['name'] 
    lat = selectedData['latitude']
    lon = selectedData['longitude']
    abstract = selectedData['abstract']
    period = selectedData['period']
    description = selectedData['description']
    curiosity = selectedData['curiosity']
    senses = selectedData['senses']
    pictures = selectedData['pictures']
    short = selectedData['short_name'];
    
    let content = ''

    // cover images
    if (pictures != ""){
        content += '<div id="cover" aria-label="Didascalia immagine">'
        content += '<div id="cover_image">'

        picture_array = pictures.split(',');
        for (let i = 0; i < picture_array.length; i++) {
            content += '<img alt="Foto ' + name+ ' " src="' + picture_array[0] +'"/>'
            // console.log(picture_array[i])
        }
        content += '</div>'
    }

    content += '<div id="location_header">'
    content += '<div aria-label="nome">' + '<h3 class="place_name">' + name + '</h3></div>'
    content += '<div aria-label="periodo"><p class="value">' +  period + '</p></div>'
    content += '<div aria-label="introduzione" class="intro"><p class="value">' + abstract + '</p></div>'
    content += '</div>'

    // content
    content += '<div id="content">'

    if (description != ""){
        content += '<div class="info"><p class="parameter">Descrizione</p>'
        content += '<p class="value">' + description + '</p></div>'
    }

    if (curiosity != ""){
        content += '<div class="info"><p class="parameter">Curiosità</p>'
        content += '<p class="value">' + curiosity + '</p></div>'
    }

    if (senses != ""){
        content += '<div class="info"><p class="parameter">Esperienza sensoriale</p>'
        content += '<p class="value">' + senses + '</p></div>'
    }

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

    // console.log(id)
    highlight_marker(short)
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
    let the_loc = urlParams.get('loc')

    if (the_loc !== null){
        currentState = STATE_B;
        myLoc = the_loc
    }
    else {
        currentState = STATE_A;
    }

    update_sidebarB(myLoc)
}

function set_url_param(name) {

    const newURL = new URL(window.location.href);

    let newParams = {
        loc: name
    };
      
    // update or add the parameters to the URL
    Object.keys(newParams).forEach(key => {
        newURL.searchParams.set(key, newParams[key]);
    });

    // replace the current URL without refreshing the page
    window.history.replaceState({}, '', newURL);
}