import * as React from 'react';
import { Layout, Menu } from 'antd';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import './styles.less';

const { Header, Content } = Layout;

interface IExposedProps {
  children?: React.ReactNode;
}

type IProps = IExposedProps & RouteComponentProps;

class AppLayout extends React.Component<IProps> {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="logo">{'budget board'}</div>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">Home</Menu.Item>
          </Menu>
        </Header>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ margin: 0, minHeight: 280 }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(AppLayout);
