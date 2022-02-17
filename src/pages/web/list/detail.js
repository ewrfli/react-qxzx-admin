import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import api from '../../../api'
import './detail.less'

class ArticleDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      data: {
        title: ''
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const id = nextProps.match.params.id
    const preId = this.props.match.params.id
    id !== preId && this.getDetail(id)
  }
  componentDidMount () {
    const id = this.props.match.params.id
    this.getDetail(id)
  }
  async getDetail (id) {
    const {data} = await api.get('/article/detail', {id})
    this.setState({data})

  }
  render () {
    const { data } = this.state

    const extra = <div className='content-extra'>
      <Icon type='calendar' style={{ marginRight: 8 }} />
      { data.createdAt }
      <Icon type="eye" style={{ marginRight: 8, marginLeft: 8 }} />
      { data.readedCount } 次预览
    </div>

    return (
      <div>
        <Card
        title={data.title}
        extra={extra}
        >
          ArticleDetail
        </Card>
      </div> 
    )
  }
}

export default ArticleDetail