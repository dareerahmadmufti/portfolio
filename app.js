(function () {
  "use strict";

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  var listEl = document.getElementById("project-list");
  var filtersEl = document.getElementById("filters");
  var countEl = document.getElementById("result-count");
  var emptyEl = document.getElementById("empty");

  var active = {}; // tag -> true while selected
  var tagCounts = {};

  PROJECTS.forEach(function (p) {
    p.tags.forEach(function (t) {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  var allTags = Object.keys(tagCounts).sort(function (a, b) {
    return tagCounts[b] - tagCounts[a] || a.localeCompare(b);
  });

  // ---- filters ----

  allTags.forEach(function (tag) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.dataset.tag = tag;
    btn.textContent = tag + " (" + tagCounts[tag] + ")";
    btn.addEventListener("click", function () {
      if (active[tag]) {
        delete active[tag];
      } else {
        active[tag] = true;
      }
      update();
    });
    filtersEl.appendChild(btn);
  });

  // ---- project cards ----

  PROJECTS.forEach(function (p) {
    if (!p.title || !p.description) return;

    var li = document.createElement("li");
    li.className = "project";
    li.id = "project-" + PROJECTS.indexOf(p);

    var name = p.url ? '<a href="' + esc(p.url) + '">' + esc(p.title) + "</a>" : esc(p.title);

    var metaBits = [];
    if (p.meta) metaBits.push(esc(p.meta));
    if (p.year) metaBits.push('<time datetime="' + esc(p.year) + '">' + esc(p.year) + "</time>");
    var yearHtml = metaBits.join("<br>");

    li.innerHTML =
      '<div class="top">' +
        "<h3>" + name + "</h3>" +
        '<span class="year">' + yearHtml + "</span>" +
      "</div>" +
      '<div class="desc"><p>' + esc(p.description) + "</p></div>" +
      '<div class="tags">' +
        p.tags
          .map(function (t) {
            return '<button type="button" class="tag" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
          })
          .join("") +
      "</div>";

    li.querySelectorAll(".tag").forEach(function (btn) {
      btn.addEventListener("click", function () {
        active[btn.dataset.tag] = true;
        update();
      });
    });

    listEl.appendChild(li);
  });

  // ---- update ----

  function projectHasAny(p) {
    var keys = Object.keys(active);
    if (!keys.length) return true;
    return keys.some(function (t) {
      return p.tags.indexOf(t) !== -1;
    });
  }

  function update() {
    var shown = 0;

    filtersEl.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.classList.toggle("active", !!active[btn.dataset.tag]);
    });

    PROJECTS.forEach(function (p, i) {
      var li = document.getElementById("project-" + i);
      var visible = projectHasAny(p);
      li.classList.toggle("hidden", !visible);
      li.classList.toggle("filtered", !!Object.keys(active).length);
      li.querySelectorAll(".tag").forEach(function (btn) {
        btn.classList.toggle("selected-in-project-list", !!active[btn.dataset.tag]);
      });
      if (visible) shown++;
    });

    countEl.textContent = shown === PROJECTS.length ? "" : shown + " of " + PROJECTS.length + " projects";
    emptyEl.hidden = shown !== 0;
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  update();
})();