# SimpliJS
SimpliJS is an experimental library that provides variable type checking and DOM manipulation. The original purpose of the library is to facilitate myself on developing web applications while allowing me to have more control on what I really need. Later with more research on different JavaScript-related topics I try to make the library cross-browser compatible and more generic.  
  
Please be reminded that this project is far away from mature enough to be used in a production project. While the type checking part is fully developed, the DOM manipulation module is still under experiment and is featureless. But you can expect that there will be more and more features to be added in the future. For now, please feel free to study my code and get those parts that you find it useful. If you find a bug please feel free to tell me as well. Your help to this project would be greatly appreciated.  
  
## Features
* Variable type checking
* Argument type checking
* DOM manipulation
* Cross-Browser Compatibility (Most browsers except Internet Explorer 6 or below)
  
## Installation
1. Extract the js folder and its content to your site directory  
2. add the following code inside the ```<head>``` section of the webpage.  
``` html
<script src="js/simpli.js" />
```  

## Usage 
A full API documentation can be found on [http://yuhlau.github.io/simplijs/doc/](http://yuhlau.github.io/simplijs/doc/). The current document is produced based on version 1.0.1. It guides you how to use the type checking functions and how to create a simpli DOM object.  
  
Moreover, you can also have a look to the unit test in the folder ```unitTest/``` or [Hosted Unit Test Page](http://yuhlau.github.io/simplijs/unitTest/). It can gives you some ideas on how those functions are used. Noted that IE7 or below will always fail test case 7 and 21 because they do not have HTMLDivElement and the querySelectorAll() is a polyfill, so they behave differently from the expected result. On the other hand, unit test of DOM manipulation is not available yet because most of the functions are still under experiment.  
  
## Browser Support
* Google Chrome (latest)
* Mozilla Firefox (latest)
* Apple Safari (latest)
* Microsoft Edge (latest)
* Internet Explorer (7+)
* Opera (Testing)
* Android Browser (latest)
* Google Chrome on Android (latest)
* Apple Safari on iOS (latest)
* Google Chrome on iOS (latest)
  
## History
* 29 Jan, 2016, Version 1.0.2
  * Update to version 1.0.2
  * Redesign simpli(...) functions binding mechanism
  * Add simpli.iterativeIsset()
  * Add simpli.inRange()
* 28 Jan, 2016, Version 1.0.1
  * Fix simpli.getClass() fails to recognize Window object because IE11 has different Window objects under "use strict" and non-strict environment
* 27 Jan, 2016, Version 1.0.0
  * First published
  
## License
Copyright (c) Lau Yu Hei  
Published under The MIT License (MIT)
