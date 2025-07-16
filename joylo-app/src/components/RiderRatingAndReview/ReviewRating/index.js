import React from 'react';
import { View, Pressable, Image } from 'react-native';
import styles from './styles';
import TextDefault from '@/src/components/Text/TextDefault/TextDefault';


const emojis = [
    { src: require('../../../../assets/horrible.png'), label: 'Horrible' },
    { src: require('../../../../assets/bad.png'), label: 'Bad' },
    { src: require('../../../../assets/meh.png'), label: 'Meh' },
    { src: require('../../../../assets/good.png'), label: 'Good' },
    { src: require('../../../../assets/awesome.png'), label: 'Awesome' },
];

export default function ReviewRating({ selected, onSelect }) {
    return (
        <View style={styles.row}>
            {emojis.map((item, idx) => (
                <Pressable key={idx} onPress={() => onSelect(idx + 1)} style={styles.item}>
                    <View style={[styles.circle, selected === idx + 1 && styles.circleSelected]}>
                        <Image source={item.src} style={styles.emoji} />
                    </View>
                    <TextDefault style={styles.label}>{item.label}</TextDefault>
                </Pressable>
            ))}
        </View>
    );
}