import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	ScrollView
} from 'react-native';

import Swipeout from '../../lib';
import options from './options';

export default class SwipeoutDemo extends Component {

    state = {
        options: options.apply(this)
    };

	render() {
		return (
			<ScrollView style={styles.container}>
				{this.state.options.map(v => {
					return (
						<Swipeout key={v.key} {...v}>
							<Text style={styles.text}>{v.key}</Text>
						</Swipeout>
					);
				})}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 48
	},
    text: {
        marginLeft: 16
    }
});