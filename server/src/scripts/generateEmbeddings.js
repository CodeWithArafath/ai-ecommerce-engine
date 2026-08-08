require("dotenv").config();

const mongoose =
  require("mongoose");

const {
  generateAllProductEmbeddings,
} = require("../ai/services/embeddingService");

const connectDB =
  async () => {
    const uri =
      process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        "MONGODB_URI is missing"
      );
    }

    await mongoose.connect(
      uri
    );

    console.log(
      "MongoDB connected"
    );
  };


const main =
  async () => {
    try {
      await connectDB();

      console.log("");
      console.log(
        "Starting product embedding generation..."
      );
      console.log("");

      const result =
        await generateAllProductEmbeddings(
          {
            batchSize: 25,
            delay: 200,
          }
        );

      console.log("");
      console.log(
        "Embedding generation completed"
      );
      console.log(
        result
      );
      console.log("");
    } catch (error) {
      console.error(
        "Embedding generation failed:",
        error.message
      );

      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();
    }
  };


main();
