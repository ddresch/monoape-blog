---
slug: 'get-in-touch-with-svelte'
title: 'Get in touch with Svelte'
published_at: '2020-08-09'
---

Today is the day. I decided pretty spontaneously to get this blog started.

## Why do I need a blog?
It's more or less an attempt to get my daily excursions in dev world kind of documented and a bit more structured for later use. Will see how this attempt will work out.

On the other hand I needed a little push to finally start looking into [Svelte](https://www.svelte.dev). This push was the decision to setup a blog not in common Wordpress, but to go for a more developer like solution like [Sapper](https://sapper.svelte.dev/) which is a Svelte framework for building fast and reliable web applications.

## How to get started?
First I needed to sit down and decide how to go the Svelte route. After about 10 minutes of web search and short readings here and there I found out about the before mentioned Sapper framework.

*What to do from here?*

1. Setup standard Sapper project
2. Write your markdown / blog article (in my case this one)
3. Decide where to [deploy](https://vercel.com) the whole thing
4. Deploy the project

### Setup standard Sapper project
This is really the easiest part of the whole project.

```bash
npx degit "sveltejs/sapper-template#rollup" mon-blog
cd mon-blog
npm install
npm run dev
```

Simple as that and you are set with a running Sapper project. We use [degit](https://github.com/Rich-Harris/degit) to download and extract the `sapper-template` and select the `rollup` branch.

We end up with a default Sapper folder structure.

### Write your markdown / blog article
If we have a look at the generated folder structure we see a `src` folder which holds all of your applications code. To get up and running quickly I followed this [tutorial](https://www.mahmoudashraf.dev/blog/build-a-blog-with-svelte-and-markdown/) to setup the blog with the markdown feature.

I removed the `blog` folder and moved all the files one level up to the `routes` folder to flatten the hierarchy. For my later setup I'll go with a `blog.` subdomain so it'll be unnecessary to see `/blog` in the URL again. You can also delete the `_posts.js` file which is only there for demo purposes.

Add a new folder named `content` to the root of your project.
This will be the place for all your markdown files.

For markdown parsing and code highlighting you'll need three more dependencies.

```bash
npm install gray-matter highlight.js marked
```

Actually you need to change **two** files:

*src/routes/index.json.js -* get list of all blog articles

```javascript
// src/routes/index.json.js

import fs from "fs";
import path from "path";
import grayMatter from "gray-matter";

const getAllPosts = () =>
  fs.readdirSync("content").map(fileName => {
    const post = fs.readFileSync(path.resolve("content", fileName), "utf-8");
    return grayMatter(post).data;
  });

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  const posts = getAllPosts();
  res.end(JSON.stringify(posts));
}
```

*src/routes/[slug].json.js -* get details of blog article

```javascript
// src/routes/[slug].json.js

import path from "path";
import fs from "fs";
import grayMatter from "gray-matter";
import marked from "marked";
import hljs from "highlight.js";

const getPost = fileName => fs.readFileSync(
    path.resolve("content", `${fileName}.md`), "utf-8"
  );

export function get(req, res, next) {
  const { slug } = req.params;

  // get the markdown text
  const post = getPost(slug);

  // function that expose helpful callbacks
  // to manipulate the data before convert it into html
  const renderer = new marked.Renderer();

  // use hljs to highlight our blocks codes
  renderer.code = (source, lang) => {
    const { value: highlighted } = hljs.highlight(lang, source);
    return `<pre class='language-javascriptreact'>
      <code>${highlighted}</code>
    </pre>`;
  };

  const { data, content } = grayMatter(post);
  const html = marked(content, { renderer });

  if (html) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ html, ...data })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: `Not found` })
    );
  }
}
```

Go ahead and write your first markdown article :wink: and save it to the `content` folder.

In `components/Nav.svelte` I removed the *blog* navigation link.


### Decide where to host
Basically you can host the Svelte app on any service but I decided to go with Vercel for the time being as for later projects I used it already and the account is at hand.

But feel free to have a look at: netlify or github pages

### Finally deploy the whole thing
This step turned out to be pretty straightforward. First add a git repository to your github account or any other provider. Then import this repository in a new Vercel project.

One littel issue I had was the build command which you can configure. At the end I chose to `override` the default and use `sapper export`.

That's it for the first post here in this space, yay :smile:
