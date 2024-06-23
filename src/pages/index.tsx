import type { NextPageWithLayout } from './_app';
import Layout from '../components/Layout';

import DashboardPage from './dashboard';

const IndexPage: NextPageWithLayout = () => {
  return <DashboardPage />;
};

IndexPage.getLayout = (page) => <Layout>{page}</Layout>;

export default IndexPage;
