## Ghost Desktop Deeplinks

Ghost Desktop currently supports the following deeplinks:

#### Open Blog
Opens the blog if already registered with the app. If it isn't, it'll open the "Add Blog" UI with the URL prefilled.

```
ghost://open-blog/?blog=http://address-of-my-blog.com
```

#### Create Draft
Creates a new draft in the currently open blog with a given title and content. If the app is closed, it'll use the blog that was last opened.

```
ghost://create-draft/?title=Hi&content=Hello
```

You'll probably have spaces, special characters, and all kinds of other funky characters in the title or the content. Make sure you URL encode your parameters - in JavaScript, you should for instance call `encodeURIComponent` like so: `ghost://create-draft/?title=${encodeURIComponent(Spaces! Symbols! 🚀)}`.