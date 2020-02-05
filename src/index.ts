import Tokenizer from './Tokenizer'
import NNTokenizer from './NNTokenizer'
import WordPieceTokenizer from './WordPieceTokenizer'
import { binary_dump, load_vocab } from './file_utils'

export default Tokenizer
export { Tokenizer, NNTokenizer, WordPieceTokenizer, binary_dump }

// For CommonJS default export support
module.exports = Tokenizer
module.exports.default = Tokenizer

module.exports.Tokenizer = Tokenizer
module.exports.NNTokenizer = NNTokenizer
module.exports.WordPieceTokenizer = WordPieceTokenizer
module.exports.binary_dump = binary_dump
