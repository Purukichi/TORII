/* Product / artist gate data.
   Each product has a list of "gates": (service, handle, profile URL).
   To unlock the product, every gate must be marked followed.
   `kind` controls the cover glyph.  `c1`/`c2` are gradient colors. */
window.PGATE_DATA = [
  {
    id: "p01",
    kind: "music",
    c1: "#ff6a3d", c2: "#7b2cbf",
    reward: "https://example.com/downloads/p01.zip",
    gates: [
      { svc: "x",  handle: "AuroraBeats",   url: "https://x.com/AuroraBeats",   ac1:"#ff6a3d", ac2:"#7b2cbf" },
      { svc: "yt", handle: "@AuroraBeats",  url: "https://youtube.com/@AuroraBeats", ac1:"#ff6a3d", ac2:"#7b2cbf" }
    ]
  },
  {
    id: "p02",
    kind: "art",
    c1: "#4cc9f0", c2: "#3a0ca3",
    reward: "https://example.com/downloads/p02.zip",
    gates: [
      { svc: "x",  handle: "NoxStudio",     url: "https://x.com/NoxStudio",     ac1:"#4cc9f0", ac2:"#3a0ca3" },
      { svc: "ig", handle: "noxstudio",     url: "https://instagram.com/noxstudio", ac1:"#4cc9f0", ac2:"#3a0ca3" },
      { svc: "yt", handle: "@NoxStudio",    url: "https://youtube.com/@NoxStudio",  ac1:"#4cc9f0", ac2:"#3a0ca3" }
    ]
  },
  {
    id: "p03",
    kind: "video",
    c1: "#ffb703", c2: "#fb5607",
    reward: "https://example.com/downloads/p03.mp4",
    gates: [
      { svc: "yt", handle: "@SunsetCine",   url: "https://youtube.com/@SunsetCine", ac1:"#ffb703", ac2:"#fb5607" }
    ]
  },
  {
    id: "p04",
    kind: "music",
    c1: "#06d6a0", c2: "#118ab2",
    reward: "https://example.com/downloads/p04.zip",
    gates: [
      { svc: "x",  handle: "TideAndCurrent", url: "https://x.com/TideAndCurrent", ac1:"#06d6a0", ac2:"#118ab2" },
      { svc: "yt", handle: "@Tide",          url: "https://youtube.com/@Tide",     ac1:"#06d6a0", ac2:"#118ab2" },
      { svc: "tt", handle: "@tide.current",  url: "https://tiktok.com/@tide.current", ac1:"#06d6a0", ac2:"#118ab2" }
    ]
  },
  {
    id: "p05",
    kind: "data",
    c1: "#8338ec", c2: "#3a86ff",
    reward: "https://example.com/downloads/p05.csv",
    gates: [
      { svc: "x",  handle: "DataLoom",       url: "https://x.com/DataLoom",       ac1:"#8338ec", ac2:"#3a86ff" }
    ]
  },
  {
    id: "p06",
    kind: "art",
    c1: "#ef476f", c2: "#ffd166",
    reward: "https://example.com/downloads/p06.zip",
    gates: [
      { svc: "ig", handle: "kohaku.art",     url: "https://instagram.com/kohaku.art", ac1:"#ef476f", ac2:"#ffd166" },
      { svc: "x",  handle: "kohaku_art",     url: "https://x.com/kohaku_art",     ac1:"#ef476f", ac2:"#ffd166" }
    ]
  },
  {
    id: "p07",
    kind: "music",
    c1: "#22223b", c2: "#9a8c98",
    reward: "https://example.com/downloads/p07.zip",
    gates: [
      { svc: "x",  handle: "MonoEcho",       url: "https://x.com/MonoEcho",       ac1:"#22223b", ac2:"#9a8c98" },
      { svc: "yt", handle: "@MonoEcho",      url: "https://youtube.com/@MonoEcho", ac1:"#22223b", ac2:"#9a8c98" },
      { svc: "ig", handle: "mono.echo",      url: "https://instagram.com/mono.echo", ac1:"#22223b", ac2:"#9a8c98" },
      { svc: "tt", handle: "@mono.echo",     url: "https://tiktok.com/@mono.echo", ac1:"#22223b", ac2:"#9a8c98" }
    ]
  },
  {
    id: "p08",
    kind: "video",
    c1: "#000814", c2: "#ffd60a",
    reward: "https://example.com/downloads/p08.mp4",
    gates: [
      { svc: "yt", handle: "@CrimsonFrame",  url: "https://youtube.com/@CrimsonFrame", ac1:"#000814", ac2:"#ffd60a" },
      { svc: "x",  handle: "CrimsonFrame",   url: "https://x.com/CrimsonFrame",        ac1:"#000814", ac2:"#ffd60a" }
    ]
  }
];
