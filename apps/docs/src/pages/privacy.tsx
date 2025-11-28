import React from 'react';
import Layout from '@theme/Layout';
import Translate from '../components/Translate';

export default function PrivacyPage() {
  return (
    <Layout 
      title="Privacy Policy" 
      description="HUMΛN-Ø Privacy Policy"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1><Translate id="legal.privacyTitle">Privacy Policy</Translate></h1>
            <p><Translate id="legal.privacyContent">Privacy policy content will be loaded from locale files.</Translate></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
