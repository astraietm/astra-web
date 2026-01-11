import React from 'react';
import { Quote } from 'lucide-react';
import FadeInUp from '../common/FadeInUp';
import HackerText from '../common/HackerText';

const HODMessage = () => {
    return (
        <section className="py-20 relative overflow-hidden">
             <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto mb-16 md:mb-32 px-4 md:px-0">
                    <FadeInUp delay={0.4}>
                        <div className="flex flex-col lg:grid lg:grid-cols-[400px_1fr] gap-8 md:gap-20 items-center">
                            
                            {/* Left: Image & Badge */}
                            <div className="relative flex flex-col items-center lg:self-start lg:sticky lg:top-32">
                                <div className="relative w-40 h-40 md:w-80 md:h-80 rounded-full border border-primary/20 p-2">
                                     {/* Spinning Ring */}
                                     <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-[spin_20s_linear_infinite]"></div>
                                     
                                     <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 relative z-10">
                                        <img 
                                            src="images/hod.jpg" 
                                            alt="Thara Krishnan R" 
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                            onError={(e) => {e.target.style.display='none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white/20">IMG</div>';}}
                                        />
                                     </div>

                                     {/* Quote Badge Overlay */}
                                     <div className="absolute bottom-2 right-4 md:bottom-10 md:right-4 w-10 h-10 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-black z-20 shadow-lg shadow-primary/20">
                                         <Quote className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                                     </div>
                                </div>
                                
                                <div className="mt-4 md:mt-8 text-center">
                                    <h4 className="text-white font-display font-bold text-lg md:text-2xl tracking-wide uppercase">
                                        <HackerText text="Asst Prof. Thara Krishnan R" speed={40} />
                                    </h4>
                                    <div className="h-1 w-8 md:w-12 bg-primary mx-auto my-2 md:my-3 rounded-full"></div>
                                    <p className="text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em]">
                                        <HackerText text="Head of Department" speed={60} />
                                    </p>
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="text-left">
                                <h2 className="text-2xl md:text-5xl font-display font-serif text-white mb-4 md:mb-8 block text-center lg:text-left">
                                    Message from <span className="text-primary italic">HOD</span>
                                </h2>
                                
                                <p className="text-gray-300 text-sm md:text-lg leading-relaxed font-light font-sans text-center lg:text-left">
                                    "Welcome to the Department of Cyber Security at KMCT Institute of Emerging Technology and Management. As cyber threats become increasingly sophisticated, our commitment is to prepare you for the forefront of this critical field. Our department offers a dynamic curriculum, cutting-edge labs, and opportunities for real-world experience to ensure you are equipped with the skills needed to protect and defend against digital threats. 
                                    <br /><br />
                                    Our experienced faculty members are dedicated to providing high-quality education and mentorship, helping you develop a deep understanding of cyber security principles and practices. We emphasize a hands-on approach to learning, encouraging innovation and practical problem-solving. We are proud of the resources and support available to our students and are excited to guide you on your journey to becoming a leader in cyber security. Together, we will work to advance the field and address the challenges of securing the digital landscape. Welcome aboard, and we look forward to your success and contributions in this vital area."
                                </p>
                            </div>

                        </div>
                    </FadeInUp>
                </div>
            </div>
        </section>
    );
};

export default HODMessage;
