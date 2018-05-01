import jsonStableStringify from 'fast-stable-stringify';
import { v3 as murmurHash3 } from 'murmur-hash';

const hash = data => murmurHash3.x64.hash128(jsonStableStringify(data || null));

export default hash;
