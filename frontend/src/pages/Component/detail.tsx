import services from '@/services/demo';
import {
  PageContainer,
  LightFilter,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Card, Radio, Affix, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { useMatch } from '@umijs/max';
import ReactJson from 'react-json-view'



const ComponentDetail: React.FC<unknown> = () => {

  const [loading, setLoading] = useState<boolean>(false)
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
  const match = useMatch('/component/:name')
  console.log('match', match);
  

  const [type, setType] = useState<string>("page")
  const [siteList, setSiteList] = useState<any>([]);
  const { querySiteList } =
    services.SiteController;
  const { queryComponentDetail } =
    services.ComponentController;


  useEffect(() => {
    setLoading(true)
    queryComponentDetail(Object.assign({type}, initialValues, match.params,)).then((res) => {
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
          value: item.id,
        }
      })
      setSiteList(result)
      return result
  }

  const initRequest = async () => {
    let res = await querySiteListFn()
    let obj = {
      project_id: res[0].value,
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
              name="project_id"
              allowClear={false}
              options={siteList}
            />
            <ProFormDatePicker
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
    <PageContainer>
      <Card
        bordered={false}
        title={`组件：${match.params.name}`}
        extra={extraContent}
        loading={loading}
      >
        <ReactJson src={coverage} />
      </Card>
    </PageContainer>
  );
};

export default ComponentDetail;
