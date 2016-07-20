const {app} = require('electron');
const blogs = require('./blog-data');

app.on('login', (event, webContents, request, authInfo, callback) => {
    if (blogs && blogs.length > 0 && request && request.url) {
        blogs.forEach(blog => {
            if (blog.url.includes(request.url)) {
                const username = blog.basicUsername;
                const password = blog.basicPassword;

                event.preventDefault();
                callback(username, password);
            }
        })
    }
});