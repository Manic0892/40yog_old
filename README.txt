Sean McGeer -- V00732065

Final CSc 205 Project - HistoBreaker

I got the idea for this project from hearing about the concept as it had been executed by a previous student of CSc 205.  I wanted to try it, but do it in HTML5, as I think HTML5 is the future, and underused for image processing.

I did this by myself.

Requirements for running:

PHP -- While not absolutely required, you need PHP in order to run the thign that fetches images from any inputted URL.

The application is running at http://histobreaker.seanmcgeer.com.  Everything, including the development notes below, is available there.


This is the first game I've tried making a game in HTML5.  I like web apps--they're pretty universal, meaning you can reach a wider audience then you can with platform-specific applications.  However, prior to HTML5, Flash was the only option for realtime web apps.  Flash does what it does pretty well, but I've long been excited abou the idea of running realtime apps natively in the browser.  This was an exploratory experience, and I'm going to mention a couple of things.
First of all, there were no free Javascript libraries that both enabled efficient real-time gameplay and allowed deeper manipulation of the basic elements.  I tried a few, and while you could make games in them, none of them let you manipulate the canvas--something that was absolutely crucial for any image processing.  On the other hand, the basic HTML canvas 2d context (what you use for image processing and game creation) is fairly primitive in how you access it.  I used an abstraction library called <a href="http://kineticjs.com/">KineticJS</a>, which made it simpler to draw and manipulate the gameplay elements (paddle, powerups, etc.).  However, this was more a layer on top of the basic canvas than a transformation of same, meaning I could still access it to do basic image processing operations.
Unfortunately, KineticJS was not supposed to be used for gaming on its own.  It doesn't redraw automatically.  I used a redraw() method and set a window interval to call that method every 30 milliseconds to enable smooth gameplay.  This is the kind of thing that Flash does automatically, but which wasn't done in any libraries that met my requirments.
Another issue was hit testing.  Flash's hit testing is extremely fast and easy to use, and some Javascript libraries have good hit testing.  KineticJS actually has its own hit testing method, .getIntersections().  However, at the rate I was redrawing the game (30 ms) and the number of elements on the screen, .getIntersections was choking the framerate.  Sometimes it would get as bad as 1fps.  This was clearly not acceptable.  I ended up writing my own optimized hit testing method which avoided querying every object on every hit test.  This allowed smooth gameplay without hittesting lag, even with hundreds of elements.
Despite putting my best efforts into this project, there are some issues.  I will do my best to enumerate them and explain why they occurred.</p>
The Level - The grayscale spectrum has 256 separate values.  I tried experimenting with fitting all 256 values in the level, but unless the user has a movie theater to play the game on, the game wouldn't be playable--either it would be too wide or the bricks would be too small.  In order to compensate, I had each brick represent 8 values.  This means that when you hit a brick of value 8, you're affecting the histogram at indices 64-71.
I also couldn't fit all the values on the vertical scale.  For sufficiently large images, the values of the histogram might be in the thousands.  In order to contain the vertical size of the histogram and make a playable level, there's a maximum of 20 bricks per horizontal index.  Each brick has a value--this value is how much it symbolizes on the histogram.  Because of  trying to fit the histogram onto a playable surface, the values of bricks on separate horizontal indices might vary wildly.  Furhtermore, the value of each brick is determined by the peak of the range of images.  That means, for a histogram containing histo[64] = 2, histo[65] = 10, histo[66] = 9279273, the value set to the brick would be determined from 9279273.
The upshot of all this is that sometimes the image behaves counterintuitively when you destroy blocks.  Some blocks might have little to no effect--there might have been very few pixels with that value in the original image, and so the modification has little affect too.  However, other blocks might be incredibly weighty, and so destroying them will change the image a lot.
There might be better ways to accomplish the level creation and histogram modification based on the changing level.  I don't know.  I do know that this works in a way that exemplifies histogram modification without sacrificing gameplay.  There are certainly better tools to perform histogram modification that are more precise.  I can only hope that this is more fun.


1) HistoBreaker

2) Plan of Action including a paper-prototype (GUI, options, Timeline, etc.)

3) Current approaches/background (from a paper, idea out of blue, current app); has this idea been done before? How is your different?

4) Success Criteria: how will you know when you are done (test images?) Provide a point distribution for grading;

5) If you choose to deviate from QT, you must explain why
(Projects must be done in C++ unless approved by Dr. Gooch)

6) Group or individual