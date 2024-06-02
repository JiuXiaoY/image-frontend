import { formatDateTime } from '@/global';
import {
  deleteBatchOrderInfoUsingPost,
  deleteOrderInfoUsingPost,
  listOrderInfoByUserIdUsingGet,
} from '@/services/image-backend/orderInfoController';
import { useModel } from '@@/exports';
import { FooterToolbar, ProList } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

const PurchaseRecord: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { initialState } = useModel('@@initialState');
  const loginUser = initialState?.loginUser;
  const [OrderInfo, setOrderInfo] = useState<API.OrderInfo[]>([]);
  const [selectedRowsState, setSelectedRows] = useState<API.OrderInfo[]>([]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await listOrderInfoByUserIdUsingGet({
        id: loginUser?.id,
      });
      if (res.data) {
        setOrderInfo(res.data);
      }
    } catch (error: any) {
      message.error('获取订单失败' + error.message);
    }
    setLoading(false);
  };

  const handleRemove = async (record: API.OrderInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteOrderInfoUsingPost({
        id: record.id,
      });
      hide();
      setOrderInfo((prevState) => prevState.filter((item) => item.id !== record.id));
      message.success('删除成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const handleBatchRemove = async () => {
    const hide = message.loading('正在批量删除');
    if (!selectedRowsState || selectedRowsState.length <= 0) {
      hide();
      message.error('请选择需要删除的数据');
      return;
    }
    const ids = selectedRowsState.map((row) => row.id!);
    try {
      await deleteBatchOrderInfoUsingPost({
        ids: ids,
      });
      hide();
      await loadOrder();
      message.success('批量删除成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  useEffect(() => {
    loadOrder();
  }, []);

  const data = OrderInfo.map((order) => ({
    title: '订单号： ' + order.serialNumber,
    id: order.id,
    subTitle: <Tag color="#5BD8A6">接口ID： {order.interfaceInfoId}</Tag>,
    actions: [
      <a key="run">退款</a>,
      <a
        key="delete"
        onClick={() => {
          handleRemove(order);
        }}
      >
        删除
      </a>,
    ],
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            width: 200,
          }}
        >
          <div>支付金额： {order.amountPaid}</div>
          <div>支付方式： {order.paymentMethod}</div>
          <div>购买次数： {order.purchasesCount}</div>
          <div>创建时间： {formatDateTime(order.create_time)}</div>
          <div>订单状态： {order.status === 1 ? '已完成' : '未完成'}</div>
        </div>
      </div>
    ),
  }));

  const [cardActionProps] = useState<'actions' | 'extra'>('extra');
  return (
    <div
      style={{
        backgroundColor: '#white',
        margin: -24,
        padding: 24,
      }}
    >
      <ProList<any>
        loading={loading}
        pagination={{
          defaultPageSize: 8,
          showSizeChanger: false,
        }}
        showActions="hover"
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        grid={{ gutter: 16, column: 2 }}
        metas={{
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: {
            cardActionProps,
          },
        }}
        headerTitle="购买历史记录"
        dataSource={data}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              setSelectedRows([]);
              await handleBatchRemove();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </div>
  );
};

export default PurchaseRecord;
