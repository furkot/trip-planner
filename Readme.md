[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

# Furkot Trip Planner Widget

  Embed [Furkot] trip planner widget on your website and give your visitors easy way to add your places to their trips.

## Installation

  Install with [npm]:

    $ npm install --save trip-planner

  Install with [component]:

    $ component install furkot/trip-planner

  Load with a standalone script:

```html
<script src="https://cdn.furkot.com/scripts/furkot-trip-planner.min.js" defer></script>
```

## API

  [Furkot] trip planner widget displays trip itineraries and supports adding places from any website.

  The guide to integration options is [here][help].

### initialization

  When used with a module bundling framework like [browserify] and [component]:

```javascript
var furkotTripPlanner = require('trip-planner');
```

  When loaded as a standalone, the script instantiates the global variable `furkotTripPlaner`.

### auto discovery

  If elements executing HTTP GET or POST to Furkot (anchors or forms linking to `https://trips.furkot.com/trip`) or elements [annotated with microdata][furkot-microdata] exist on a page when its document is ready, they will be automatically discovered and modified to activate [Furkot] trip planner widget upon click instead of redirecting to [Furkot].

  When loaded as a stanalone script, nothing further needs to be done. In case of a bundling framework, just invoking `require` is sufficient to perform the auto discovery.
  
### dynamically added elements

  If more elements are added dynamically to the page, they can be discovered and modified to activate [Furkot] trip planner widget upon click by triggering the discovery process:
  
```javascript
var container = ... // container with elements to activate the widget on click

furkotTripPlanner(container);
```

The `container` is a single DOM element that contains dynamically added elements. It can be the `document` to process the entire page. The elements that are already discovered and modified are ignored.

### activate widget programmatically

Instead of using DOM elements to pass parameters, it is possible to activate [Furkot] trip planner widget programmatically by invoking the `.plan(stops)` method passing stops to be added to visitor's trip. `stops` is an `Array` of objects with `name`, `description`, `coordinates` (lat, lon), `address`, `url` and `duration` (in milliseconds). Only `name` and `coordinates` (or `address` in absence of `coordinates`) are required.

```javascript
var planner = furkotTripPlanner();

var stops = [{
  name: 'Time Square',
  coordinates: {
    lat: 40.7577,
    lon: -73.9857
  }
}, {
  name: 'Metropolitan Museum',
  coordinates: {
    lat: 40.7789,
    lon: -73.9637
  }
}];

planner.plan(stops);
```

See how it works with [Nooreq].

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

[Furkot]: https://trips.furkot.com
[help]: http://help.furkot.com/widgets/integrated-trip-planner.html
[Nooreq]: http://nooreq.com
[component]: https://github.com/componentjs/component
[npm]: https://www.npmjs.com/
[browserify]: http://browserify.org/
[furkot-microdata]: https://github.com/furkot/plan-microdata

[npm-image]: https://img.shields.io/npm/v/trip-planner.svg
[npm-url]: https://npmjs.org/package/trip-planner

[travis-url]: https://travis-ci.org/furkot/trip-planner
[travis-image]: https://img.shields.io/travis/furkot/trip-planner.svg
