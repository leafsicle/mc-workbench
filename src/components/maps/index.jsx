import React from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
// import Loading from "./loading"
import PropTypes from "prop-types"

const containerStyle = {
  width: "100%",
  height: "400px"
}

function MapComponent({ lat, lng, onLocationSelect, zoom }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["marker"]
  })

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  const center = { lat, lng }

  const handleMapClick = (event) => {
    if (onLocationSelect) {
      onLocationSelect(event.latLng.lat(), event.latLng.lng())
    }
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onClick={handleMapClick}
      mapId="DEMO_MAP_ID">
      <Marker position={center} />
    </GoogleMap>
  ) : (
    // <Loading />
    <div>Loading...</div>
  )
}

MapComponent.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  onLocationSelect: PropTypes.func
}

export default React.memo(MapComponent)
