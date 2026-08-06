class QueryFeatures {
  constructor(data, query) {
    this.data = data;
    this.query = query;
  }

  search() {
    if (this.query.search) {
      const keyword = this.query.search.toLowerCase();

      this.data = this.data.filter((product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    delete queryObj.search;
    delete queryObj.sort;
    delete queryObj.page;
    delete queryObj.limit;

    Object.keys(queryObj).forEach((key) => {
      this.data = this.data.filter(
        (product) => String(product[key]) === String(queryObj[key])
      );
    });

    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortField = this.query.sort.replace("-", "");
      const direction = this.query.sort.startsWith("-") ? -1 : 1;

      this.data.sort(
        (a, b) => (a[sortField] - b[sortField]) * direction
      );
    }

    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 20;

    const start = (page - 1) * limit;
    const end = start + limit;

    this.data = this.data.slice(start, end);

    return this;
  }
}

module.exports = QueryFeatures;