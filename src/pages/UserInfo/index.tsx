import UpdateModal from '@/pages/UserInfo/components/UpdateModal';
import { updateUserUsingPost } from '@/services/image-backend/userController';
import ProCardDivider from '@ant-design/pro-card/es/components/Divider';
import { PageContainer, ProColumns } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Descriptions, message } from 'antd';
import React, { useState } from 'react';
import {formatDateTime} from "@/global";

const UserInfo: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { loginUser } = initialState || {};
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const handleUpdate = async (fields: API.UserUpdateRequest) => {
    const hide = message.loading('修改中');
    try {
      await updateUserUsingPost({
        id: loginUser?.id,
        ...fields,
      });
      hide();
      message.success('操作成功');
      // 更新initialState中的loginUser数据
      setInitialState((prevState) => ({
        ...prevState,
        loginUser: {
          ...loginUser,
          ...fields,
        },
      }));
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  const items = [
    {
      key: '1',
      label: '用户名',
      children: loginUser?.userName,
    },
    {
      key: '2',
      label: '性别',
      children: loginUser?.gender === 1 ? '男' : '女',
    },
    {
      key: '3',
      label: '账号',
      children: loginUser?.userAccount,
    },
    {
      key: '4',
      label: '编号',
      children: loginUser?.id,
    },
    {
      key: '5',
      label: '头像',
      children: loginUser?.userAvatar,
      span: 2,
    },
    {
      key: '6',
      label: '创建时间',
      children: formatDateTime(loginUser?.createTime),
      span: 3,
    },
    {
      key: '7',
      label: '更新时间',
      children: formatDateTime(loginUser?.updateTime),
    },
    {
      key: '8',
      label: '用户角色',
      children: loginUser?.userRole,
    },
  ];
  const columns: ProColumns<API.UserVO>[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
      initialValue: loginUser?.userName,
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'text',
      initialValue: loginUser?.userAvatar,
    },
  ];
  return (
    <PageContainer title="个人信息">
      <Card>
        <Descriptions bordered items={items} column={1}></Descriptions>
        <ProCardDivider />
        <Card>
          <Button
            type="primary"
            htmlType={'submit'}
            onClick={() => {
              handleUpdateModalOpen(true);
            }}
          >
            修改
          </Button>
        </Card>
      </Card>

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
        }}
        visible={updateModalOpen}
      ></UpdateModal>
    </PageContainer>
  );
};

export default UserInfo;
