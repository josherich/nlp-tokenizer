import { expect } from 'chai';
import Tokenizer from '../src';

describe("Tokenizer", () => {

	it("Should return [6,6,1]", () => {

		let tokenizer = new Tokenizer
		let t = tokenizer.lexical_diversity("aa bb cc 😀 πüé Grüße")
		expect(t).to.eql([6,6,1])
	});

});
