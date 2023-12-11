import React,{ useEffect, useState} from 'react';
import { Avatar, Card, List,Radio } from 'antd';
import services from '@/services/demo';



const App: React.FC = () => {


  const [rankType, setrRankType] = useState<any>('1');
  const [rank, setrRank] = useState<any[]>([]);
  // 金银铜rgb
  let rankColor = ['#CD7F32','#E6E8FA','#B87333'];


  const queryRank = async () => {
    return await services.StatisticsController.queryStatisticsRank({rankType});
  }

  useEffect(() => {
    queryRank().then((res) => {
      setrRank(res.data);
    })
  }, [rankType]);

  const handleChangerankType = (e:any) => {
    setrRankType(e.target.value);
  };

  return (
  <Card
    // loading={loading}
    bordered={false}
    title='组件Rank Top10'
    style={{ marginTop: 24 }}
    extra={
      <div>
          <Radio.Group value={rankType} onChange={(e)=>handleChangerankType(e)}>
            <Radio.Button value="1">
            页面
            </Radio.Button>
            <Radio.Button value="2">
            组件
            </Radio.Button>
          </Radio.Group>
      </div>
    }
  >
    <List
      itemLayout="horizontal"
      dataSource={rank}
      style={{height: '400px'}}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar style={{ backgroundColor: rankColor[index], color: '#fff' }}>{item.component.substr(0,1).toUpperCase()}</Avatar>}
            title={<a href="https://ant.design"><b>Top {index+1}</b> <span style={{'color':'#55da9e'}}>{item.component}</span></a>}
            description={`${item.project}: 调用${rankType === '1' ? item.pages_times : item.components_times}次,覆盖率${rankType === '1' ? (item.pages_coverage_count/item.pages_count*100).toFixed(2) : (item.components_coverage_count/item.components_count*100).toFixed(2)}%`}
          />
        </List.Item>
      )}
    />
  </Card>
)};

export default App;
