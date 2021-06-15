const bcryptjs = require('bcryptjs');
const SALT_LENGTH = Number(process.env.SALT_LENGTH) || 12;

module.exports = {
    hash: async (payload) => {
        try {
            const hashedPayload = await bcryptjs.hash(payload, SALT_LENGTH);
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
