import services from '@/services/demo';
import {
  LightFilter,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Card, Affix } from 'antd';
import React, { useState } from 'react';
import { proDate } from '@/utils/format';
import { Column } from '@ant-design/charts';

const UseInfo: React.FC<unknown> = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const [siteList, setSiteList] = useState<any>([]);
  const [componentList, setComponentList] = useState<any>([]);
  const { querySiteList } =
    services.SiteController;
  const { queryComponentUseInfo, queryComponentList } =
    services.ComponentController;

    const [data, setData] = useState([]);

    const config = {
      data,
      isStack: true,
      xField: 'date',
      yField: 'value',
      seriesField: 'type',
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle',
        // 'top', 'bottom', 'middle'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          {
            type: 'interval-adjust-position',
          }, // 数据标签防遮挡
          {
            type: 'interval-hide-overlap',
          }, // 数据标签文颜色自动调整
          {
            type: 'adjust-color',
          },
        ],
      },
    };
  
    const queryUseInfo = async (value) => {
      setLoading(true)
      let res = await queryComponentUseInfo(Object.assign({}, value))
      setLoading(false)
      setData(res.data)
    }

  const querySiteListFn = async () => {
      let res = await querySiteList()
      let result = res.data.map((item: any) => {
        return {
          label: item.name,
          value: item.site,
        }
      })
      setSiteList(result)
      return result
  }
  const formatDate = (date: any) => { 
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return `${year}-${month}-${day}`
  }

  const queryComponentListFn = async () => {
    let res = await queryComponentList()
    let result = res.data.map((item: any) => {
      return {
        label: item.name,
        value: item.name,
      }
    })
    setComponentList(result)
    return result
}

  const initRequest = async () => {
    let res = await querySiteListFn()
    let obj = {
      component:'',
      project: res[0].value,
      date: [formatDate(proDate(new Date(), '{%M-1}')), formatDate(new Date())],
    }
    await queryComponentListFn()
    const {component,project,date} = obj
    const [start,end] = date
    queryUseInfo(Object.assign({},{component,project,start,end}))
    return obj
  }

  const extraContent = (
    <Affix offsetTop={20}>
        <LightFilter
          request={initRequest}
          size="large"
          onFinish={async (values) => {
            const {component,project} = values
            console.log(proDate(new Date(), '{%M-1}'));
            console.log(values.date);
            
            const [start,end] = values.date
            queryUseInfo(Object.assign({},{component,project,start,end}))
          }}
        >
          <ProFormSelect
            name="component"
            placeholder="请选择组件"
            allowClear={true}
            options={componentList}
          />
          <ProFormSelect
            name="project"
            allowClear={false}
            options={siteList}
          />
          <ProFormDateRangePicker
            name="date"
            allowClear={false}
          />
        </LightFilter>
    </Affix>
  );

  return (
  <Card
    bordered={false}
    title='组件使用情况统计'
    style={{ marginTop: 24 }}
    extra={extraContent}
    loading={loading}
  >
    <Column {...config} />
  </Card>
)};

export default UseInfo;
