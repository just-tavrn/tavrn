# Screenshots

The PNG files here are the pictures of the website's screenshot pipeline, scaled to half their size: desktop views
1440×900, phone views 390×844. The gallery is [docs/screenshots.md](../../docs/screenshots.md).

They are made by `shots/make.ts` in [tavrn-website](https://github.com/just-tavrn/tavrn-website), a Playwright script
that drives the web client of a local development node. Five fictitious demo accounts (Mira Okafor, Jonas Berg, Lena
Park, Theo Laurent, Kai Brennan) meet in the room "Night Owls Gaming"; everything shown is created by the script, the
node's domain is `localhost`, all other addresses use the reserved `.example` domain. The avatars, room icons, the arena
map, the camera picture and the shared screen are illustrations (CC-BY-4.0, fictitious) from the website's `shots/assets/`.

## Making them again

Run the website's pipeline (`shots/run.sh`, see `shots/README.md` there) against a current node and web client; it
writes the full-size pictures (2880×1800 and 780×1688) and a manifest with every alt text and caption. Copy the ten
pictures of the gallery here at half their size, for example with ImageMagick:

```sh
for f in admin-desktop chat-desktop chat-phone consent-desktop files-desktop roles-desktop \
         search-desktop security-desktop voice-desktop voice-phone; do
  convert "$WEBSITE/shots/out/$f.png" -filter Lanczos -resize 50% -strip "assets/screenshots/$f.png"
done
```

Keep each file under 450 KB (a palette PNG, as `pngquant` or sharp's `palette` option produces it, is usually enough),
and keep the captions in `docs/screenshots.md` in line with the website's manifest.

The screenshots are CC-BY-4.0 like the other documents of this repository; the tavrn logo visible in them stays
a trademark of the project ([TRADEMARK.md](../../TRADEMARK.md)).
