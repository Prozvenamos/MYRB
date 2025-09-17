# MYRB (Minimal YouTube Recommendation Blocker)
! Code written with the help of AI.

Simple extension that removes recommendations on YouTube:
- Recommendations on the homepage
- Related videos in the sidebar while watching
- Pop-up videos at the end of a video
- Does not play video and sound of ads; plays background music (you can use your own audio file by renaming it to "not" with the .mp3 extension); to disable audio looping, in the file **content.js** on line 31 (`notificationSound.loop =`), replace `true` with `false`


## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `MYRB_version` folder
