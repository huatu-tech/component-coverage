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

const { addSite, querySiteList, deleteSite, updateSite } =
  services.SiteController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.SiteInfo) => {
  const hide = message.loading('正在添加');
  try {
    let res:any = await addSite(fields);
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
const handleUpdate = async (fields: API.SiteInfo) => {
  const hide = message.loading('正在配置');
  try {
    const res:any = await updateSite(fields);
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
const handleRemove = async (selectedRows: API.SiteInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteSite({
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
  const [row, setRow] = useState<API.SiteInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.SiteInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.SiteInfo>[] = [
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
      title: '地址',
      dataIndex: 'site',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '地址为必填项',
          },
        ],
      },
    },
    {
      title: '运行环境',
      dataIndex: 'environment',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '运行环境为必填项',
          },
        ],
      },
      valueEnum: {
        'dev': { text: 'dev测试环境', },
        'test': { text: 'test测试环境', },
        'beta': { text: 'beta预发布环境', },
        'prod': { text: 'prod生产环境', },
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
        title: '项目管理',
      }}
    >
      <ProTable<API.SiteInfo>
        headerTitle="项目管理"
        actionRef={actionRef}
        editable={{
          type: 'multiple',
          onSave: async (_, row) => {
            console.log(_, row);
              await handleUpdate(row);
              actionRef.current?.reloadAndRest?.();
            
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 120,
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
          const { data, success } = await querySiteList({
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
        <ProTable<API.SiteInfo, API.SiteInfo>
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
          <ProDescriptions<API.SiteInfo>
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
