import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';

const { addComponent, queryComponentList, deleteComponent, updateComponent } =
  services.ComponentController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.ComponentInfo) => {
  const hide = message.loading('正在添加');
  try {
    let res:any = await addComponent(fields);
    hide();
    if(res.code === 200) {
    message.success('添加成功');
    return true;
  } else {
    message.error(res.message);
    return false;
  }
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: API.ComponentInfo) => {
  const hide = message.loading('正在配置');
  try {
    const res:any = await updateComponent(fields);
    hide();
    if(res.code === 200) {
      message.success('配置成功');
      return true;
    } else {
      message.error(res.message);
      return false;
    }
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ComponentInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteComponent({
      ids: selectedRows.map((row) => row.id).join(',')
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.ComponentInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.ComponentInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.ComponentInfo>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '分类为必填项',
          },
        ],
      },
      valueEnum: {
        1: { text: '原子组件', },
        2: { text: '业务组件', },
        3: { text: '布局组件', },
        4: { text: '表单组件', },
        5: { text: 'UI组件', },
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '作者为必填项',
          },
        ],
      },
    },
    {
      title: '简介',
      dataIndex: 'introduced',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record:any) => (
        <>
          <a
            key="editable"
            onClick={() => {
              // handleUpdateModalVisible(true);
              // setStepFormValues(record);
              actionRef.current?.startEditable?.(record.id);
            }}
          >
            配置
          </a>
          <Divider type="vertical" />
          <a 
            onClick={async () => {
              await handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }}>删除</a>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '组件管理',
      }}
    >
      <ProTable<API.ComponentInfo>
        headerTitle="组件列表"
        actionRef={actionRef}
        editable={{
          type: 'single',
          onSave: async (_, row) => {
            console.log(_, row);
              await handleUpdate(row);
              actionRef.current?.reload?.();
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await queryComponentList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data || [],
            success,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.ComponentInfo, API.ComponentInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<API.ComponentInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
