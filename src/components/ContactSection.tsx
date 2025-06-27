"use client";

import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 7080);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 7080);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contact" className="py-16 scroll-mt-20 bg-primary-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-500/10 rounded-full">
                  <FaEnvelope className="text-xl text-primary-700" />
                </div>
                <div>
                  {/* <h4 className="font-medium">Email</h4> */}
                  <p className="text-primary-700">contact@example.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-500/10 rounded-full">
                  <FaPhone className="text-xl text-primary-700" />
                </div>
                <div>
                  {/* <h4 className="font-medium">Phone</h4> */}
                  <p className="text-primary-700">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-500/10 rounded-full">
                  <FaMapMarkerAlt className="text-xl text-primary-700" />
                </div>
                <div>
                  {/* <h4 className="font-medium">Location</h4> */}
                  <p className="text-primary-700">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`w-full px-4 py-2 bg-primary-200/60 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-primary-800'
                } focus:outline-none focus:border-primary-100 text-primary-900 placeholder:text-primary-900`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className={`w-full px-4 py-2 bg-primary-200/60 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-primary-800'
                } focus:outline-none focus:border-primary-100 text-primary-900 placeholder:text-primary-900`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className={`w-full px-4 py-2 bg-primary-200/60 rounded-lg border ${
                  errors.subject ? 'border-red-500' : 'border-primary-800'
                } focus:outline-none focus:border-primary-100 text-primary-900 placeholder:text-primary-900`}
              />
              {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                className={`w-full px-4 py-2 bg-primary-200/60 rounded-lg border ${
                  errors.message ? 'border-red-500' : 'border-primary-800'
                } focus:outline-none focus:border-primary-100 text-primary-900 placeholder:text-primary-900`}
              />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-3 rounded-lg font-medium transition ${
                status === 'loading'
                  ? 'bg-primary-600/80 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-primary-100`}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="text-green-500 text-center">Message sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
} 