import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Swipeout from '../../lib';

export default class SwipeoutDemo extends React.Component {
    option = {
        text: 'Cancel',
        style: {
            backgroundColor: '#ccc'
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <Swipeout style={styles.swipe} right={this.option}>
                    <Text>Swipe out from right to left</Text>
                </Swipeout>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
    },
    swipe: {
        height: 44,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});