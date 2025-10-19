maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: matches.geometry.coordinates,
    zoom: 10
});

new maptilersdk.Marker()
    .setLngLat(matches.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${matches.title}</h3><p>${matches.location}</p>`
            )
    )
    .addTo(map);