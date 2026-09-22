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

  var lb = document.getElementById("lightbox");
  var lbStage = lb.querySelector(".lb-stage");
  var lbCap = lb.querySelector(".lb-cap");
  var lbPrev = lb.querySelector(".lb-prev");
  var lbNext = lb.querySelector(".lb-next");
  var lbClose = lb.querySelector(".lb-close");

  var gallery = [];
  var galleryIndex = 0;

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

  PROJECTS.forEach(function (p, i) {
    if (!p.title || !p.description) return;

    var li = document.createElement("li");
    li.className = "project";
    li.id = "project-" + i;

    var name = p.url ? '<a href="' + esc(p.url) + '">' + esc(p.title) + "</a>" : esc(p.title);

    var metaBits = [];
    if (p.meta) metaBits.push(esc(p.meta));
    if (p.year) metaBits.push('<time datetime="' + esc(p.year) + '">' + esc(p.year) + "</time>");
    var yearHtml = metaBits.join("<br>");

    var tagsHtml =
      '<div class="tags">' +
      p.tags
        .map(function (t) {
          return '<button type="button" class="tag" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
        })
        .join("") +
      "</div>";

    var mediaHtml = "";
    if (p.media && p.media.length) {
      p.media.forEach(function (m, mi) {
        if (m.type === "video") {
          mediaHtml +=
            '<button type="button" class="media-tile video-tile" data-media="' + i + ":" + mi + '" aria-label="Play ' + esc(m.alt || p.title) + '">' +
            '<img src="' + esc(m.poster || "") + '" alt="' + esc(m.alt || p.title) + '" loading="lazy">' +
            '<span class="play"><span class="tri"></span></span>' +
            (m.duration ? '<span class="dur">' + esc(m.duration) + "</span>" : "") +
            "</button>";
        } else {
          mediaHtml +=
            '<button type="button" class="media-tile" data-media="' + i + ":" + mi + '" aria-label="View ' + esc(m.alt || p.title) + '">' +
            '<img src="' + esc(m.src) + '" alt="' + esc(m.alt || p.title) + '" loading="lazy">' +
            "</button>";
        }
      });
      mediaHtml = '<div class="media-strip">' + mediaHtml + "</div>";
    }

    li.innerHTML =
      mediaHtml +
      '<div class="top">' +
      "<h3>" + name + "</h3>" +
      '<span class="year">' + yearHtml + "</span>" +
      "</div>" +
      '<div class="desc"><p>' + esc(p.description) + "</p></div>" +
      tagsHtml;

    li.querySelectorAll(".tag").forEach(function (btn) {
      btn.addEventListener("click", function () {
        active[btn.dataset.tag] = true;
        update();
      });
    });

    li.querySelectorAll(".media-tile").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parts = btn.dataset.media.split(":");
        var pi = +parts[0];
        var mi = +parts[1];
        gallery = (PROJECTS[pi].media || []).slice();
        galleryIndex = mi;
        openLightbox();
      });
    });

    listEl.appendChild(li);
  });

  // ---- lightbox ----

  function renderSlide() {
    var item = gallery[galleryIndex];
    lbStage.textContent = "";
    if (item.type === "video") {
      var v = document.createElement("video");
      v.src = item.src;
      if (item.poster) v.poster = item.poster;
      v.setAttribute("controls", "");
      v.setAttribute("playsinline", "");
      v.autoplay = true;
      lbStage.appendChild(v);
    } else {
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "";
      lbStage.appendChild(img);
    }
    var n = gallery.length;
    var idx = galleryIndex + 1;
    lbCap.textContent = item.alt || "";
    if (n > 1) lbCap.textContent += " \u2014 " + idx + " / " + n;
    lbCap.textContent = lbCap.textContent.trim();

    lbPrev.disabled = n === 1;
    lbNext.disabled = n === 1;
  }

  function openLightbox() {
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    renderSlide();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbStage.textContent = "";
    document.body.style.overflow = "";
  }

  function step(d) {
    galleryIndex = (galleryIndex + d + gallery.length) % gallery.length;
    renderSlide();
  }

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { step(-1); });
  lbNext.addEventListener("click", function () { step(1); });

  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  // ---- filtering ----

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
      if (!li) return;
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