const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const connectDB = async (DB_URL) => {
    try {
        let db = await mongoose.connect(DB_URL) 
        console.log("DB Connected : " + db.connection.name);
    } catch (error) {
        console.log(error);
    }
}

connectDB(process.env.DB_URL);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
