import services from '@/services/demo';
import {
  ActionType,
  PageContainer,
  ProCard,
  LightFilter,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Button, Divider, Card, Radio, Affix, Row, Col, List, Statistic } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import React, { useRef, useState, useEffect } from 'react';
import { Link, useMatch } from '@umijs/max';
import CreateForm from './components/CreateForm';
import ReactJson from 'react-json-view'



const UseInfo: React.FC<unknown> = (prop) => {

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [coverage, setCoverage] = useState<any>([])
  const [initialValues, setInitialValues] = useState<any>({})
  // 获取年-月-日
  const toDayStr = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let seperator = "-";
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    let currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
  }

  const [type, setType] = useState<string>("page")
  const [siteList, setSiteList] = useState<any>([]);
  const [selectedRowsState, setSelectedRows] = useState<API.ComponentInfo[]>([]);
  const { querySiteList } =
    services.SiteController;
  const { queryComponentDetail } =
    services.ComponentController;


  useEffect(() => {
    setLoading(true)
    queryComponentDetail(Object.assign({type}, initialValues,)).then((res) => {
      console.log('res', res);
      setLoading(false)
      setCoverage(res.data)
    })
  }, [initialValues, type]);

  const querySiteListFn = async () => {
      let res = await querySiteList()
      let result = res.data.map((item: any) => {
        return {
          label: item.name,
          value: item.name,
        }
      })
      setSiteList(result)
      return result
  }

  const initRequest = async () => {
    let res = await querySiteListFn()
    let obj = {
      project: res[0].label,
      date: toDayStr(),
    }
    setInitialValues(obj)
    return obj
  }

  const extraContent = (
    <Affix offsetTop={20}>
      <Row gutter={20} align='middle'>
        <Col>
          <LightFilter
            request={initRequest}
            size="large"
            onFinish={async (values) => setInitialValues(values)}
          >
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
        </Col>
        <Col>
          <Radio.Group
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio.Button value="page">页面</Radio.Button>
            <Radio.Button value="component">组件</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
    </Affix>
  );

  return (
  <Card
    // loading={loading}
    bordered={false}
    title='组件使用情况统计'
    style={{ marginTop: 24 }}
    extra={extraContent}
    loading={loading}
  >
  </Card>
)};

export default UseInfo;