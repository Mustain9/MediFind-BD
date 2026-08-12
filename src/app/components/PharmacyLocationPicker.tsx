
import { useEffect, useRef, useState } from "react";
import {
    setOptions,
    importLibrary,
} from "@googlemaps/js-api-loader";

interface PharmacyLocationPickerProps {
    latitude: number | string | null;
    longitude: number | string | null;
    onLocationChange: (
        latitude: number,
        longitude: number
    ) => void;
}

export default function PharmacyLocationPicker({
    latitude,
    longitude,
    onLocationChange,
}: PharmacyLocationPickerProps) {

    const mapRef =
        useRef<HTMLDivElement | null>(null);

    const mapInstance =
        useRef<google.maps.Map | null>(null);

    const markerInstance =
        useRef<google.maps.marker.AdvancedMarkerElement | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [locationLoading, setLocationLoading] =
        useState(false);

    useEffect(() => {

        let cancelled = false;

        const initializeMap = async () => {

            try {

                const apiKey =
                    import.meta.env
                        .VITE_GOOGLE_MAPS_API_KEY;

                if (!apiKey) {

                    console.error(
                        "Google Maps API key is missing."
                    );

                    setLoading(false);

                    return;
                }

                setOptions({
                    key: apiKey,
                    v: "weekly",
                });

                const [
                    { Map },
                    { AdvancedMarkerElement },
                ] = await Promise.all([
                    importLibrary("maps"),
                    importLibrary("marker"),
                ]);

                if (
                    !mapRef.current ||
                    cancelled
                ) {
                    return;
                }

                // ==========================================
                // INITIAL LOCATION
                // ==========================================

                const hasSavedLocation =
                    latitude !== null &&
                    longitude !== null &&
                    latitude !== undefined &&
                    longitude !== undefined &&
                    !Number.isNaN(
                        Number(latitude)
                    ) &&
                    !Number.isNaN(
                        Number(longitude)
                    );

                const initialLocation = hasSavedLocation
                    ? {
                        lat: Number(latitude),
                        lng: Number(longitude),
                    }
                    : {
                        lat: 23.8103,
                        lng: 90.4125,
                    };

                // ==========================================
                // CREATE MAP
                // ==========================================

                const map = new Map(
                    mapRef.current,
                    {
                        center: initialLocation,
                        zoom: hasSavedLocation
                            ? 16
                            : 12,

                        mapId: "DEMO_MAP_ID",

                        fullscreenControl: true,

                        streetViewControl: false,

                        mapTypeControl: false,
                    }
                );

                mapInstance.current = map;

                // ==========================================
                // CREATE MARKER IF LOCATION EXISTS
                // ==========================================

                if (hasSavedLocation) {

                    markerInstance.current =
                        new AdvancedMarkerElement({
                            map,
                            position: initialLocation,
                            title:
                                "Pharmacy Location",
                        });

                }

                // ==========================================
                // CLICK MAP TO SELECT LOCATION
                // ==========================================

                map.addListener(
                    "click",
                    (event: google.maps.MapMouseEvent) => {

                        if (!event.latLng) {
                            return;
                        }

                        const newLatitude =
                            event.latLng.lat();

                        const newLongitude =
                            event.latLng.lng();

                        // Remove previous marker

                        if (
                            markerInstance.current
                        ) {

                            markerInstance.current.map =
                                null;

                        }

                        // Create new marker

                        markerInstance.current =
                            new AdvancedMarkerElement({
                                map,

                                position: {
                                    lat: newLatitude,
                                    lng: newLongitude,
                                },

                                title:
                                    "Selected Pharmacy Location",
                            });

                        // Send location to parent

                        onLocationChange(
                            newLatitude,
                            newLongitude
                        );

                    }
                );

                setLoading(false);

            } catch (error) {

                console.error(
                    "Failed to initialize location picker:",
                    error
                );

                setLoading(false);

            }

        };

        initializeMap();

        return () => {

            cancelled = true;

        };

    }, []);

    // ==========================================
    // USE CURRENT LOCATION
    // ==========================================

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

                const newLocation = {
                    lat: newLatitude,
                    lng: newLongitude,
                };

                // Move map

                if (mapInstance.current) {

                    mapInstance.current.setCenter(
                        newLocation
                    );

                    mapInstance.current.setZoom(
                        17
                    );

                }

                // Remove old marker

                if (
                    markerInstance.current
                ) {

                    markerInstance.current.map =
                        null;

                }

                // Create marker

                importLibrary("marker").then(
                    ({ AdvancedMarkerElement }) => {

                        if (
                            !mapInstance.current
                        ) {
                            return;
                        }

                        markerInstance.current =
                            new AdvancedMarkerElement({
                                map:
                                    mapInstance.current,

                                position:
                                    newLocation,

                                title:
                                    "Pharmacy Store Location",
                            });

                    }
                );

                // Send location

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

                alert(
                    "Unable to get your current location. Please allow location access."
                );

                setLocationLoading(false);

            },

            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0,
            }

        );

    };

    return (

        <div className="space-y-3">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex items-center justify-between">

                <div>

                    <label className="
                        text-xs
                        font-semibold
                        text-slate-400
                        uppercase
                        tracking-wide
                    ">
                        Store Location
                    </label>

                    <p className="
                        text-xs
                        text-slate-400
                        mt-1
                    ">
                        Click on the map to select your
                        pharmacy location.
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

            <div className="
                relative
                w-full
                h-[350px]
                rounded-2xl
                overflow-hidden
                border
                border-slate-200
            ">

                <div
                    ref={mapRef}
                    className="w-full h-full"
                />

                {loading && (

                    <div className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        bg-white/80
                    ">

                        <div className="text-center">

                            <div className="
                                animate-spin
                                w-8
                                h-8
                                border-4
                                border-blue-500
                                border-t-transparent
                                rounded-full
                                mx-auto
                                mb-3
                            " />

                            <p className="
                                text-sm
                                text-slate-500
                            ">
                                Loading map...
                            </p>

                        </div>

                    </div>

                )}

            </div>

            {/* ==========================================
                COORDINATES
            ========================================== */}

            <div className="
                grid
                grid-cols-2
                gap-3
            ">

                <div className="
                    bg-slate-50
                    rounded-xl
                    p-3
                ">

                    <p className="
                        text-[10px]
                        uppercase
                        font-semibold
                        text-slate-400
                    ">
                        Latitude
                    </p>

                    <p className="
                        text-sm
                        font-semibold
                        text-slate-700
                        mt-1
                    ">
                        {latitude !== null &&
                        latitude !== undefined
                            ? Number(latitude).toFixed(6)
                            : "Not selected"}
                    </p>

                </div>

                <div className="
                    bg-slate-50
                    rounded-xl
                    p-3
                ">

                    <p className="
                        text-[10px]
                        uppercase
                        font-semibold
                        text-slate-400
                    ">
                        Longitude
                    </p>

                    <p className="
                        text-sm
                        font-semibold
                        text-slate-700
                        mt-1
                    ">
                        {longitude !== null &&
                        longitude !== undefined
                            ? Number(longitude).toFixed(6)
                            : "Not selected"}
                    </p>

                </div>

            </div>

            {/* ==========================================
                INSTRUCTION
            ========================================== */}

            <div className="
                bg-blue-50
                border
                border-blue-100
                rounded-xl
                p-3
            ">

                <p className="
                    text-xs
                    text-blue-700
                ">

                    💡 <strong>Tip:</strong> Open this page
                    while you are at your pharmacy and
                    click <strong>Use My Location</strong>.
                    This will save your store's exact
                    location.

                </p>

            </div>

        </div>

    );
}