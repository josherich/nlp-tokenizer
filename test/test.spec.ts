import { expect } from 'chai';
import { Tokenizer, NNTokenizer, WordPieceTokenizer } from '../src';

describe("Tokenizer", () => {

	it("Should Base Tokenizer tokenize", () => {

		let tokenizer = new Tokenizer
		let t = tokenizer.lexical_diversity("aa bb cc 😀 πüé Grüße")
		expect(t).to.eql([6,6,1])
	});

	it("Should Word Piece Tokenizer return sub words", () => {

		let tokenizer = new WordPieceTokenizer({'one': 1, 'two': 2, 'un': 3, 'able': 4, 'aff': 5}, '[UNK]')
		let t = tokenizer.tokenize('unaffable')
		expect(t).to.eql(['un', '##aff', '##able'])
	});

	it("Should NN Tokenizer tokenize", () => {

		let tokenizer = new NNTokenizer(['one', 'two', 'three', 'four', 'five', ',', '.'])
		tokenizer.add_tokens(['foo', 'bar'])
		let t = tokenizer.tokenize('one two three, four foo, five.')
		expect(t).to.eql(['one', 'two', 'three', ',', 'four', 'foo', ',', 'five', '.'])
	});

	it("Should NN Tokenizer encode", () => {

		let tokenizer = new NNTokenizer(['one', 'two', 'three', 'four', 'five', ',', '.'])
		tokenizer.add_tokens(['foo', 'bar'])
		let encoded = tokenizer.encode('one two three, four foo, five.')
		expect(encoded).to.eql([0, 1, 2, 5, 3, 8, 5, 4, 6])
	});


	it("Should NN Tokenizer encode unk", () => {

		let tokenizer = new NNTokenizer(['one', 'two', 'three', 'four', 'five', ',', '.'])
		tokenizer.add_tokens(['foo', 'bar'])
		let encoded = tokenizer.encode('one two three, four fdo foo, five.')
		expect(encoded).to.eql([0, 1, 2, 5, 3, 7, 8, 5, 4, 6])
	});

});
