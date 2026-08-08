# AI Engine

## Semantic Search

GET:

/api/ai/search?q=wireless+headphones&mode=semantic

## Hybrid Search

GET:

/api/ai/search?q=iphone&mode=hybrid

## Recommendations

GET:

/api/ai/recommendations/:productId

## Similar Products

GET:

/api/ai/similar/:productId

## Trending

GET:

/api/ai/trending

## Generate Embeddings

POST:

/api/ai/embeddings/generate

The system uses:

Xenova/all-MiniLM-L6-v2

Embeddings are stored directly in MongoDB.

No external AI API is required.
