const {app} = require('electron');
const {state} = require('./state-manager');

app.on('login', (event, webContents, request, authInfo, callback) => {
    if (state.blogs && state.blogs.length > 0 && request && request.url) {
        state.blogs.forEach(blog => {
            if (blog.url.includes(request.url)) {
                const username = blog.basicUsername;
                const password = blog.basicPassword;

                event.preventDefault();
                callback(username, password);
            }
        })
    }
});