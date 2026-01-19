import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center', borderBottom: '3px solid #007bff' }}>
        <h2 style={{ margin: '0', color: '#007bff' }}>FrameFlow</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Transform Your Content</p>
      </div>

      
      <div style={{ padding: '30px 20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Welcome to FrameFlow, {firstName}! 🎉</h1>
        
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          We're thrilled to have you on board. Your account is now active and ready to use.
        </p>

        
        <div style={{ backgroundColor: '#f0f7ff', padding: '20px', borderLeft: '4px solid #007bff', marginBottom: '20px' }}>
          <h3 style={{ marginTop: '0', color: '#007bff' }}>What You Can Do Now:</h3>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>✨ Create and manage your projects</li>
            <li>🖼️ Upload and transform your content</li>
            <li>📊 Track your usage and analytics</li>
            <li>🔐 Secure your files with advanced controls</li>
          </ul>
        </div>

        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a href="https://frame-flow-transform.vercel.app" 
             style={{
               backgroundColor: '#007bff',
               color: '#fff',
               padding: '12px 30px',
               textDecoration: 'none',
               borderRadius: '5px',
               fontSize: '16px',
               fontWeight: 'bold',
               display: 'inline-block'
             }}>
            Get Started Now
          </a>
        </div>

        
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
          <h3 style={{ marginTop: '0', fontSize: '16px' }}>Need Help?</h3>
          <p style={{ margin: '10px 0', fontSize: '14px' }}>
            Check out our <a href="https://frame-flow-transform.vercel.app/docs" style={{ color: '#007bff', textDecoration: 'none' }}>documentation</a> or 
            <a href="mailto:support@frameflow.com" style={{ color: '#007bff', textDecoration: 'none' }}> contact our support team</a>.
          </p>
        </div>
      </div>

      
      <div style={{ backgroundColor: '#2c3e50', color: '#fff', padding: '20px', textAlign: 'center', fontSize: '12px' }}>
        <p style={{ margin: '5px 0' }}>© 2026 FrameFlow. All rights reserved.</p>
        <p style={{ margin: '5px 0', fontSize: '11px' }}>
          <a href="https://frame-flow-transform.vercel.app/privacy" style={{ color: '#007bff', textDecoration: 'none' }}>Privacy Policy</a> | 
          <a href="https://frame-flow-transform.vercel.app/terms" style={{ color: '#007bff', textDecoration: 'none' }}> Terms of Service</a>
        </p>
      </div>
    </div>
  );
}