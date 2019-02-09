const assert = require("assert").strict;
const VATRelief = require("./VATRelief");

let vatRelief;

beforeEach(() => {
  vatRelief = new VATRelief();
});

function getOnigiri() {
  return {
    name: "手巻直火焼き紅しゃけ",
    category: "food",
    price: 139
  };
}

function getOmusubi() {
  return {
    name: "大きなおむすびマヨネーズ（食料品）",
    category: "food",
    price: 186
  };
}

function getChuhai() {
  return {
    name: "キリンチューハイ氷結グレープフルーツ350ml缶",
    category: "liquor",
    price: 141
  };
}

function getKirin() {
  return {
    name: "キリン 生茶 555ml ペットボトル",
    category: "beverage",
    price: 140
  };
}

describe("複数の税込価格計算済み商品の合計金額", () => {
  test("合計金額の計算が正しいこと（例1）", () => {
    const items = [
      getOnigiri(),
      getOnigiri(),
      getChuhai(),
      getChuhai(),
      getChuhai()
    ].map(item => vatRelief.addTax(item));

    const actual = vatRelief.sumItemPrices(items);
    assert.equal(765, actual);
  });

  test("合計金額の計算が正しいこと（例2）", () => {
    const items = [
      getOmusubi(),
      getOmusubi(),
      getOmusubi(),
      getKirin(),
      getKirin(),
      getKirin(),
      getKirin(),
      {
        name: "新ルルＡ錠ｓ50錠",
        category: "drug",
        price: 871
      }
    ].map(item => vatRelief.addTax(item));

    const actual = vatRelief.sumItemPrices(items);
    assert.equal(2162, actual);
  });
});

describe("商品を与えると、税率が付与された商品が返ること", () => {
  describe("軽減税率対象商品", () => {
    test("食料品（food）を与えると税率が8%になる", () => {
      const expected = {
        name: "手巻直火焼き紅しゃけ",
        category: "food",
        price: 139,
        priceInTax: 150,
        taxRate: 0.08
      };

      const actual = vatRelief.addTax(getOnigiri());

      assert.deepEqual(expected, actual);
    });

    test("飲料品（beverage）を与えると税率が8%になる", () => {
      const expected = {
        name: "キリン 生茶 555ml ペットボトル",
        category: "beverage",
        price: 140,
        priceInTax: 151,
        taxRate: 0.08
      };

      const actual = vatRelief.addTax(getKirin());

      assert.deepEqual(expected, actual);
    });
  });

  describe("軽減税率対象外商品", () => {
    test("酒類（liquor）を与えると税率が10%になること", () => {
      const expected = {
        name: "キリンチューハイ氷結グレープフルーツ350ml缶",
        category: "liquor",
        price: 141,
        priceInTax: 155,
        taxRate: 0.1
      };

      const actual = vatRelief.addTax(getChuhai());

      assert.deepEqual(expected, actual);
    });
  });
});

describe("税込み価格の計算", () => {
  test("端数が出たとき、端数が切り捨てられた価格が返ること", () => {
    const price = 103;
    const taxRate = 0.08;
    assert.equal(111, vatRelief.calcPriceInTax(price, taxRate));
  });

  test("端数が出ないとき、そのまま価格が返ること", () => {
    const price = 1000;
    const taxRate = 0.1;
    assert.equal(1100, vatRelief.calcPriceInTax(price, taxRate));
  });
});

describe("軽減税率対象かどうかの判定", () => {
  describe("食料品か飲料品を与えると軽減税率対象と判定される", () => {
    test("食料品（food）を与えるとtrueを返す", () => {
      // 前準備 & 実装
      const actual = vatRelief.isTarget("food");

      // 検証
      assert.equal(true, actual);
    });

    test("飲料品（beverage）を与えるとtrueを返す", () => {
      // 前準備 & 実装
      const actual = vatRelief.isTarget("beverage");

      // 検証
      assert.equal(true, actual);
    });
  });

  describe("食料品か飲料品以外を与えると軽減税率対象外と判定される", () => {
    test("酒類（liquor）を与えるとfalseを返す", () => {
      // 前準備 & 実装
      const actual = vatRelief.isTarget("liquor");

      // 検証
      assert.equal(false, actual);
    });
  });
});
