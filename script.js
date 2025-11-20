
function getLocationInfo() {
    var modal = new bootstrap.Modal(document.getElementById('locationModal'));
    if(!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function(position) {
            modal.hide();
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude} °, Longitude: ${longitude} °`);  
        },
        function() {
            modal.show();
            console.log("Erro em recuperar sua localização");
        }
    );
}

getLocationInfo()