import React from 'react';
import ScrollReveal from './ScrollReveal';

const FadeInUp = ({ children, delay = 0, className = "", width = "100%" }) => {
    return (
        <ScrollReveal variant="up" delay={delay} className={className} width={width}>
            {children}
        </ScrollReveal>
    );
};

export default FadeInUp;
