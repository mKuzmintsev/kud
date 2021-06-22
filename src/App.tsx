import React from 'react';
import { Layout, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Header from './components/Header';
import { MainContent } from './components/MainContent';
import MainMenu from './components/Menu';
import { useInterval } from './hooks/useInterval';
import { viewSelector } from './redux/slices/view/selectors';
import { checkAlive } from './redux/slices/view/slice';
import styles from './app.module.scss';

const { Content, Footer, Sider } = Layout;

export const App: React.FC = () => {
  const { isAlive } = useSelector(viewSelector);
  const dispatch = useDispatch();

  useInterval(
    () => {
      dispatch(checkAlive());
    },
    10000,
    true
  );

  return (
    <Layout className={styles.mainWrapper}>
      <Header></Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider style={{ overflow: 'auto', backgroundColor: '#fff' }} width={220}>
          <MainMenu />
        </Sider>
        <Content
          style={{
            margin: '16px 16px',
          }}>
          <MainContent />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
