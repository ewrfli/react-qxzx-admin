import React, { useState, useEffect } from 'react';
import { G2, Line, Area, Pie, Scatter, Bar } from '@ant-design/plots';
import { Card } from 'antd';


const DemoLine = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/cpu-data.json')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    G2.registerShape('point', 'breath-point', {
        draw(cfg, container) {
            const data = cfg.data;
            const point = {
                x: cfg.x,
                y: cfg.y,
            };
            const group = container.addGroup();

            if (data.time === '14.20' && data.date === 'today') {
                const decorator1 = group.addShape('circle', {
                    attrs: {
                        x: point.x,
                        y: point.y,
                        r: 10,
                        fill: cfg.color,
                        opacity: 0.5,
                    },
                });
                const decorator2 = group.addShape('circle', {
                    attrs: {
                        x: point.x,
                        y: point.y,
                        r: 10,
                        fill: cfg.color,
                        opacity: 0.5,
                    },
                });
                const decorator3 = group.addShape('circle', {
                    attrs: {
                        x: point.x,
                        y: point.y,
                        r: 10,
                        fill: cfg.color,
                        opacity: 0.5,
                    },
                });
                decorator1.animate(
                    {
                        r: 20,
                        opacity: 0,
                    },
                    {
                        duration: 1800,
                        easing: 'easeLinear',
                        repeat: true,
                    }
                );
                decorator2.animate(
                    {
                        r: 20,
                        opacity: 0,
                    },
                    {
                        duration: 1800,
                        easing: 'easeLinear',
                        repeat: true,
                        delay: 600,
                    }
                );
                decorator3.animate(
                    {
                        r: 20,
                        opacity: 0,
                    },
                    {
                        duration: 1800,
                        easing: 'easeLinear',
                        repeat: true,
                        delay: 1200,
                    }
                );
                group.addShape('circle', {
                    attrs: {
                        x: point.x,
                        y: point.y,
                        r: 6,
                        fill: cfg.color,
                        opacity: 0.7,
                    },
                });
                group.addShape('circle', {
                    attrs: {
                        x: point.x,
                        y: point.y,
                        r: 1.5,
                        fill: cfg.color,
                    },
                });
            }

            return group;
        },
    });
    const config = {
        width: 400,
        height: 300,
        data,
        meta: {
            cpu: {
                time: {
                    type: 'cat',
                },
                max: 100,
                min: 60,
            },
        },
        xField: 'time',
        yField: 'cpu',
        seriesField: 'date',
        tooltip: {
            showMarkers: false,
        },
        point: {
            shape: 'breath-point',
        },
    };

    return <Line {...config} />;
};

const DemoArea = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/67ef5751-b228-417c-810a-962f978af3e7.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    width: 300,
    height: 300,
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'country',
    color: ['#82d1de', '#cb302d', '#e3ca8c'],
    areaStyle: {
      fillOpacity: 0.6,
    },
    appendPadding: 2,
    isPercent: true,
    yAxis: {
      label: {
        formatter: (value) => {
          return value * 100;
        },
      },
    },
    pattern: {
      type: 'line',
    },
  };

  return <Area {...config} />;
};

