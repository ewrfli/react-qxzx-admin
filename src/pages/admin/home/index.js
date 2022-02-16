import React from 'react';
import ReactWEditor from 'wangeditor-for-react';
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
                <h3>welcome</h3>
                <ReactWEditor
                    defaultValue={'<h1>标题</h1>'}
                    linkImgCallback={(src, alt, href) => {
                        // 插入网络图片的回调事件
                        console.log('图片 src ', src);
                        console.log('图片文字说明', alt);
                        console.log('跳转链接', href);
                    }}
                    onlineVideoCallback={(video) => {
                        // 插入网络视频的回调事件
                        console.log('插入视频内容', video);
                    }}
                    onChange={(html) => {
                        console.log('onChange html:', html);
                    }}
                    onBlur={(html) => {
                        console.log('onBlur html:', html);
                    }}
                    onFocus={(html) => {
                        console.log('onFocus html:', html);
                    }}
                />
            </div>
        );
    }
}
export default Home;
