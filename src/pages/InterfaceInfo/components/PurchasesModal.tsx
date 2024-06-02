import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import React from 'react';

export type Props = {
  onCancel: () => void;
  onSubmit: (values: API.OrderInfoAddRequest) => Promise<void>;
  visible: boolean;
};

const PurchasesModal: React.FC<Props> = (props) => {
  const {  visible, onCancel, onSubmit } = props;
  const columns: ProColumns<API.OrderInfoAddRequest>[] = [
    {
      title: '购买次数',
      dataIndex: 'purchasesCount',
      valueType: 'text',
    },
  ];
  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      >
      </ProTable>
    </Modal>
  );
};
export default PurchasesModal;
