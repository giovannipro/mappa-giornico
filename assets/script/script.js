function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude to radians
    const latRad1 = degToRad(lat1);
    const lonRad1 = degToRad(lon1);
    const latRad2 = degToRad(lat2);
    const lonRad2 = degToRad(lon2);

    // Calculate the differences between the coordinates
    const latDiff = latRad2 - latRad1;
    const lonDiff = lonRad2 - lonRad1;

    // Apply the Haversine formula
    const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = earthRadius * c;

    const distanceM = distanceKm * 1000

    return distanceM;
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

window.addEventListener('load', function () {
    load_data();
})