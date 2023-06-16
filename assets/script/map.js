const map_container = "map_container";
let min_zoom = 15;
let default_zoom = 16;
let max_zoom = 19;
let map_center = [46.4019, 8.8752];

function map(){
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

    // create the sidebar
    // const sidebarA = L.control.sidebar("sidebarA", {
    //     closeButton: true,
    //     position: "left"
    // });
    // map.addControl(sidebarA);
}