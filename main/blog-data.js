const {ipcMain} = require('electron');
const blogs = [];

ipcMain.on('blog-data', (event, data) => {
    if (blogs.length === 0) {
        blogs.push(data);
    } else {
        const foundBlogIndex = blogs.findIndex(item => (item.id === data.id));

        if (foundBlogIndex > -1) {
            blogs[foundBlogIndex] = data;
        } else {
            blogs.push(data);
        }
    }

    console.log(`Blog ${data.id} (${data.url}) updated. Blogs known to main thread: ${blogs.length}`);
});

module.exports = blogs;