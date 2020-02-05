import NNTokenizer from './NNTokenizer'
import { readFileSync } from 'fs'

function shuffleArray(arr: number[] | string[]) {
	return arr
	  .map(a => [Math.random(), a])
	  .sort((a, b) => a[0] - b[0])
	  .map(a => a[1])
}

function binary_dump(input: string, output: string, vocab_file: string): void {
	// read file
	let data = readFileSync(input, 'utf-8').split('\n')

	// build vocabulary
	let vocabulary = load_vocab(vocab_file)
	let tokenizer = new NNTokenizer(vocabulary)

	let arrs = shuffleArray(data).map(a => {
		return tokenizer.encode(`[CLS] ${a.trim()} [SEP]`))
	})

	let buf = new Uint16Array(arrs.flat())
	fs.writeFile(output, buf)
}

function load_vocab(vocab_file: string): object {
	let data = readFileSync(vocab_file, 'utf-8').split('\n')

	let res = {}
	data.map((word, idx) => {
		let key = word.split(' ')[0]
		res[key] = idx
	})
	return res
}

export { binary_dump, load_vocab }

// For CommonJS default export support
module.exports = binary_dump
module.exports.binary_dump = binary_dump
module.exports.load_vocab = load_vocab
