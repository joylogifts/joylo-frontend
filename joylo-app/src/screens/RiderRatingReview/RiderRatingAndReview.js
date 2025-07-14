import TextDefault from '@/src/components/Text/TextDefault/TextDefault';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react'
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, View } from 'react-native';
import { Image } from 'react-native';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { createRiderReview } from '@/src/apollo/mutations';
import LowRatingModal from '@/src/components/RiderRatingAndReview/LowRatingModal';
import ReviewRating from '@/src/components/RiderRatingAndReview/ReviewRating';
import { useLanguage } from '@/src/context/Language';

const CREATE_RIDER_REVIEW = gql`
  ${createRiderReview}
`;

function RiderRatingAndReview(props) {
    const propsData = props?.route?.params || {};
    const [rating, setRating] = useState(0);
    const [showLowRatingModal, setShowLowRatingModal] = useState(false);
    const navigation = useNavigation();
    const { getTranslation } = useLanguage();

    const [createRiderReview, { loading: creatingReviewLoading }] = useMutation(CREATE_RIDER_REVIEW, {
        onCompleted: (data) => {
            setShowLowRatingModal(false);
            console.log('Review created:', data.createRiderReview);
            // You can show a success message or modal here
            alert(getTranslation("review_created_successfully"));
            navigation.goBack();
        },
        onError: (error) => {
            setShowLowRatingModal(false);
            console.error('Error creating review:', error);
            // You can show an error message here
            alert(getTranslation('error_creating_review') + (error.message || 'Unknown error'));
            navigation.goBack();
        }
    });



    const handleNext = () => {
        if (rating <= 2) {
            setShowLowRatingModal(true);
            // navigation.navigate('NegativeFeedback');
        } else {
            navigation.navigate('RateAndReviewRiderDetail', propsData);
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <TextDefault style={styles.skip} >
                        {getTranslation("skip")}
                    </TextDefault>
                </Pressable>
            </View>

            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../../assets/rider.png')} style={styles.avatar} />
                </View>
                <TextDefault style={styles.name}>
                    {propsData?.riderName || ''}
                </TextDefault>
                <TextDefault style={styles.title} H2>
                    {getTranslation("how_was_the_riders_behavior")}
                </TextDefault>
                <TextDefault style={styles.subtitle}>
                    {getTranslation("whether_its_good_or_bad_lets_talk_about_it")}
                </TextDefault>

                <ReviewRating selected={rating} onSelect={setRating} />
            </View>

            <Pressable
                style={[styles.nextButton, !rating && styles.nextButtonDisabled]}
                onPress={handleNext}
                disabled={!rating}
            >
                <TextDefault>
                    {getTranslation("next")}
                </TextDefault>
            </Pressable>

            <LowRatingModal
                visible={showLowRatingModal}
                onCancel={() => setShowLowRatingModal(false)}
                onCreateLoading={creatingReviewLoading}
                onCreateTicket={async () => {
                    console.log({
                        riderId: propsData?.riderId,
                        orderId: propsData?.orderId,
                        restaurant: propsData?.restaurantId,
                        rating: rating,
                        description: ""
                    })
                    // Replace nulls with actual values if available
                    await createRiderReview({
                        variables: {
                            input: {
                                riderId: propsData?.riderId,
                                orderId: propsData?.orderId,
                                restaurant: propsData?.restaurantId,
                                rating: rating,
                                description: "",
                                tipAmount: 0
                            }
                        }
                    });
                }}
            />

        </SafeAreaView>
    );
}

export default RiderRatingAndReview