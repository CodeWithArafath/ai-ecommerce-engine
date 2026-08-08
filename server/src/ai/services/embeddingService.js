const Product = require("../../models/Product");

let extractor = null;

const MODEL =
    process.env.LOCAL_EMBEDDING_MODEL ||
    "Xenova/all-MiniLM-L6-v2";

async function getExtractor() {

    if (extractor) {
        return extractor;
    }

    console.log("");
    console.log("========================================");
    console.log("Loading local AI embedding model");
    console.log(`Model: ${MODEL}`);
    console.log("First run downloads the model.");
    console.log("========================================");
    console.log("");

    const {
        pipeline
    } = await import("@huggingface/transformers");

    extractor = await pipeline(
        "feature-extraction",
        MODEL
    );

    console.log("Local embedding model ready.");

    return extractor;
}

async function generateEmbedding(text) {

    if (!text || !String(text).trim()) {
        throw new Error("Text is required for embedding");
    }

    const model = await getExtractor();

    const output = await model(
        String(text),
        {
            pooling: "mean",
            normalize: true
        }
    );

    return Array.from(output.data);
}

function productToText(product) {

    return [
        `Product: ${product.name || ""}`,
        `Category: ${product.category || ""}`,
        `Brand: ${product.brand || ""}`,
        `Description: ${product.description || ""}`
    ].join(". ");
}

async function generateProductEmbedding(product) {

    return generateEmbedding(
        productToText(product)
    );
}

async function generateAllProductEmbeddings({
    batchSize = 32,
    force = false
} = {}) {

    const filter = force
        ? {}
        : {
            $or: [
                {
                    embedding: {
                        $exists: false
                    }
                },
                {
                    embedding: {
                        $size: 0
                    }
                }
            ]
        };

    const products = await Product
        .find(filter)
        .select(
            "_id name category brand description"
        )
        .lean();

    console.log("");
    console.log(
        `Products requiring embeddings: ${products.length}`
    );

    if (!products.length) {

        return {
            total: 0,
            processed: 0,
            failed: 0
        };
    }

    const model = await getExtractor();

    let processed = 0;
    let failed = 0;

    for (
        let i = 0;
        i < products.length;
        i += batchSize
    ) {

        const batch = products.slice(
            i,
            i + batchSize
        );

        try {

            const texts = batch.map(
                productToText
            );

            const output = await model(
                texts,
                {
                    pooling: "mean",
                    normalize: true
                }
            );

            const dimensions = output.dims;

            const embeddingSize =
                dimensions[
                    dimensions.length - 1
                ];

            const operations = [];

            for (
                let j = 0;
                j < batch.length;
                j++
            ) {

                const embedding =
                    Array.from(
                        output.data.slice(
                            j * embeddingSize,
                            (j + 1) *
                            embeddingSize
                        )
                    );

                operations.push({
                    updateOne: {
                        filter: {
                            _id: batch[j]._id
                        },
                        update: {
                            $set: {
                                embedding
                            }
                        }
                    }
                });

                processed++;
            }

            if (operations.length) {
                await Product.bulkWrite(
                    operations
                );
            }

            console.log(
                `Embeddings: ${processed}/${products.length}`
            );

        } catch (error) {

            failed += batch.length;

            console.error(
                "Embedding batch failed:",
                error.message
            );
        }
    }

    console.log("");
    console.log("========================================");
    console.log("Embedding generation completed");
    console.log(`Total: ${products.length}`);
    console.log(`Processed: ${processed}`);
    console.log(`Failed: ${failed}`);
    console.log("========================================");

    return {
        total: products.length,
        processed,
        failed
    };
}

module.exports = {
    generateEmbedding,
    generateProductEmbedding,
    generateAllProductEmbeddings
};
