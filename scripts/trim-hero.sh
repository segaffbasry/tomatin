#!/bin/sh
# Turns the downloaded brand film into the hero loop: drops the near-black first 4.2s and the audio, fades in over 0.5s,
# and cuts a poster from the first lit frame. Needs ffmpeg.
set -e
cd "$(dirname "$0")/.."
ffmpeg -loglevel error -y -ss 4.2 -i public/media/hero/hero-original.mp4 -an -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart -vf "fade=t=in:st=0:d=0.5" public/media/hero/hero.mp4
ffmpeg -loglevel error -y -ss 1.8 -i public/media/hero/hero.mp4 -frames:v 1 -q:v 3 public/media/hero/poster.jpg
