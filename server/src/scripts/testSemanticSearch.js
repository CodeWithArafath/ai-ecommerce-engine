require("dotenv").config();

const mongoose = require("mongoose");

const {
    semanticSearch
} = require("../ai/services/semanticSearchService");

const run = async () => {

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    const query =
        process.argv.slice(2).join(" ") ||
        "comfortable running shoes";

    console.log("");
    console.log("Semantic query:", query);
    console.log("");

    const results = await semanticSearch(
        query,
        {
            limit: 10,
            minScore: 0
        }
    );

    console.log("");
    console.log("Results:", results.length);
    console.log("");

    results.forEach((result) => {

        console.log(
            "#" + result.rank,
            result.product.name
        );

        console.log(
            "Category:",
            result.product.category
        );

        console.log(
            "Brand:",
            result.product.brand
        );

        console.log(
            "Price:",
            result.product.price
        );

        console.log(
            "Similarity:",
            result.score
        );

        console.log("------------------------------");
    });

    await mongoose.disconnect();

    console.log("");
    console.log("Semantic search test completed.");
};

run().catch(async (error) => {

    console.error("");
    console.error("Semantic search failed:");
    console.error(error.message);

    try {
        await mongoose.disconnect();
    } catch {}

    process.exit(1);
});
