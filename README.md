# React Native Swipeout
The iOS-style Swipeout component, implement with javascript, running on iOS and Android. High performance, interactive, and configurable.

<img src="https://github.com/SmallComfort/rn-swipe-out/blob/master/example/img/android.gif" width="350"/>

## Installation
```
npm install rn-swipe-out --save
```

## Usage
```
import React from 'react';

import {
    Text,
    StyleSheet
} from 'react-native';

import Swipeout from 'rn-swipe-out';

export default class SwipeoutDemo extends React.Component {
    option = {
        text: 'Cancel',
        style: {
            backgroundColor: '#ccc'
        }
    };
    render() {
        return (
            <Swipeout style={styles.swipe} right={this.option}>
                <Text>Swipe out from right to left</Text>
            </Swipeout>
        );
    }
}

const styles = StyleSheet.create({
    swipe: {
        height: 44
    }
});
```
underlayColor: React.PropTypes.string,
    activeOpacity: React.PropTypes.number,
## Props
Prop | Default | Type | Description
-----|---------|------|------------
style | {} | View.propTypes.style | Styling Swipeout, you can treat it as a View.
left | [] | Object/Array | The configuration on the left, [more info](#the-configuration-for-the-left-and-right).
right | [] | Object/Array | The configuration on the right, [more info](#the-configuration-for-the-left-and-right).
onPress | emptyFn | Function | Called when the touch is released, but not if cancelled (e.g. by a scroll that steals the responder lock).
onPressIn | emptyFn | Function | Called when the touch is started.
onPressOut | emptyFn | Function | Called when the touch is released.
onLongPress | emptyFn | Function | Called when the touch is continued more than 500ms.
onOpen | emptyFn | Function | Called when the option is swipe out.
onClose | emptyFn | Function | Called when the option is close.
underlayColor | '' | String | The color of the underlay that will show through when the touch is active.
activeOpacity | 1 | Number | Determines what the opacity of the wrapped view should be when touch is active.
optionWidth | 64 | Number | The single option's width, decided the swipe out options size.
snapVelocity | 0.3 | Number | The minimum guesture velocity to perform animation.
actionThreshold | 0.5 | Number | The minimum distance to swipe out option. If value <= 1, distance = actionThreshold * optionWidth * options.length, if value > 1, distance = actionThreshold
useNativeDriver | true | Boolean | In react-native 0.40+, Swipeout setting its true to improve performance, and you can set false to prevent it. That's ok if you set it false, because even without this addition, Swipeout can also get a high performance.

### The configuration for the left and right
- **`text`** _(String/Number)_ Option's text
- **`style`** _(Text.propTypes.style) Option's style
- **`onPress`** _(Function)_ Called when the touch is released, but not if cancelled (e.g. by a scroll that steals the responder lock).
- **`onPressIn`** _(Function)_ Called when the touch is started.
- **`onPressOut`** _(Function)_ Called when the touch is released.
- **`underlayColor`** _(String)_ The color of the underlay that will show through when the touch is active.
- **`activeOpacity`** _(Number)_ Determines what the opacity of the wrapped view should be when touch is active.
- **`onLongPress`** _(Function)_ Called when the touch is continued more than 500ms.
- **`component`** _(Function)_ If the default option unable to meet your demand, you can set a custom component for Swipeout. Be careful once set a custom component, the option's click event will not close itself (Gesture to close can always work). So you have to hide it to execute a `hide` function. Swipeout seen `component` as a React Stateless Component and passing two useful props, which inner the source is ` <option.component hide={this.hide} animatedValue={this.panAnim} />`. In your component you can use `this.props.hide()` to close option. `animatedValue` is a `Animated.Value` instance which hold the Swipeout animation value, you can use to get some interactive animation. see the example to get more info.

## Example
[Basic Use](https://github.com/SmallComfort/rn-swipe-out/blob/master/example/basic)

[Complete Example](https://github.com/SmallComfort/rn-swipe-out/blob/master/example/complete)

---

**MIT Licensed**
