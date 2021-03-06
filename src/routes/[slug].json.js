// src/routes/blog/[slug].json.js

import path from "path";
import fs from "fs";
import grayMatter from "gray-matter";
import marked from "marked";
import hljs from "highlight.js";

const getPost = fileName =>
  fs.readFileSync(path.resolve("content", `${fileName}.md`), "utf-8");

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
    return `<pre class='language-javascriptreact'><code>${highlighted}</code></pre>`;
  };

  renderer.paragraph = (text) => {
    const smileys = [':smile:',':wink:']
    const images  = ['😊','😉']

    for (var i = 0; i < smileys.length; i++) {
       text = text.replace(smileys[i], images[i])
    }

    return '<p>' + text + '</p>';
  }

  // parse the md to get front matter
  // and the content without escaping characters
  const { data, content } = grayMatter(post);

  const html = marked(content, { renderer });

  if (html) {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({ html, ...data }));
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json"
    });

    res.end(
      JSON.stringify({
        message: `Not found`
      })
    );
  }
}
