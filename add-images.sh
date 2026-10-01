#!/usr/bin/env bash
# Copy, rename and web-optimise images into the slots this site expects.
# macOS only — uses the built-in `sips`. No installs needed.
#
#   ./add-images.sh paintings  ~/Desktop/my-paintings
#   ./add-images.sh photography ~/Desktop/my-photos
#   ./add-images.sh hero       ~/Desktop/best-painting.jpg
#   ./add-images.sh portrait   ~/Desktop/me.jpg
#
# Images are sorted by filename, so name your source files 01-..., 02-... to
# control the order they appear on the site.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAX_EDGE=2000          # longest side for gallery images
HERO_EDGE=2600         # longest side for the hero image

usage() { sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 1; }
[[ $# -lt 2 ]] && usage

KIND="$1"; SRC="$2"

optimise() {  # optimise <src> <dest> <max-edge>
  local src="$1" dest="$2" edge="$3"
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  sips --resampleHeightWidthMax "$edge" "$dest" >/dev/null
  sips -s format jpeg -s formatOptions 82 "$dest" --out "$dest" >/dev/null
  printf '  %-44s %s\n' "$(basename "$src")" "→ ${dest#"$HERE"/}"
}

case "$KIND" in
  paintings|photography)
    [[ -d "$SRC" ]] || { echo "Not a directory: $SRC" >&2; exit 1; }
    prefix=$([[ "$KIND" == paintings ]] && echo painting || echo photo)
    n=0
    while IFS= read -r f; do
      n=$((n + 1))
      optimise "$f" "$HERE/images/$KIND/$(printf '%s-%02d.jpg' "$prefix" "$n")" "$MAX_EDGE"
    done < <(find "$SRC" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' -o -iname '*.tif' -o -iname '*.tiff' \) | sort)
    echo "Done — $n image(s) into images/$KIND/"
    echo "Now edit the titles/sizes in $KIND.html (and index.html for the featured ones)."
    ;;
  hero)
    [[ -f "$SRC" ]] || { echo "Not a file: $SRC" >&2; exit 1; }
    optimise "$SRC" "$HERE/images/hero/hero.jpg" "$HERO_EDGE"
    ;;
  portrait)
    [[ -f "$SRC" ]] || { echo "Not a file: $SRC" >&2; exit 1; }
    optimise "$SRC" "$HERE/images/portrait.jpg" "$MAX_EDGE"
    ;;
  *) usage ;;
esac
