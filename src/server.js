import app from './app.js';
import config from './config/index.js';

const PORT = process.env.PORT || 9999;
console.log("Port", PORT)
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));