const DemoPie = () => {
  const data = [
    {
      type: '??????',
      value: 27,
    },
    {
      type: '??????',
      value: 25,
    },
    {
      type: '??????',
      value: 18,
    },
    {
      type: '?????????',
      value: 15,
    },
    {
      type: '??????',
      value: 10,
    },
    {
      type: '??????',
      value: 5,
    },
  ];
  const config = {
    width: 300,
    height: 300,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 10,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

const DemoScatter = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      asyncFetch();
    }, []);
  
    const asyncFetch = () => {
      fetch('https://gw.alipayobjects.com/os/antfincdn/t81X1wXdoj/scatter-data.json')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => {
          console.log('fetch data failed', error);
        });
    };
    const config = {
        width: 400,
        height: 300,
      appendPadding: 2,
      data,
      xField: 'x',
      yField: 'y',
      colorField: 'genre',
      color: ['r(0.4, 0.3, 0.7) 0:rgba(255,255,255,0.5) 1:#5B8FF9', 'r(0.4, 0.4, 0.7) 0:rgba(255,255,255,0.5) 1:#61DDAA'],
      sizeField: 'size',
      size: [5, 20],
      shape: 'circle',
      yAxis: {
        nice: true,
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
      xAxis: {
        grid: {
          line: {
            style: {
              stroke: '#eee',
            },
          },
        },
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
    };
  
    return <Scatter {...config} />;
};
  
const DemoBar = () => {
    const data = [
      {
        year: '1991',
        value: 3,
        type: '???',
      },
      {
        year: '1992',
        value: 4,
        type: '???',
      },
      {
        year: '1993',
        value: 3,
        type: '???',
      },
      {
        year: '1994',
        value: 5,
        type: '???',
      },
      {
        year: '1995',
        value: 4,
        type: '???',
      },
      {
        year: '1996',
        value: 6,
        type: '???',
      },
      {
        year: '1997',
        value: 7,
        type: '???',
      },
      {
        year: '1998',
        value: 9,
        type: '???',
      },
      {
        year: '1999',
        value: 13,
        type: '???',
      },
      {
        year: '1991',
        value: 3,
        type: '???',
      },
      {
        year: '1992',
        value: 4,
        type: '???',
      },
      {
        year: '1993',
        value: 3,
        type: '???',
      },
      {
        year: '1994',
        value: 5,
        type: '???',
      },
      {
        year: '1995',
        value: 4,
        type: '???',
      },
      {
        year: '1996',
        value: 6,
        type: '???',
      },
      {
        year: '1997',
        value: 7,
        type: '???',
      },
      {
        year: '1998',
        value: 9,
        type: '???',
      },
      {
        year: '1999',
        value: 13,
        type: '???',
      },
    ];
    const config = {
      data: data.reverse(),
      width: 300,
      height: 300,
      isStack: true,
      xField: 'value',
      yField: 'year',
      seriesField: 'type',
      label: {
        // ??????????????? label ??????????????????
        position: 'middle',
        // 'left', 'middle', 'right'
        // ??????????????????????????????
        layout: [
          // ???????????????????????????????????????
          {
            type: 'interval-adjust-position',
          }, // ?????????????????????
          {
            type: 'interval-hide-overlap',
          }, // ?????????????????????????????????
          {
            type: 'adjust-color',
          },
        ],
      },
    };
    return <Bar {...config} />;
  };
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log(1, this.props);
    }
    handleClick() {
        // this.props.history.push('/login')
    }
    render() {
        return (
            <div>
                <h3 onClick={this.handleClick.bind(this)}>????????????</h3>
                <div style={{ background: '#ECECEC', padding: 5 }}>

                    <div style={{display: 'flex', marginBottom: 5}}>
                        <Card title="????????????" size="small" bordered={false} bodyStyle={{padding: 12}} style={{ marginRight: 5, width: '33.3%'}}>
                            <DemoLine />
                        </Card>
                        <Card title="????????????" size="small" bordered={false} bodyStyle={{padding: 12}} style={{ marginRight: 5, width: '33.3%' }}>
                            <DemoPie />
                        </Card>
                        <Card title="????????????" size="small" bordered={false} style={{ width: '33.3%' }}>
                            <DemoBar />
                        </Card>
                    </div>

                    <div style={{display: 'flex', marginBottom: 5}}>
                        <Card size="small" title="????????????" bordered={false} bodyStyle={{padding: 12}} style={{ marginRight: 5, width: '50%' }}  >
                          <DemoArea />
                        </Card>
                        <Card size="small" title="????????????" bordered={false} bodyStyle={{padding: 12}} style={{ width: '50%' }}>
                            <DemoScatter />
                        </Card>
                    </div>

                </div>
  
            </div>
        );
    }
}
export default Home;
