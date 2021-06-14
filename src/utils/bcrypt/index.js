const bcryptjs = require('bcryptjs');
const HASHING_ROUND = Number(process.env.HASHING_ROUND) || 12;

module.exports = {
    hash: async (payload) => {
        try {
            const hashedPayload = await bcryptjs.hash(payload, HASHING_ROUND);
            return hashedPayload;
        } catch (error) {
            throw error;
        }
    }, 
    compareHash: async (payload, hash) => {
        try {
            const isMatch = await bcryptjs.compare(payload, hash);
            return isMatch;
        } catch (error) {
            throw error;
        }
    }
}
