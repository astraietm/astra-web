import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const RazorpayPayment = ({ eventId, eventName, amount, teamName, teamMembers, onSuccess, onFailure }) => {
    const { token, user } = useAuth();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        
        if (!scriptLoaded) {
            onFailure('Failed to load Razorpay SDK. Please check your internet connection.');
            return;
        }

        try {
            console.log('Initiating payment for event:', eventId);
            const apiUrl = `${import.meta.env.VITE_API_URL}/payment/create-order/`;
            console.log('Calling API:', apiUrl);

            // Create order on backend
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    event_id: eventId,
                    team_name: teamName || '',
                    team_members: teamMembers || ''
                })
            });

            console.log('API Response Status:', response.status);

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned non-JSON response. Check console for details.');
            }

            console.log('API Response Data:', data);

            if (!response.ok) {
                console.error('Payment order creation failed:', data);
                onFailure(data.error || 'Failed to create payment order');
                return;
            }

            // Configure Razorpay options
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: data.currency,
                name: 'ASTRA IETM',
                description: `Registration for ${eventName}`,
                order_id: data.order_id,
                handler: async function (response) {
                    console.log('Razorpay payment successful, verifying...', response);
                    // Verify payment on backend
                    try {
                        const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/payment/verify/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyResponse.json();
                        console.log('Verification response:', verifyData);

                        if (verifyResponse.ok && verifyData.success) {
                            onSuccess(verifyData.registration);
                        } else {
                            console.error('Verification failed:', verifyData);
                            onFailure(verifyData.error || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        onFailure('Failed to verify payment: ' + error.message);
                    }
                },
                prefill: {
                    name: user?.full_name || user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone_number || ''
                },
                theme: {
                    color: '#DC2626'
                },
                modal: {
                    ondismiss: function() {
                        onFailure('Payment cancelled by user');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            onFailure('Payment initialization failed: ' + error.message);
        }
    };

    return handlePayment;
};

export default RazorpayPayment;
