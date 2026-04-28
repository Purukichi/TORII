/* P-GATE — items
 *
 * Drop your PNGs into ./assets/ with the filenames referenced below.
 * For each item:
 *   - cover: image used as the gallery thumbnail and modal cover
 *   - files: list of downloadable assets (revealed once all gates pass)
 *   - gates: every gate must be cleared to unlock the files
 */
window.PGATE_DATA = [
  {
    id: "wenxiang",
    title: "WEN XIANG",
    cover: "assets/05.png",
    files: [
      { src: "assets/01.png", label: "01 / 16:9",  size: "16:9"  },
      { src: "assets/02.png", label: "02 / 16:9",  size: "16:9"  },
      { src: "assets/03.png", label: "03 / 21:9",  size: "21:9"  },
      { src: "assets/04.png", label: "04 / 9:21",  size: "9:21"  },
      { src: "assets/05.png", label: "05 / 1:1",   size: "1:1"   }
    ],
    gates: [
      { svc: "x",  handle: "@Purukichi3",  url: "https://x.com/Purukichi3"        },
      { svc: "x",  handle: "@kakyoin_gr",  url: "https://x.com/kakyoin_gr"        },
      { svc: "yt", handle: "@Purukichi3",  url: "https://www.youtube.com/@Purukichi3" },
      { svc: "yt", handle: "@kakyoin_grp", url: "https://www.youtube.com/@kakyoin_grp" }
    ]
  }
];
