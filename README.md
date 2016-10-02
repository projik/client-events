#client-events

Developer friendly client interaction events for Meteorjs

### Installation

```sh
meteor add supaseca:client-events
```

### Events

This package makes it easy to access the following events from a Meteor application.

* swipeleft
* swiperight
* touch
* longpress
* tap
* pinch
* drag
* drop

### Usage

Events are handled in the same way as the standard 'click' event. E.g.

```
Template.myScreen.events({
  'swiperight .panel': function(e) {
    e.preventDefault();
    // go to the next page
    Router.go('/screen-two');
});
```

### Acknowledgements

This package is a modified version of the clent-events package found at [https://github.com/ol-c/meteor-packages](https://github.com/ol-c/meteor-packages)
