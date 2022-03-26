# railroad-ink
My JS-based implementation of the roll-and-write game Railroad Ink, by Horrible Guild.

A couple years ago, my wife and I were very much into playing Railroad Ink, a fun little roll-and-write board game that you should absolutely buy if any of those words sound good to you. I was also trying to re-learn some basics of front-end web application development, including more sophisticated JavaScript than I'd tried before.

This sloppy, amateur but functional web app came about as a result. The UI is relatively, uh, let's say spartan, but the aim was to make the game as playable as possible on desktop, mobile, and tablet layouts. No art assets from the actual game are used; I originally toyed with using CSS to draw the tiles but quickly gave up as it was beyond my skills and went with some mini-tiles for the roads and rails instead, which are used to "build" the larger tiles that compose the playing pieces of the game.

Lots of things in this app were firsts for me, which is almost certainly why the code implementation may read to more experienced eyes as functional at best. I'm quite proud of having seen this through, though, and just noticed I'd never probably placed it in a repo, so here it is.

## How to play

This tiny web app is deployed here: https://railroad.kybard.com

Or you can just download the code and fire up the index.html on your browser of choice (I make no promises that it works well in anything other than Chrome).

## Improvements/Features to add

I consider this "done" in the sense that I stretched the limits of what I was capable of building. But there are some things I think would be cool to see added, including:
- Rulesets for some of the now-plentiful expansion sets
- Better, prettier UI
- More dynamic, "game-y" methods for selecting, rotating, unselecting tiles
- "Take a screenshot" functionality for capturing your prized transit system(s)
- Leaderboards! (Probably something that would require more than just HTML/CSS/JS, eh?)
