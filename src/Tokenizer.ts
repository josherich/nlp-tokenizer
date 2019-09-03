import { is_punctuation, is_whitespace, is_control, whitespace_tokenize} from './utils'

class Tokenizer {
	version: string
	constructor() {
		this.version = '1.0.0'
	}

	_clean_text(text: string): string {
		let output = []
		for (let char of text) {
			let cp = char.charCodeAt(0)
			if (cp == 0 || cp == 0xfffd || is_control(char))
				continue
			if (is_whitespace(char))
				output.push(" ")
			else
				output.push(char)
		}
		return output.join('')
	}

	_run_split_on_punc(text: string): string[] {
		let i = 0
		let start_new_word = true
		let output = []
		while (i < text.length) {
			let char = text[i]
			if (is_punctuation(char)) {
				output.push([char])
				start_new_word = true
			} else {
				if (start_new_word)
					output.push([])
				start_new_word = false
				output[output.length - 1].push(char)
			}
			i += 1
		}
		return output.map(x => x.join(''))
	}

	_run_strip_accents(text: string): string {
	    text = text.normalize('NFD')
	    let output = []
	    for (let char of text) {
	        if (/\p{Mn}/gu.test(char))
	        	continue
	        output.push(char)
	    }
	    return output.join('')
	}

	tokenize(text: string): string[] {
		text = this._clean_text(text)
		let orig_tokens = whitespace_tokenize(text)
		let split_tokens: string[] = []
		for (let i in orig_tokens) {
			let token = orig_tokens[i]
			token = token.toLowerCase()
	        token = this._run_strip_accents(token)
			split_tokens = split_tokens.concat(this._run_split_on_punc(token))
		}
		return split_tokens
	}

	lexical_diversity(text: string): number[] {
		let data = this.tokenize(text)
		let word_count = data.length || 1
		let vocab_size = (new Set(data)).size
		let diversity_score = vocab_size / word_count
		return [vocab_size, word_count, diversity_score]
	}
}

export default Tokenizer;

// For CommonJS default export support
module.exports = Tokenizer;
module.exports.default = Tokenizer;
