
# Furkot Trip Planner Widget

  Embed [Furkot] trip planner widget on your website and give your visitors easy way to add your places to their trips.

## Installation

  Install with [component(1)](http://component.io):

    $ component install furkot/trip-planner

## API

  [Furkot] trip planner widget displays trip itineraries and supports adding places from any website.

  The guide to integration options is [here][help].

### auto discovery

If elements executing HTTP GET or POST to Furkot (anchors or forms linking to `https://trips.furkot.com/trip`) exist on a page when its document is ready, they will be automatically discovered and modified to activate [Furkot] trip planner widget instead of redirecting to [Furkot].

### .plan(stops)

Dynamic alternative to auto discovery. Activates [Furkot] trip planner widget that allows user to to adds stops to an existing trip or a new trip.

`stops` is an `Array` of objects with `name`, `description`, `coordinates` (lat, lon), `address`, `url` and
`duration` (in milliseconds). Only `name` and `coordinates` (or `address` in absence of `coordinates`) are required.

```javascript
var tripPlanner = require('trip-planner');
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
var planner = tripPlanner();

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
