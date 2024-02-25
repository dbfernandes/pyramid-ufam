module.exports = {
    getEnv() {
        if (require("dotenv").config({ path: require('path').resolve('../.env') }).error) { // Attempt to get .env from project root
            require("dotenv").config();
        }
    }
}