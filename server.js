const app = require('./app');
const dorenv = require('dotenv');
dorenv.config();

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})