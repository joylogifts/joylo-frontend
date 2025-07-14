import TextDefault from '@/src/components/Text/TextDefault/TextDefault';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import styles from './styles';
import CommentModal from '@/src/components/RiderRatingAndReview/CommentModal';
import TipInputModal from '@/src/components/RiderRatingAndReview/TipInputModal';
import ThankYouModal from '@/src/components/RiderRatingAndReview/ThankYouModal';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { createRiderReview } from '@/src/apollo/mutations';
import { useLanguage } from '@/src/context/Language';

const CREATE_RIDER_REVIEW = gql`
  ${createRiderReview}
`;

function RiderRatingReviewDetail(props) {
    const navigation = useNavigation();
    const propsData = props?.route?.params || {};
    const [selectedChip, setSelectedChip] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showTipModal, setShowTipModal] = useState(false);
    const [comment, setComment] = useState('');
    const [showThankyouModal, setShowThankyouModal] = useState(false);
    const [tip, setTip] = useState('');
    const [loading, setLoading] = useState(false);
    const chips = ['Courier Professionalism', 'Followed Instructions', 'Delivery time', 'Professional'];
    const [createReview] = useMutation(CREATE_RIDER_REVIEW);
    const { getTranslation } = useLanguage();

    const toggleChip = (chip) => {
        setSelectedChip(prev => prev === chip ? '' : chip);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log({
                riderId: propsData?.riderId,
                orderId: propsData?.orderId,
                restaurant: propsData?.restaurantId,
                rating: selectedChip ? 5 : 0, // Example: 5 for selected, 0 for not
                description: comment || selectedChip || '',
                tipAmount: parseFloat(tip) || 0
            })
            const { data } = await createReview({
                variables: {
                    input: {
                        riderId: propsData?.riderId,
                        orderId: propsData?.orderId,
                        restaurant: propsData?.restaurantId,
                        rating: selectedChip ? 5 : 0, // Example: 5 for selected, 0 for not
                        description: comment || selectedChip || '',
                        tipAmount: parseFloat(tip) || 0
                    }
                }
            });
            setShowThankyouModal(true);

            setTimeout(() => setShowThankyouModal(false), 2000);
            navigation.push("MyOrders")
        } catch (error) {
            // You can use a FlashMessage or alert here
            alert(error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
            // navigation?.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <TextDefault style={styles.skip} >
                        {getTranslation("skip")}
                    </TextDefault>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarWrapper}>
                    <Image source={require('../../../assets/rider.png')} style={styles.avatar} />
                    <Image source={require('../../../assets/good.png')} style={styles.avatarEmoji} />
                </View>
                <TextDefault style={styles.name}>{propsData?.riderName || ""}</TextDefault>
                <TextDefault style={styles.title}>{getTranslation("happy_to_hear_that_smooth_ride")}</TextDefault>
                <TextDefault style={styles.subtitle}>{getTranslation("what_did_you_especially_like_about_the_rider")}</TextDefault>
                <View style={styles.chipRow}>
                    {chips.map(chip => (
                        <Pressable
                            key={chip}
                            style={[styles.chip, selectedChip === chip && styles.chipSelected]}
                            onPress={() => toggleChip(chip)}
                        >
                            <TextDefault variant="body" style={selectedChip === chip ? styles.chipTextSelected : styles.chipText}>
                                {chip}
                            </TextDefault>
                        </Pressable>
                    ))}
                </View>
                {comment ? (
                    <TextDefault style={styles.commentPreview}>{comment}</TextDefault>
                ) : null}
                <Pressable style={styles.addCommentBtn} onPress={() => setShowCommentModal(true)}>
                    <TextDefault variant="button" style={styles.addCommentText}>{getTranslation("add_a_comment")}</TextDefault>
                </Pressable>

                <TextDefault variant="subheading" style={styles.tipTitle}>{getTranslation("add_a_courier_tip")}</TextDefault>
                <TextDefault variant="subheading" style={styles.tipSubTitle}>{getTranslation("your_tip_is_paid_out_directly_to_the_courier")}</TextDefault>

                <View style={styles.tipRow}>
                    {['0€', '2€', '4€', '6€'].map(amount => (
                        <Pressable key={amount} style={tip === amount ? styles.tipBtnSelected : styles.tipBtn} onPress={() => setTip(amount)}>
                            <TextDefault variant="body" style={tip === amount ? styles.tipTextSelected : styles.tipText}>{amount}</TextDefault>
                        </Pressable>
                    ))}
                    <Pressable style={styles.tipBtn} onPress={() => setShowTipModal(true)}>
                        <TextDefault variant="body">{getTranslation("others")}</TextDefault>
                    </Pressable>
                </View>
            </ScrollView>

            <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <TextDefault variant="button">{getTranslation("loading...")}</TextDefault>
                ) : (
                    <TextDefault variant="button">{getTranslation("submit")}</TextDefault>
                )}
            </Pressable>

            <CommentModal
                visible={showCommentModal}
                value={comment}
                onChange={setComment}
                onCancel={() => setShowCommentModal(false)}
                onDone={() => { setShowCommentModal(false); }}
            />

            <TipInputModal
                visible={showTipModal}
                value={tip}
                onChange={setTip}
                onCancel={() => setShowTipModal(false)}
                onAdd={() => setShowTipModal(false)}
            />

            <ThankYouModal visible={showThankyouModal} />
        </SafeAreaView>
    );
}

export default RiderRatingReviewDetail