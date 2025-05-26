/**
 * User credentials configuration
 * These can be overridden by environment variables
 */
export const credentials = {
    'one': { 
        username: process.env.USER_ONE_USERNAME || 'Qatestz001', 
        password: process.env.USER_ONE_PASSWORD || 'P@ssword1' 
    },
    'two': { 
        username: process.env.USER_TWO_USERNAME || 'Qatestz002', 
        password: process.env.USER_TWO_PASSWORD || 'P@ssword1' 
    },
    'three': { 
        username: process.env.USER_THREE_USERNAME || 'Qatestz003', 
        password: process.env.USER_THREE_PASSWORD || 'P@ssword1' 
    },
    'adrp': { 
        username: process.env.ADRP_USERNAME || 'acaapiautomation', 
        password: process.env.ADRP_PASSWORD || 'Password1!' 
    }
};
