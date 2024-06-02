import UpdateModal from '@/pages/Admin/CommonComponents/UpdateModal';
import {
  deleteBatchOrderInfoUsingPost,
  deleteOrderInfoUsingPost,
  listOrderInfoByPageUsingGet,
  updateOrderInfoUsingPost,
} from '@/services/image-backend/orderInfoController';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   * @en-US Update node
   * @zh-CN 更新接口
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.OrderInfo) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateOrderInfoUsingPost({
        id: currentRow.id,
        ...fields,
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除接口
   *
   * @param record
   */
  const handleRemove = async (record: API.OrderInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteOrderInfoUsingPost({
        id: record.id,
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 批量删除接口
   *
   * @param
   */
  const handleBatchRemove = async () => {
    const hide = message.loading('正在批量删除');
    if (!selectedRowsState || selectedRowsState.length <= 0) {
      hide();
      message.error('请选择需要删除的数据');
      return;
    }
    const ids = selectedRowsState.map((item) => item.id!);
    try {
      await deleteBatchOrderInfoUsingPost({
        ids: ids,
      });
      hide();
      message.success('批量删除成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const columns: ProColumns<API.OrderInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '流水号',
      dataIndex: 'serialNumber',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入接口名称',
          },
        ],
      },
    },
    {
      title: '用户Id',
      dataIndex: 'userId',
      valueType: 'textarea',
      hideInForm: true,
    },
    {
      title: '接口Id',
      dataIndex: 'interfaceInfoId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '支付金额',
      dataIndex: 'amountPaid',
      valueType: 'textarea',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      valueType: 'select',
      valueEnum: {
        WechatPay: { text: 'WechatPay' },
        ALIPAYACCOUNT: { text: 'ALIPAYACCOUNT' },
        BankCardPay: { text: 'BankCardPay' },
        HanaPay: { text: 'HanaPay' },
      },
    },
    {
      title: '购买次数',
      dataIndex: 'purchasesCount',
      valueType: 'textarea',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '未完成',
          status: 'Default',
        },
        1: {
          text: '已完成',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="config"
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.InterfaceInfo, API.PageParams>
        headerTitle={'所有订单详细信息如下'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const res = await listOrderInfoByPageUsingGet({
            ...params,
          });
          if (res?.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
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
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              await handleBatchRemove();
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
