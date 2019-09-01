class Tokenizer {
	version: string
	constructor() {
		this.version = '1.0.0'
	}

	_is_whitespace(char: string): boolean {
		if (char == " " || char == "\t" || char == "\n" || char == "\r") {
			return true
		}
		if (/\p{Zs}/g.test(char))
			return true
		return false
	}

	_is_control(char: string): boolean {
		if (char == "\t" || char == "\n" || char == "\r") {
			return false
		}
		// Cc: \Control
		// Cf: \Format
		// Cs: \Surrogate
		// Co: \Private_Use
		// Cn: \Unassigned
		let startsWithC = [/\p{Cc}/gu, /\p{Cf}/gu, /\p{Cs}/gu, /\p{Co}/gu, /\p{Cn}/gu].some(expr => {
			return expr.test(char)
		})
		return startsWithC
	}

	_is_punctuation(char: string): boolean {
		let cp = char.charCodeAt(0)
		if ((cp >= 33 && cp <= 47) || (cp >= 58 && cp <= 64) ||
				(cp >= 91 && cp <= 96) || (cp >= 123 && cp <= 126))
			return true
		// Pc: \Connector_Punctuation
		// Pd: \Dash_Punctuation
		// Ps: \Open_Punctuation
		// Pe: \Close_Punctuation
		// Pi: \Initial_Punctuation
		// Pf: \Final_Punctuation
		// Po: \Other_Punctuation
		let startsWithC = [/\p{Pc}/gu, /\p{Pd}/gu, /\p{Ps}/gu, /\p{Pe}/gu, /\p{Pi}/gu, /\p{Pf}/gu, /\p{Po}/gu].some(expr => {
			return expr.test(char)
		})
		return startsWithC
	}

	_clean_text(text: string): string {
		let output = []
		for (let char of text) {
			let cp = char.charCodeAt(0)
			if (cp == 0 || cp == 0xfffd || this._is_control(char))
				continue
			if (this._is_whitespace(char))
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
			if (this._is_punctuation(char)) {
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

	whitespace_tokenize(text: string): string[] {
		text = text.trim()
		if (!text)
		  return []
		let tokens = text.split(/\s+/)
		return tokens
	}

	tokenize(text: string): string[] {
		text = this._clean_text(text)
		let orig_tokens = this.whitespace_tokenize(text)
		let split_tokens: string[] = []
		for (let i in orig_tokens) {
			let token = orig_tokens[i]
			token = token.toLowerCase()
	        token = this._run_strip_accents(token)
			split_tokens = split_tokens.concat(this._run_split_on_punc(token))
		}
		console.log(split_tokens)
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
