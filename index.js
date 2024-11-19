const express=require('express');
const mongoose=require('mongoose')
const app=express();

app.use(express.json())
mongoose.connect('mongodb://localhost:27017/library', {});

// schema for mongodb
const bookSchema= new mongoose.Schema({
    name: String,
    author: String,
    price: Number,
    count: Number
});
const book=mongoose.model("books",bookSchema)

app.get("/getBooks",async (req,res)=>{
    try {
        const items = await book.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post("/addBook",async (req,res)=>{
    const {name,author,price,count}=req.body

    const newBook=new book({name,author,price,count});
    
    try {
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.delete("/remove/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const result = await book.deleteOne({ name });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/change/:name", async (req, res) => {
    const { name } = req.params;
    const updates = req.body;

    try {
        const updatedBook = await book.findOneAndUpdate({ name }, updates, { new: true });
        
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})


