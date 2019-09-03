import Tokenizer from './Tokenizer'
import WordPieceTokenizer from './WordPieceTokenizer'

class NNTokenizer {
	version: string
	special_token_names: string[]
	max_len: number
	unk_token: string
	sep_token: string
	pad_token: string
	cls_token: string
	mask_token: string

	added_tokens_encoder: { [index:string] : number }
	added_tokens_decoder: { [index:number] : string }

	vocab: { [index:string] : number }
	ids_to_tokens: { [index:number] : string }
	basic_tokenizer: Tokenizer
	wordpiece_tokenizer: WordPieceTokenizer
	basic_tokenize: boolean
	all_special_tokens: { [index:string] : boolean }
	constructor(vocab: string[]=[], basic_tokenize=true, unk_token="[UNK]", sep_token="[SEP]", pad_token="[PAD]", cls_token="[CLS]",
                 mask_token="[MASK]", max_len=1e12) {
		this.version = '1.1.0'
		this.max_len = max_len
		this.special_token_names = ['bos_token', 'eos_token', 'unk_token', 'sep_token', 'pad_token', 'cls_token', 'mask_token']

		this.unk_token = unk_token
		this.sep_token = sep_token
		this.pad_token = pad_token
		this.cls_token = cls_token
		this.mask_token = mask_token
		this.all_special_tokens = {}
		this.all_special_tokens[unk_token] = true

		this.added_tokens_encoder = {}
		this.added_tokens_decoder = {}


		this.ids_to_tokens = {}
		this.vocab = {}
		this.load_vocab(vocab)

		this.basic_tokenize = basic_tokenize
		// if (basic_tokenize) {
		// }
		this.basic_tokenizer = new Tokenizer()
		this.wordpiece_tokenizer = new WordPieceTokenizer(this.vocab, unk_token=this.unk_token)
	}

	load_vocab(vocab: string[]): void {
		// fs or fetch
		vocab.map((word, i) => {
			this.vocab[word] = i
			this.ids_to_tokens[i] = word
		})
		let counter = vocab.length
		for (let k in this.all_special_tokens) {
			this.vocab[k] = counter
			counter++
		}
	}

	encoder_offset(): number {
		return Object.keys(this.added_tokens_encoder).length + Object.keys(this.vocab).length
	}

	add_tokens(tokens: string[]): number {
		let offset = this.encoder_offset()
		let counter = 0
		tokens.map((token) => {
			if (token !== this.unk_token) {
				this.added_tokens_encoder[token] = offset + counter
				this.added_tokens_decoder[offset + counter] = token
				counter++
			}
		})
		return counter
	}

	_token_to_id_with_added_voc(token: string): number {
		if (this.added_tokens_encoder[token])
			return this.added_tokens_encoder[token]
		return this._token_to_id(token)
	}

	_token_to_id(token: string): number {
		return this.vocab[token] != undefined ? this.vocab[token] : this.vocab[this.unk_token]
	}

	_id_to_token(id: number): string {
		// TODO: default map should handle this unk_token
		return this.ids_to_tokens[id] || this.unk_token
	}

	tokens_to_ids(tokens: string[] | string): number[] {
		if (typeof tokens === 'string') {
			return [this._token_to_id_with_added_voc(tokens)]
		}

		const ids: number[] = []
		tokens.map(token => {
			ids.push(this._token_to_id_with_added_voc(token))
		})
		if (ids.length > this.max_len) {
			console.log("warining: Tokens too long")
		}
		return ids
	}

	_ids_to_tokens(ids: number | number[]): string[] {
		if (typeof ids === 'number') {
			ids = [ids]
		}
		return ids.map(id => {
			return this.added_tokens_decoder[id] || this._id_to_token(id)
		})
	}

	tokens_to_text(tokens: string[]): string {
		// this.ids_to_tokens(tokens).join(' ')
		return tokens.join(' ')
	}

	split_on_token(token: string, text: string): string[] {
		let result: string[] = []
		let split = text.split(token)
		split.map((_text, i) => {
			_text = _text.trim()
			if (i === 0 && !_text) {
				result.push(token)
			} else if (i === split.length - 1) {
				if (_text)
					result.push(_text)
			} else {
				if (_text)
					result.push(_text)
				result.push(token)
			}
		})
		return result
	}

	split_on_tokens(tokens: string[], text: string): string[] {
		if (!text) {
			return []
		}
		if (!tokens) {
			return this._tokenize(text)
		}
		let texts = [text]
		let tokenized: string[] = []
		tokens.map(tok => {
			tokenized = []
			texts.map(_text => {
				if (!this.added_tokens_encoder[_text] && !this.all_special_tokens[_text]) {
					tokenized = tokenized.concat(this.split_on_token(tok, _text))
				} else {
					tokenized.push(_text)
				}
			})
			texts = tokenized
		})
		let result: string[] = []
		tokenized.map(_text => {
			if (!this.added_tokens_encoder[_text] && !this.all_special_tokens[_text]) {
				result = result.concat(this._tokenize(_text))
			} else {
				result.push(_text)
			}
		})
		return result
	}

	tokenize(text: string): string[] {
		let split_tokens = Object.keys(this.added_tokens_encoder).concat(Object.keys(this.all_special_tokens))
		return this.split_on_tokens(split_tokens, text)
	}

	_tokenize(text: string): string[] {
		let split: string[] = []
		if (this.basic_tokenize) {
			this.basic_tokenizer.tokenize(text).map(token => {
				this.wordpiece_tokenizer.tokenize(token).map(_token => {
					split.push(_token)
				})
			})
		} else {
			this.wordpiece_tokenizer.tokenize(text).map(token => {
				split.push(token)
			})
		}
		return split
	}

	encode(text: string): number[] {
		return this.tokens_to_ids(this.tokenize(text))
	}

	decode(token_ids: number[]): string[] {
		const tokens = this._ids_to_tokens(token_ids)
		let text = this.tokens_to_text(tokens)
		if (this.sep_token && text.includes(this.sep_token)) {
			text = text.replace(this.cls_token, this.sep_token)
			return text.split(this.sep_token).filter(sent => sent.length > 0)
		} else {
			return [text]
		}
	}

}

export default NNTokenizer;

// For CommonJS default export support
module.exports = NNTokenizer;
module.exports.default = NNTokenizer;
