import React, { Component } from 'react';
import {
	StyleSheet,
    View,
	Text,
} from 'react-native';

import Swipeout from '../../lib';

class CustomOption extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Swipeout.Touchable style={[styles.option, styles.delete]} onPress={this.props.onPressDelete}>
                    <Text style={styles.text}>Delete</Text>
                </Swipeout.Touchable>
                <Swipeout.Touchable style={[styles.option, styles.cancel]} onPress={this.props.hide}>
                    <Text style={styles.text}>Cancel</Text>
                </Swipeout.Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delete: {
        backgroundColor: 'red'
    },
    cancel: {
        backgroundColor: '#ccc'
    },
    text: {
        color: '#fff'
    }
});

export default CustomOption;