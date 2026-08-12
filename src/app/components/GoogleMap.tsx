import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import {
    useEffect,
    useMemo,
} from "react";


// ======================================================
// FIX DEFAULT LEAFLET MARKER ICON
// ======================================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ======================================================
// TYPES
// ======================================================

interface Pharmacy {
    id: number;

    pharmacy_name: string;

    address?: string;

    phone?: string;

    latitude?: number | string | null;

    longitude?: number | string | null;

    status?: string;
}


interface GoogleMapProps {
    pharmacies?: Pharmacy[];
}


// ======================================================
// MAP CENTER COMPONENT
// ======================================================

function MapController({
    pharmacies,
}: {
    pharmacies: Pharmacy[];
}) {

    const map = useMap();

    useEffect(() => {

        if (
            !pharmacies ||
            pharmacies.length === 0
        ) {
            return;
        }


        const validPharmacies =
            pharmacies.filter(
                (pharmacy) => {

                    const lat =
                        Number(
                            pharmacy.latitude
                        );

                    const lng =
                        Number(
                            pharmacy.longitude
                        );

                    return (
                        Number.isFinite(lat) &&
                        Number.isFinite(lng)
                    );
                }
            );


        if (
            validPharmacies.length === 0
        ) {
            return;
        }


        // ==================================================
        // ONE PHARMACY
        // ==================================================

        if (
            validPharmacies.length === 1
        ) {

            const pharmacy =
                validPharmacies[0];

            const lat =
                Number(
                    pharmacy.latitude
                );

            const lng =
                Number(
                    pharmacy.longitude
                );


            map.setView(
                [lat, lng],
                16
            );

            return;
        }


        // ==================================================
        // MULTIPLE PHARMACIES
        // ==================================================

        const bounds =
            L.latLngBounds(
                validPharmacies.map(
                    (pharmacy) => [

                        Number(
                            pharmacy.latitude
                        ),

                        Number(
                            pharmacy.longitude
                        ),

                    ]
                )
            );


        map.fitBounds(
            bounds,
            {
                padding: [50, 50],
                maxZoom: 15,
            }
        );

    }, [
        pharmacies,
        map,
    ]);


    return null;
}


// ======================================================
// MAIN MAP
// ======================================================

export default function GoogleMap({
    pharmacies = [],
}: GoogleMapProps) {


    // ==================================================
    // FILTER APPROVED PHARMACIES
    // ==================================================

    const approvedPharmacies =
        useMemo(() => {

            return pharmacies.filter(
                (pharmacy) => {

                    const lat =
                        Number(
                            pharmacy.latitude
                        );

                    const lng =
                        Number(
                            pharmacy.longitude
                        );


                    const validCoordinates =
                        Number.isFinite(lat) &&
                        Number.isFinite(lng);


                    const approved =
                        String(
                            pharmacy.status || ""
                        ).toLowerCase() ===
                        "approved";


                    return (
                        validCoordinates &&
                        approved
                    );
                }
            );

        }, [pharmacies]);


    // ==================================================
    // DEFAULT CENTER
    // ==================================================

    const defaultCenter: [
        number,
        number
    ] = [
        23.8103,
        90.4125,
    ];


    // ==================================================
    // DISPLAY
    // ==================================================

    return (

        <div
            className="
                relative
                w-full
                h-full
                rounded-2xl
                overflow-hidden
            "
        >

            <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="
                    w-full
                    h-full
                "
            >

                {/* ======================================
                    OPENSTREETMAP
                ====================================== */}

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {/* ======================================
                    AUTOMATICALLY CENTER MAP
                ====================================== */}

                <MapController
                    pharmacies={
                        approvedPharmacies
                    }
                />


                {/* ======================================
                    PHARMACY MARKERS
                ====================================== */}

                {approvedPharmacies.map(
                    (pharmacy) => {

                        const latitude =
                            Number(
                                pharmacy.latitude
                            );

                        const longitude =
                            Number(
                                pharmacy.longitude
                            );


                        return (

                            <Marker
                                key={
                                    pharmacy.id
                                }
                                position={[
                                    latitude,
                                    longitude,
                                ]}
                            >

                                <Popup>

                                    <div
                                        style={{
                                            minWidth:
                                                "220px",
                                        }}
                                    >

                                        {/* NAME */}

                                        <h3
                                            style={{
                                                margin:
                                                    "0 0 8px",

                                                fontSize:
                                                    "16px",

                                                fontWeight:
                                                    "700",

                                                color:
                                                    "#0f172a",
                                            }}
                                        >

                                            💊{" "}
                                            {
                                                pharmacy.pharmacy_name
                                            }

                                        </h3>


                                        {/* ADDRESS */}

                                        <p
                                            style={{
                                                margin:
                                                    "0 0 8px",

                                                fontSize:
                                                    "12px",

                                                color:
                                                    "#64748b",
                                            }}
                                        >

                                            📍{" "}

                                            {
                                                pharmacy.address ||
                                                "Address unavailable"
                                            }

                                        </p>


                                        {/* PHONE */}

                                        {pharmacy.phone && (

                                            <p
                                                style={{
                                                    margin:
                                                        "0 0 8px",

                                                    fontSize:
                                                        "12px",

                                                    color:
                                                        "#475569",
                                                }}
                                            >

                                                📞{" "}
                                                {
                                                    pharmacy.phone
                                                }

                                            </p>

                                        )}


                                        {/* VERIFIED */}

                                        <p
                                            style={{
                                                margin:
                                                    "0 0 10px",

                                                fontSize:
                                                    "11px",

                                                fontWeight:
                                                    "600",

                                                color:
                                                    "#16a34a",
                                            }}
                                        >

                                            ✓ Registered
                                            MediFind Pharmacy

                                        </p>


                                        {/* DIRECTIONS */}

                                        <button
                                            type="button"
                                            onClick={() => {

                                                const url =
                                                    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

                                                window.open(
                                                    url,
                                                    "_blank"
                                                );

                                            }}
                                            style={{
                                                width:
                                                    "100%",

                                                padding:
                                                    "8px 10px",

                                                border:
                                                    "none",

                                                borderRadius:
                                                    "8px",

                                                background:
                                                    "#2563eb",

                                                color:
                                                    "white",

                                                cursor:
                                                    "pointer",

                                                fontSize:
                                                    "12px",

                                                fontWeight:
                                                    "600",
                                            }}
                                        >

                                            🧭 Get Directions

                                        </button>

                                    </div>

                                </Popup>

                            </Marker>

                        );

                    }
                )}

            </MapContainer>


            {/* ==========================================
                NO PHARMACIES
            ========================================== */}

            {approvedPharmacies.length === 0 && (

                <div
                    className="
                        absolute
                        top-4
                        left-1/2
                        -translate-x-1/2
                        z-[1000]
                        bg-white
                        px-4
                        py-3
                        rounded-xl
                        shadow-lg
                    "
                >

                    <p
                        className="
                            text-xs
                            text-slate-600
                            font-medium
                        "
                    >

                        No approved pharmacies
                        with locations found.

                    </p>

                </div>

            )}

        </div>
    );
}