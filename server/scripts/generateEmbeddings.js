require("dotenv").config();

const mongoose =
    require("mongoose");

const {
    generateAllProductEmbeddings
} =
    require("../src/ai/services/embeddingService");

const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

async function main() {

    if (!MONGO_URI) {
        throw new Error(
            "MongoDB connection string missing"
        );
    }

    console.log(
        "Connecting to MongoDB..."
    );

    await mongoose.connect(
        MONGO_URI
    );

    console.log(
        "MongoDB connected."
    );

    const result =
        await generateAllProductEmbeddings({
            batchSize:
                Number(
                    process.env.EMBEDDING_BATCH_SIZE
                ) || 32,
            force: false
        });

    console.log("");
    console.log(result);

    await mongoose.disconnect();
}

main()
    .catch(async error => {

        console.error(
            "Embedding generation failed:",
            error
        );

        try {
            await mongoose.disconnect();
        } catch {}

        process.exit(1);
    });
