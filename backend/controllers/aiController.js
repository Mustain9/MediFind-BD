const { GoogleGenAI } = require("@google/genai");
const db = require("../config/db");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =====================================================
// AI MEDICINE SEARCH
// =====================================================

exports.aiMedicineSearch = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please enter what you are looking for."
            });

        }


        // =================================================
        // ASK GEMINI TO UNDERSTAND THE USER
        // =================================================

        const prompt = `
You are the AI search assistant for MediFind BD.

Your ONLY job is to understand a customer's medicine
search request.

You are NOT a doctor.

Do NOT diagnose diseases.

Do NOT prescribe medicines.

Do NOT recommend treatments.

Do NOT invent medicine names.

Extract useful search information from the customer's
message.

Return ONLY valid JSON.

Required format:

{
    "search_terms": [],
    "max_price": null,
    "location_requested": false,
    "message": ""
}

Rules:

1. search_terms:
   Include medicine brand or generic names explicitly
   mentioned by the customer.

2. If the customer does not mention a medicine name,
   return an empty array.

3. Never invent medicine names.

4. max_price:
   If the customer says something like:
   "under 50 taka"

   return:

   50

   If no maximum price is mentioned:
   null

5. location_requested:
   true if the customer says:
   near me
   nearby
   close to me
   near my location

   Otherwise:
   false

6. message:
   Briefly explain what MediFind will search.

Do not give medical advice.

Customer request:

${message}
`;


        // =================================================
        // CALL GEMINI
        // =================================================

        const response = await ai.models.generateContent({

            model: "gemini-3.5-flash-lite",

            contents: prompt

        });


        const aiText = response.text;

        console.log("GEMINI RESPONSE:");
        console.log(aiText);


        // =================================================
        // CLEAN JSON
        // =================================================

        let parsed;

        try {

            const cleaned = aiText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            parsed = JSON.parse(cleaned);

        } catch (error) {

            console.error(
                "AI JSON PARSE ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "AI returned an invalid response."

            });

        }


        // =================================================
        // NO MEDICINE NAME
        // =================================================

        if (
            !parsed.search_terms ||
            parsed.search_terms.length === 0
        ) {

            return res.json({

                success: true,

                ai: parsed,

                results: [],

                message:
                    "Please enter a medicine name or generic name."

            });

        }


        // =================================================
        // BUILD SEARCH CONDITIONS
        // =================================================

        const conditions = [];

        const values = [];

        const termConditions = [];


        parsed.search_terms.forEach(term => {

            termConditions.push(`

                (
                    medicines.brand_name LIKE ?
                    OR medicines.generic_name LIKE ?
                )

            `);

            values.push(
                `%${term}%`,
                `%${term}%`
            );

        });


        conditions.push(
            `(${termConditions.join(" OR ")})`
        );


        // ONLY APPROVED PHARMACIES

        conditions.push(
            `pharmacies.status = 'approved'`
        );


        // ONLY AVAILABLE STOCK

        conditions.push(
            `inventory.stock > 0`
        );


        // PRICE LIMIT

        if (
            parsed.max_price !== null &&
            !isNaN(Number(parsed.max_price))
        ) {

            conditions.push(
                `inventory.price <= ?`
            );

            values.push(
                Number(parsed.max_price)
            );

        }


        // =================================================
        // DATABASE QUERY
        // =================================================

        const sql = `

            SELECT

                medicines.id AS medicine_id,

                medicines.brand_name,

                medicines.generic_name,

                medicines.strength,

                medicines.dosage_form,

                pharmacies.id AS pharmacy_id,

                pharmacies.pharmacy_name,

                pharmacies.address,

                pharmacies.phone,

                pharmacies.latitude,

                pharmacies.longitude,

                inventory.stock,

                inventory.price

            FROM medicines

            INNER JOIN inventory

                ON medicines.id =
                   inventory.medicine_id

            INNER JOIN pharmacies

                ON inventory.pharmacy_id =
                   pharmacies.id

            WHERE

                ${conditions.join(" AND ")}

            ORDER BY

                inventory.price ASC

            LIMIT 50

        `;


        // =================================================
        // RUN DATABASE SEARCH
        // =================================================

        db.query(
            sql,
            values,
            (err, results) => {

                if (err) {

                    console.error(
                        "AI DATABASE SEARCH ERROR:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to search pharmacy inventory.",

                        error:
                            err.message

                    });

                }


                return res.json({

                    success: true,

                    ai: parsed,

                    results: results,

                    count: results.length

                });

            }
        );


    } catch (error) {

        console.error(
            "AI MEDICINE SEARCH ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "AI medicine search failed.",

            error:
                error.message

        });

    }

};