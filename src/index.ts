import Tokenizer from './Tokenizer'
import NNTokenizer from './NNTokenizer'
import WordPieceTokenizer from './WordPieceTokenizer'

export default Tokenizer
export { Tokenizer, NNTokenizer, WordPieceTokenizer }

// For CommonJS default export support
module.exports = Tokenizer
module.exports.default = Tokenizer

module.exports.Tokenizer = Tokenizer
module.exports.NNTokenizer = NNTokenizer
module.exports.WordPieceTokenizer = WordPieceTokenizer
