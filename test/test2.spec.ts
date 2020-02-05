import { expect } from 'chai';
describe("render", () => {
  it("Should render data-t binding", () => {
    expect('el.text()').to.equal('doordash')
  });
});
