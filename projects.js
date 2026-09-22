// Edit this file to add, remove or change portfolio entries.
//
// Fields:
//   title       display name
//   url         optional external link (store page, build, repo, ...)
//   year        release year
//   meta        one line: engine · role (shown top-right of the card)
//   description plain text, one or two sentences
//   tags        strings used by the filter (clicking a tag filters)
//   media       optional array of images and/or clips, shown as a thumbnail
//               strip against the top of the card. Video items are shown
//               first with a play overlay, like a store listing.
//               { type: "image", src: "...", alt: "..." }
//               { type: "video", src: "...", poster: "...", alt: "..." }
//
//     poster is optional but recommended: a frame of the video shown until
//     it is opened. Drop media files in the ./media folder.

var PROJECTS = [
  {
    title: "Duskfall Protocol",
    url: "https://store.steampowered.com",
    year: "2024",
    meta: "Unity · Gameplay / Systems Lead",
    description:
      "Co-op extraction shooter. Owned the netcode-side respawn flow, the quest director, and the culling system that finally made 10,000 deployables playable on console.",
    tags: ["unity", "netcode", "multiplayer", "c#", "console"],
    media: [
      { type: "video", src: "media/duskfall-preview.mp4", poster: "media/duskfall-poster.png", alt: "Duskfall Protocol preview, 4 seconds" },
      { type: "image", src: "media/duskfall-1.svg", alt: "Duskfall Protocol screenshot, deployables" },
      { type: "image", src: "media/duskfall-2.svg", alt: "Duskfall Protocol screenshot, extraction" }
    ]
  },
  {
    title: "Emberline",
    url: "",
    year: "2022",
    meta: "Unity · Gameplay Engineer",
    description:
      "Isometric action RPG. Built the ability composer used by every character, and the input rework that let the combat feel survive on pad and keyboard simultaneously.",
    tags: ["unity", "combat", "ai", "c#"],
    media: [
      { type: "image", src: "media/emberline-1.svg", alt: "Emberline screenshot, ability composer" },
      { type: "image", src: "media/emberline-2.svg", alt: "Emberline screenshot, skill menu" }
    ]
  },
  {
    title: "Honorbound (working title)",
    url: "",
    year: "2020",
    meta: "Unreal Engine 4 · Engine Engineer",
    description:
      "Medieval PvP. Replaced the projectile prediction for siege weapons, wrote the replay/branching-scenario system, and kept the team honest about draw calls.",
    tags: ["unreal", "engine", "replication", "c++"],
    media: [
      { type: "image", src: "media/honour-1.svg", alt: "Honorbound screenshot, siege scene" },
      { type: "image", src: "media/honour-2.svg", alt: "Honorbound screenshot, battlefield" }
    ]
  },
  {
    title: "Pocket Ops",
    url: "",
    year: "2018",
    meta: "Unity · Co-Founder / Lead Engineer",
    description:
      "Turn-based tactics shipped with zero paid marketing; it carried the studio for two years. Owned the shader-stripped mobile renderer and the save sync.",
    tags: ["unity", "shaders", "mobile", "release", "c#"],
    media: [
      { type: "image", src: "media/pocketops-1.svg", alt: "Pocket Ops screenshot, grid tactics" },
      { type: "image", src: "media/pocketops-2.svg", alt: "Pocket Ops screenshot, mission briefing" }
    ]
  },
  {
    title: "Vendor, a simulation",
    url: "https://dareerahmadmufti.github.io/portfolio/",
    year: "2016",
    meta: "Unity · Solo project",
    description:
      "Small jam game about running an NPC shop. Won the studio jam, taught me that scope is a feature. Still the project I get emailed about most.",
    tags: ["unity", "simulation", "prototype", "solo"],
    media: [
      { type: "image", src: "media/vendor-1.svg", alt: "Vendor, simulation screenshot, shop floor" },
      { type: "image", src: "media/vendor-2.svg", alt: "Vendor, simulation screenshot, trading dialog" }
    ]
  }
];