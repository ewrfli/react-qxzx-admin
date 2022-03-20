import React from 'react'
import { color, timetrans } from '../../../utils'
import { Table, Form, Button, Input, message, Modal, Tag, Upload, Icon } from 'antd';
import api from '../../../api'

// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class Company extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upImgApi: 'http://127.0.0.1:3002/upload/img',
      loading: false,
      delModalvisible: false, //显示弹弹窗
      addModalvisible: false,
      companyItemData: {},
      companyAddData: {
        risk_name: null,
        risk_coverimg: null,
        risk_desc: null,
        risk_tag: null,
        risk_grade: null,
        company_id: null,
        risk_date: null,
      },
      isEdit: false,
      search_company_name: '',//
      pageNo: 1,
      pageSize: 10,
      total: null,
      data: [],
      columns: [
        {
          title: '风险ID',
          dataIndex: 'risk_id',
          key: 'risk_id',
          width: 80,
          align: 'center'
        },
        {
          title: '风险名称',
          width: 100,
          key: 'risk_name',
          dataIndex: 'risk_name',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '风险等级',
          width: 100,
          key: 'risk_grade',
          dataIndex: 'risk_grade',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '公司id',
          key: 'company_id',
          dataIndex: 'company_id',
          width: 80,
          align: 'center'
        },
        {
          title: '风险标签',
          dataIndex: 'risk_tag',
          key: 'risk_tag',
          width: 130,
          align: 'center'
        },
        {
          title: '风险时间',
          key: 'risk_date',
          dataIndex: 'risk_date'
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          render: record => (
            <span>
              <Button size='small' type='danger' className='mr10' onClick={this.delClick.bind(this, record)}>delete</Button>
              <Button size='small' type="primary" onClick={this.editClick.bind(this, record)}>edit</Button>
            </span>
          ),
        }
      ]
    }
  }

  // 初始化
  componentDidMount() {
    this.props.form.validateFields();
    this.getList()
  }
  // 请求数据
  async getList () {
    this.setState({loading: true})
    const params = {
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize
    }
    const {data, total } = await api.get('risk/list', params)
    // data.forEach((item, index) => {
    //   item.index = this.state.pageSize * (this.state.pageNo - 1) + index + 1
    // })
    this.setState({
      data,
      total,
      loading: false
      })
  }

  // 新增用户
    //取消新增弹窗显示
    handleAddCancel() {
      console.log('取消新增弹窗显示')
      this.setState( {companyAddData: {}, addModalvisible: false, isEdit: false} )
    }
    //新增弹窗确认
    async handleAddOk() {
      console.log('新增弹窗确认')
      let params = { ...this.state.companyAddData }

      if(this.state.isEdit){ //如果是编辑
        const {code, data} = await api.post('risk/update', params)
        if (code) { message.success('编辑成功！' + code); this.setState( {isEdit: false }) }
        else {message.error(data)}
      }else{
        const {code, data} = await api.post('risk/add', params)
        if (code) message.success('新增成功！' + code)
        else message.error(data)
      }
      this.getList()
      this.setState( {companyAddData: {}, addModalvisible: false} )
    }

  /**
  * 双向绑定 input 修改方法
  */
  inputDataChange(event, objkey, objvalue) {
    let value = null
    event ? value = event.target.value : value = objvalue
    // let value = event.target.value || objvalue;
    let companyAddData = this.state.companyAddData;
    this.setState({
      companyAddData: {
        ...companyAddData, //拷贝当前对象
        [objkey]: value,//修改你要改的当前对象的那个属性值
      }
    });
    console.log('this.state.companyAddData;',this.state.companyAddData)
  }

  //上传
  upAvatarimg(file) {
    console.log(file)
    let imgurl = null;
    if(file.file.response){
      imgurl = file.file.response.path
      this.inputDataChange(null,'risk_coverimg',imgurl)
    }else{
      console.log("上传失败")
    }

    console.log('this.state.companyAddData;',this.state.companyAddData)
    // const {code, data} = await api.post('upload/img', params)
  }
  //日期选择弹窗
  onDateChange(e){ 
    let moent = timetrans(e._d)
    this.inputDataChange(null,'user_birthday',moent)
  }
  //编辑弹窗显示
  async editClick (record) {
    console.log('update',record)
    await this.setState( {companyAddData: {...record}, addModalvisible: true, isEdit: true} )
  }

  //删除
  //删除弹窗显示
  async delClick(record) {
    await this.setState( {companyItemData: record, delModalvisible: true} )
    console.log(record,this.state.companyItemData)
  }
  //取消删除弹窗显示
  handleDelCancel() {
    this.setState( {companyItemData: {}, delModalvisible: false} )
  }
  //删除弹窗确认删除
  async handleDelOk() {
    console.log(this.state.companyItemData)
    await api.post('user/del', {user_id: this.state.companyItemData.user_id})
    message.success('删除成功')
    this.getList()
    this.setState( {companyItemData: {}, delModalvisible: false} )
  }


  // 查询
  async handdleSearchChange (e) {
    // console.log('e.target.value',e.target.value)
    // this.setState({search_company_name: e.target.value})
    await this.setState({
      pageNo: 1,
      search_company_name: e.target.value || ''
    })
    // this.getList()
  }
  async toSearch () {
    console.log('toSearch')
    this.getList()
  }


  // 更改page
  async handleOnChange (page) {
    await this.setState({
      pageNo: page.current,
      pageSize: page.pageSize
    })
    this.getList()
  }

  render() {
    const { companyItemData, isEdit, upImgApi } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 5 },
        xxl: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 12 }
      }
    }
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        {/* 确认删除弹窗 */}
        <Modal
          title="确认删除"
          visible={ this.state.delModalvisible }
          onOk={this.handleDelOk.bind(this)}
          onCancel={ this.handleDelCancel.bind(this) }>
            <p>确认删除公司：{companyItemData ? companyItemData.company_name : ''}</p>
        </Modal>
        {/* 添加弹窗 */}
        <Modal
          title={isEdit ? "编辑风险" : "添加风险"}
          visible={ this.state.addModalvisible }
          onOk={this.handleAddOk.bind(this)}
          onCancel={ this.handleAddCancel.bind(this) }>
           
            <Form onSubmit={this.handleAddOk} {...formItemLayout}>
            · <Form.Item label='风险Logo'>
                <Upload
                  name="myfile"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={upImgApi}
                  onChange={e => this.upAvatarimg(e)}
                >
                  {this.state.companyAddData.risk_coverimg ? <img src={this.state.companyAddData.risk_coverimg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label='风险Logo'>
                <Input placeholder="风险Logo" allowClear value={ this.state.companyAddData.risk_coverimg } onChange={(e) => this.inputDataChange(e, 'risk_coverimg')}/>
              </Form.Item>
              <Form.Item label='风险名'>
                <Input placeholder="请输入风险名" allowClear value={ this.state.companyAddData.risk_name } onChange={(e) => this.inputDataChange(e, 'risk_name')}/>
              </Form.Item>
              <Form.Item label='风险描述'>
                <Input placeholder="请输入风险描述" allowClear value={ this.state.companyAddData.risk_desc } onChange={(e) => this.inputDataChange(e, 'risk_desc')}/>
              </Form.Item>
              <Form.Item label='风险标签'>
                <Input placeholder="请输入风险标签" allowClear value={ this.state.companyAddData.risk_tag } onChange={(e) => this.inputDataChange(e, 'risk_tag')}/>
              </Form.Item>
              <Form.Item label='风险等级'>
                <Input placeholder="请输入风险等级1/2/3" allowClear value={ this.state.companyAddData.risk_grade } onChange={(e) => this.inputDataChange(e, 'risk_grade')}/>
              </Form.Item>
              <Form.Item label='公司ID'>
                <Input placeholder="请输入公司ID" allowClear value={ this.state.companyAddData.company_id } onChange={(e) => this.inputDataChange(e, 'company_id')}/>
              </Form.Item>
              <Form.Item label='风险日期'>
                <Input placeholder="请输入风险日期xxxx-xx-xx" allowClear value={ this.state.companyAddData.risk_date } onChange={(e) => this.inputDataChange(e, 'risk_date')}/>
              </Form.Item>
            </Form>
        </Modal>
        {/* 头部 */}
        <Form layout="inline">
          <Form.Item>
            <Input placeholder="请输入风险名搜索" value={ this.state.search_company_name } onChange={ e => this.handdleSearchChange(e) } onPressEnter={ e => this.toSearch(e)} />
          </Form.Item>
          <Form.Item>
            <Button className='mr10' type="primary" onClick={ e => this.toSearch(e)}>search</Button>
            <Button type='primary' onClick={ _ => this.setState({addModalvisible: true}) }>create</Button>
        </Form.Item>
      </Form>
      
      {/* 表格 */}
      <Table
        bordered
        className='mt10'
        pagination={{
          current: this.state.pageNo,
          showSizeChanger: true,
          total: this.state.total,
          pageSize: this.state.pageSize,
          pageSizeOptions: ['10', '20', '30', '40'],
          showTotal (total) { return `Total ${total} `}
        }}
        loading={ this.state.loading }
        columns={ this.state.columns }
        dataSource={ this.state.data }
        rowKey={record => record.company_id}
        onChange={(page) => this.handleOnChange(page)}
      />

      </div>
    )
  }
}
const article = Form.create({ name: 'horizontal_login' })(Company)

export default article