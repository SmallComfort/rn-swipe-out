import React, { Component } from 'react';
import {
	StyleSheet,
    Animated
} from 'react-native';

import CustomOption from './CustomOption';

class CustomOptionAnimated extends Component {
    render() {
        return (
            <Animated.View style={[styles.container, {
                opacity: this.props.animatedValue.interpolate({
                    inputRange: [-80, 0],
                    outputRange: [1, 0],
                })
            }]}>
                <CustomOption {...this.props}/>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

export default CustomOptionAnimated;