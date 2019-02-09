class VATRelief {
  isTarget(category) {
    const targets = ["food", "beverage"];
    return targets.includes(category);
  }

  addTax(item) {
    if (this.isTarget(item.category)) {
      item.taxRate = 0.08;
    } else {
      item.taxRate = 0.1;
    }
    item.priceInTax = this.calcPriceInTax(item.price, item.taxRate);
    return item;
  }

  calcPriceInTax(price, taxRate) {
    return Math.floor(price * (taxRate + 1));
  }

  sumItemPrices(items) {
    return items
      .map(item => item.priceInTax)
      .reduce((total, price) => total + price);
  }
}

module.exports = VATRelief;
