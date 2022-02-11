import React from 'react'

class Tags extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    console.log(1, this.props)
  }
  handleClick () {
    // this.props.history.push('/login')
  }
  render() {
    return (
      <div>
        <h3>welcome Tags</h3>
      </div>
    )
  }
}
export default Tags