// Load list of posts for blog.html
async function loadPostList() {
  const listEl = document.getElementById("post-list");

  const res = await fetch("posts.json");
  const posts = await res.json();

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    card.innerHTML = `
      <a href="post.html?id=${post.id}">
        <h2>${post.title}</h2>
      </a>
      <div class="post-meta">${formatDate(post.date)} • ${post.tags.join(", ")}</div>
      <p class="post-excerpt">${post.excerpt}</p>
    `;

    listEl.appendChild(card);
  });
}

// Load a single post for post.html
async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  const res = await fetch("posts.json");
  const posts = await res.json();
  const post = posts.find(p => p.id === postId);

  if (!post) {
    document.getElementById("post-content").innerHTML = "<p>Post not found.</p>";
    return;
  }

  document.getElementById("post-title").textContent = post.title;
  document.getElementById("post-meta").textContent =
    `${formatDate(post.date)} • ${post.tags.join(", ")}`;

  const mdRes = await fetch(`posts/${post.id}.md`);
  const mdText = await mdRes.text();

  document.getElementById("post-content").innerHTML = marked.parse(mdText);
}

// Format date nicely
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
