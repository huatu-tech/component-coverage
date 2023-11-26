import React, { useState, useEffect } from 'react';
import services from '@/services/demo';
import {
  PageContainer,
  StatisticCard,
} from '@ant-design/pro-components';
import CountUp from 'react-countup';
import { Rose } from '@ant-design/charts';
import { Row, Col, Card, Menu, Dropdown, Radio } from 'antd';
const { Statistic, Divider } = StatisticCard;
const formatter = (value: number) => <CountUp end={value} separator="," />;

const DemoLine: React.FC<unknown> = () => {
  const [statistics, setStatistics] = useState<any>({});
  const [roseData, setrRoseData] = useState<any>([]);
  const [salesType, setrSalesType] = useState<any>('1');
  const queryStatistics = async () => {
    return await services.StatisticsController.queryStatistics();
  }
  useEffect(() => {
    queryStatistics().then((res) => {
      setStatistics(res.data);
      setrRoseData(res.data.componentsList)
    })
  }, []);
  
  const handleChangeSalesType = (e:any) => {
    setrSalesType(e.target.value);
  };

const DemoRose = () => {
  //类别：1原子组件、2业务组件、3布局组件、4表单组件、5UI组件
  const componentCategory:any = {
    1: '原子组件',
    2: '业务组件',
    3: '布局组件',
    4: '表单组件',
    5: 'UI组件',
  };
  
  const transformData = (data: any) => {
    const res:any = [];
    let obj:any = {}
    data.forEach((item: any) => {
      let category = componentCategory[item.category]
      if(obj[category]){
        let index = res.findIndex((i:any) => i.type === category)
        res[index].value += 1
      }else{
        res.push({
          type: category,
          value: 1
        })
        obj[category] = true
      }
    });
    return res;
  };

  const config = {
    data:transformData(roseData),
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    radius: 0.9,
    label: {
      offset: -15,
    },
  };
  return <Rose {...config} />;
};

  return <PageContainer>
          <StatisticCard.Group direction='row'>
            <StatisticCard
              statistic={{
                title: '总组件数',
                value: statistics?.componentsList?.length,
              }}
            />
            <Divider type='vertical' />
            <StatisticCard
              statistic={{
                title: '接入系统数',
                value: statistics.siteCount,
              }}
              chartPlacement="left"
            />
            <Divider type='vertical' />
            <StatisticCard
              statistic={{
                title: '组件调用总次数',
                value: statistics.componentTimes,
                formatter: formatter,
                description: <Statistic title="组件总数" value={`${statistics.componentCount}个`} />,
              }}
            />
            <Divider type='vertical' />
            <StatisticCard
              statistic={{
                title: '页面调用总次数',
                value: statistics.pageTimes,
                formatter: formatter,
                description: <Statistic title="页面总数" value={`${statistics.pageCount}个`}  />,
              }}
            />
          </StatisticCard.Group>
          {/* <p>todo:组件、系统按月统计柱状图</p>
          <p>todo:组件分类占比玫瑰图</p>
          <p>todo:组件rank</p> */}
          <Row gutter={20}>
          <Col span={24}>
            <Card 
              bordered={false}
              title='组件使用情况统计'
              style={{ marginTop: 24 }}>
              </Card>
          </Col>
          </Row>
          <Row gutter={20}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                  // loading={loading}
                  bordered={false}
                  title='组件rank'
                  style={{ marginTop: 24 }}
                  extra={
                    <div>
                        <Radio.Group value={salesType} onChange={(e)=>handleChangeSalesType(e)}>
                          <Radio.Button value="1">
                          调用次数
                          </Radio.Button>
                          <Radio.Button value="2">
                          覆盖率
                          </Radio.Button>
                        </Radio.Group>
                    </div>
                  }
                >

                </Card>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                bordered={false}
                title='组件分类统计'
                style={{ marginTop: 24 }}
              >

              <DemoRose />
              </Card>
              </Col>
              </Row>
        </PageContainer>
};

export default DemoLine
