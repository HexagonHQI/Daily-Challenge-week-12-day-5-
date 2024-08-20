const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Parser = require('rss-parser');
const path = require('path');

const app = express();
const parser = new Parser();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/pages'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// 1. Home route to retrieve all facts from the RSS feed
app.get('/', async (req, res) => {
    let feed = await parser.parseURL('https://thefactfile.org/feed/');
    res.render('index', { feed: feed.items });
});

// 2. Search route to render the search page
app.get('/search', (req, res) => {
    res.render('search', { posts: [] });
});

// 3. Search by title
app.post('/search/title', async (req, res) => {
    let feed = await parser.parseURL('https://thefactfile.org/feed/');
    const title = req.body.title.toLowerCase();
    const filteredPosts = feed.items.filter(item => item.title.toLowerCase().includes(title));
    res.render('search', { posts: filteredPosts });
});

// 4. Search by category
app.post('/search/category', async (req, res) => {
    let feed = await parser.parseURL('https://thefactfile.org/feed/');
    const category = req.body.category.toLowerCase();
    const filteredPosts = feed.items.filter(item => item.categories.some(cat => cat.toLowerCase() === category));
    res.render('search', { posts: filteredPosts });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
