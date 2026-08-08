function cosineSimilarity(a, b) {

    if (
        !Array.isArray(a) ||
        !Array.isArray(b) ||
        a.length === 0 ||
        b.length === 0
    ) {
        return 0;
    }

    const length = Math.min(
        a.length,
        b.length
    );

    let dot = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < length; i++) {

        const x = Number(a[i]) || 0;
        const y = Number(b[i]) || 0;

        dot += x * y;
        magnitudeA += x * x;
        magnitudeB += y * y;
    }

    if (
        magnitudeA === 0 ||
        magnitudeB === 0
    ) {
        return 0;
    }

    return dot /
        (
            Math.sqrt(magnitudeA) *
            Math.sqrt(magnitudeB)
        );
}

module.exports = {
    cosineSimilarity
};
