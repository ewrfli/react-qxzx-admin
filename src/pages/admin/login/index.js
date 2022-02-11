import React from 'react'

class Login extends React.Component {
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
        <h3>welcome Login</h3>
      </div>
    )
  }
}
export default Login