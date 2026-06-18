// ============================================================
// BULK IMPORT PAGE
// /workspace/content/bulk-import
// Pratham 2.0 — Workspace MFE
// ============================================================

import React from 'react';
import Layout from '../../../../components/Layout';
import BulkImportStepper from '../../../../components/bulk-import/BulkImportStepper';
import { useRouter } from 'next/router';

const BulkImportPage: React.FC = () => {
  const router = useRouter();

  const handleSelect = (key: string) => {
    router.push(`/workspace/content/${key}`);
  };

  return (
    <Layout selectedKey="bulk-import" onSelect={handleSelect}>
      <BulkImportStepper />
    </Layout>
  );
};

export default BulkImportPage;
