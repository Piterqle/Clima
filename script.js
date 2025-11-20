
function getLocationInfo() {
    if(!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        return;
    }
    console.log("Locating...");
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude} °, Longitude: ${longitude} °`);  
        },
        function() {
            console.log("Erro em recuperar sua localização");
        }
    );
}

getLocationInfo()