import React from 'react';
import Layout from '@theme/Layout';
import Translate from '../components/Translate';

export default function TermsPage() {
  return (
    <Layout 
      title="Terms of Service" 
      description="HUMΛN-Ø Terms of Service"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1><Translate id="legal.termsTitle">Terms of Service</Translate></h1>
            <p><Translate id="legal.termsContent">Terms of service content will be loaded from locale files.</Translate></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
