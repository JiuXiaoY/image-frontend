import {
  getInterfaceInfoByIdUsingGet,
  invokeInterfaceInfoUsingPost,
} from '@/services/image-backend/interfaceInfoController';
import { getUserInterfaceInfoByIdsUsingGet } from '@/services/image-backend/userInterfaceInfoController';
// @ts-ignore
import PurchasesModal from '@/pages/InterfaceInfo/components/PurchasesModal';
import { getPayUsingPost } from '@/services/image-backend/alipayController';
import { useModel, useParams } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Descriptions, Divider, Form, Space, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';

const Index: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [invokeRes, setInvokeRes] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const [remainingCalls, setRemainingCalls] = useState<any>();
  const [purchasesModalOpen, handlePurchasesModalOpen] = useState<boolean>(false);

  /**
   * 扩展功能
   *
   * 显示出剩余的调用次数
   */
  const getRemainingCalls = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    try {
      const res = await getUserInterfaceInfoByIdsUsingGet({
        interfaceInfoId: Number(params.id),
        userId: loginUser?.id,
      });
      if (res.data) {
        setRemainingCalls(res.data?.leftNum);
      } else {
        setRemainingCalls(0);
      }
    } catch (error: any) {
      message.error('请求失败' + error.message);
    }
  };

  const purchasesCount = async (fields: API.OrderInfoAddRequest) => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    try {
      const res = await getPayUsingPost({
        originalUrl: window.location.href,
        interfaceInfoId: Number(params.id),
        userId: loginUser?.id,
        ...fields,
      });
      if (res.data) {
        document.open();
        document.write(res.data);
        document.close();
      }
    } catch (error: any) {
      message.error('购买失败' + error.message);
      return false;
    }
  };

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败' + error.message);
    }
    setLoading(false);
  };

  const formatDateTime = (dateTimeString: any) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-CN', { hour12: false });
  };

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    if (remainingCalls === 0) {
      message.error('调用次数不足');
      return;
    }
    if (values.requestParams === undefined) {
      message.error('请求参数不能为空');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPost({
        id: Number(params.id),
        ...values,
      });
      setInvokeRes(res.data);
      // todo 这里应该有所区分的 比如成功的话显示调用结果，失败的话显示错误信息，剩余次数不足时显示购买,以及是否执行以下操作
      await getRemainingCalls();
    } catch (error: any) {
      message.error('请求失败,参数格式错误');
    }
    setInvokeLoading(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    loadData();
    getRemainingCalls();
  }, []);

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {formatDateTime(data.create_time)}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {formatDateTime(data.update_time)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />
      <Card title="在线调用">
        <Form name="invoke" layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="requestParams" label="请求参数">
            <TextArea autoSize />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                调用
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  handlePurchasesModalOpen(true);
                }}
              >
                购买次数
              </Button>
              （剩余可调用次数为： {remainingCalls} 次）
            </Space>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
      <PurchasesModal
        onSubmit={async (value) => {
          const success = await purchasesCount(value);
          if (success) {
            handlePurchasesModalOpen(false);
          }
        }}
        onCancel={() => {
          handlePurchasesModalOpen(false);
        }}
        visible={purchasesModalOpen}
      ></PurchasesModal>
    </PageContainer>
  );
};

export default Index;
