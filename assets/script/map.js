// map
const map_container = "map_container";
let min_zoom = 15;
let default_zoom = 16;
let max_zoom = 19;
let map_center = [46.4019, 8.8752];

// sidebar
const sidebarA_container = document.getElementById("sidebarA");

function load_data(){
    let data_link = "assets/php/get_data.php";

    fetch(data_link)
        .then(response => response.json())
        .then((data) => {
            map(data)
            console.log(data)
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
}

function map(data){

    const map = L.map(map_container, {
        center: map_center,
        zoom: default_zoom
    });

    data.forEach(item => {
        const name = item.name;
        const lat = item.lat;
        const lng = item.lon;

        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(name);
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: min_zoom,
        maxZoom: max_zoom,
        tileSize: 256
    }).addTo(map);

    sidebarA_container.innerHTML = 'This is the sidebar content.';



    // const sidebar = L.control.sidebar('sidebar').addTo(map);
    // sidebar.setContent('This is the sidebar content.');

    // create the sidebar
    // const sidebarA = L.control.sidebar("sidebarA", {
    //     closeButton: true,
    //     position: "left"
    // });
    // map.addControl(sidebarA);

    
    // sidebarA.innerHTML = "<h2>Sidebar Content</h2><p>This is the sidebar content.</p>";

}