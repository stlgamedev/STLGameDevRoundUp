#!/bin/bash
# Subset Noto Color Emoji to only include the emojis used in the site

# Install pyftsubset if not already installed
pip install fonttools brotli zopfli > /dev/null 2>&1

# Emojis used in the site (including ZWJ sequences)
EMOJI_LIST="🎮🎼🧑‍💻📢📚🕹️📆🎯🎨🎭🎪🎬🎤🎧🎵🎶🎸🎹🎺🎻🥁🏗️👯🫙🗣️🧪📖✌️"

# Subset the font
pyftsubset static/fonts/NotoColorEmoji-Regular.ttf \
    --text="$EMOJI_LIST" \
    --flavor=woff2 \
    --output-file=static/fonts/NotoColorEmoji-Subset.woff2

echo "Created subset: static/fonts/NotoColorEmoji-Subset.woff2"
ls -lh static/fonts/NotoColorEmoji-Subset.woff2
