import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


// ======================================================
// PROPS
// ======================================================

interface PharmacyLocationPickerProps {
    latitude: number | string | null;
    longitude: number | string | null;

    onLocationChange: (
        latitude: number,
        longitude: number
    ) => void;
}


// ======================================================
// DEFAULT MARKER ICON
// ======================================================

const pharmacyIcon = new L.Icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],

    popupAnchor: [1, -34],

    shadowSize: [41, 41],
});


// ======================================================
// DEFAULT DHAKA LOCATION
// ======================================================

const DEFAULT_LOCATION: [number, number] = [
    23.8103,
    90.4125,
];


// ======================================================
// MAP CLICK HANDLER
// ======================================================

interface MapClickHandlerProps {
    onLocationChange: (
        latitude: number,
        longitude: number
    ) => void;
}

function MapClickHandler({
    onLocationChange,
}: MapClickHandlerProps) {

    useMapEvents({

        click(event) {

            const latitude = event.latlng.lat;

            const longitude = event.latlng.lng;

            console.log(
                "Selected pharmacy location:",
                latitude,
                longitude
            );

            onLocationChange(
                latitude,
                longitude
            );
        },

    });

    return null;
}


// ======================================================
// MAP RESIZE FIX
// ======================================================

function MapResizeHandler() {

    const map = useMap();

    useEffect(() => {

        const timer = setTimeout(() => {

            map.invalidateSize();

        }, 200);

        return () => clearTimeout(timer);

    }, [map]);

    return null;
}


// ======================================================
// MAP CENTER CONTROL
// ======================================================

interface MapCenterProps {
    latitude: number;
    longitude: number;
}

function MapCenter({
    latitude,
    longitude,
}: MapCenterProps) {

    const map = useMap();

    useEffect(() => {

        if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
        ) {

            map.setView(
                [latitude, longitude],
                Math.max(map.getZoom(), 16)
            );

        }

    }, [
        latitude,
        longitude,
        map,
    ]);

    return null;
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function PharmacyLocationPicker({
    latitude,
    longitude,
    onLocationChange,
}: PharmacyLocationPickerProps) {

    const [locationLoading, setLocationLoading] =
        useState(false);


    // ==================================================
    // CHECK SAVED LOCATION
    // ==================================================

    const hasSavedLocation =
        latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined &&
        Number.isFinite(Number(latitude)) &&
        Number.isFinite(Number(longitude));


    // ==================================================
    // CURRENT LOCATION
    // ==================================================

    const selectedLatitude = hasSavedLocation
        ? Number(latitude)
        : DEFAULT_LOCATION[0];


    const selectedLongitude = hasSavedLocation
        ? Number(longitude)
        : DEFAULT_LOCATION[1];


    // ==================================================
    // USE MY LOCATION
    // ==================================================

    const useCurrentLocation = () => {

        if (!navigator.geolocation) {

            alert(
                "Your browser does not support location services."
            );

            return;
        }


        setLocationLoading(true);


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const newLatitude =
                    position.coords.latitude;

                const newLongitude =
                    position.coords.longitude;


                console.log(
                    "Current pharmacy location:",
                    newLatitude,
                    newLongitude
                );


                // Save location to parent

                onLocationChange(
                    newLatitude,
                    newLongitude
                );


                setLocationLoading(false);

            },

            (error) => {

                console.error(
                    "Location error:",
                    error
                );


                let message =
                    "Unable to get your current location.";


                if (error.code === 1) {

                    message =
                        "Location permission was denied. Please allow location access in your browser.";

                } else if (error.code === 2) {

                    message =
                        "Your location could not be determined.";

                } else if (error.code === 3) {

                    message =
                        "Location request timed out. Please try again.";

                }


                alert(message);


                setLocationLoading(false);

            },

            {
                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0,
            }
        );
    };


    // ==================================================
    // LOCATION ARRAY
    // ==================================================

    const mapCenter: [number, number] = [
        selectedLatitude,
        selectedLongitude,
    ];


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="space-y-3">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex items-center justify-between">

                <div>

                    <label
                        className="
                            text-xs
                            font-semibold
                            text-slate-400
                            uppercase
                            tracking-wide
                        "
                    >
                        Store Location
                    </label>


                    <p
                        className="
                            text-xs
                            text-slate-400
                            mt-1
                        "
                    >
                        Click anywhere on the map to select
                        your pharmacy location.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locationLoading}
                    className="
                        px-4
                        py-2
                        rounded-xl
                        bg-green-600
                        text-white
                        text-xs
                        font-semibold
                        hover:bg-green-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition
                    "
                >

                    {locationLoading
                        ? "Getting Location..."
                        : "📍 Use My Location"}

                </button>

            </div>


            {/* ==========================================
                MAP
            ========================================== */}

            <div
                className="
                    relative
                    w-full
                    h-[350px]
                    rounded-2xl
                    overflow-hidden
                    border
                    border-slate-200
                "
            >

                <MapContainer
                    center={mapCenter}
                    zoom={hasSavedLocation ? 16 : 12}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                >

                    {/* OpenStreetMap */}

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    {/* Fix map size */}

                    <MapResizeHandler />


                    {/* Update center */}

                    <MapCenter
                        latitude={selectedLatitude}
                        longitude={selectedLongitude}
                    />


                    {/* Click map */}

                    <MapClickHandler
                        onLocationChange={
                            onLocationChange
                        }
                    />


                    {/* Selected pharmacy marker */}

                    {hasSavedLocation && (

                        <Marker
                            position={[
                                selectedLatitude,
                                selectedLongitude,
                            ]}
                            icon={pharmacyIcon}
                        />

                    )}

                </MapContainer>

            </div>


            {/* ==========================================
                COORDINATES
            ========================================== */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                "
            >

                {/* Latitude */}

                <div
                    className="
                        bg-slate-50
                        rounded-xl
                        p-3
                    "
                >

                    <p
                        className="
                            text-[10px]
                            uppercase
                            font-semibold
                            text-slate-400
                        "
                    >
                        Latitude
                    </p>


                    <p
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                            mt-1
                        "
                    >

                        {hasSavedLocation
                            ? selectedLatitude.toFixed(8)
                            : "Not selected"}

                    </p>

                </div>


                {/* Longitude */}

                <div
                    className="
                        bg-slate-50
                        rounded-xl
                        p-3
                    "
                >

                    <p
                        className="
                            text-[10px]
                            uppercase
                            font-semibold
                            text-slate-400
                        "
                    >
                        Longitude
                    </p>


                    <p
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                            mt-1
                        "
                    >

                        {hasSavedLocation
                            ? selectedLongitude.toFixed(8)
                            : "Not selected"}

                    </p>

                </div>

            </div>


            {/* ==========================================
                INSTRUCTION
            ========================================== */}

            <div
                className="
                    bg-blue-50
                    border
                    border-blue-100
                    rounded-xl
                    p-3
                "
            >

                <p
                    className="
                        text-xs
                        text-blue-700
                    "
                >

                    💡 <strong>Tip:</strong> The pharmacist can
                    open this page inside their pharmacy and
                    click <strong>Use My Location</strong>.
                    MediFind BD will save the exact GPS
                    coordinates of the store.

                </p>

            </div>

        </div>
    );
}