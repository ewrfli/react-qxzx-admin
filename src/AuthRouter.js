import React from 'react';
import { Route,Redirect } from 'react-router-dom';
              
//使用时: <AuthRoute path="" component={...} /> 

const AuthRoute = ( {component: Component, ...rest} )=>{ //标签传入的参数compoennt，并重命名Component

    return <Route {...rest} render={props=>{

        let isLogin = localStorage.getItem('adminToken');  

        if(isLogin){

            return <Component  {...props}/> //如果登录了就渲染组件

        }else{
                        //如没登录，就重定向到登录页面，并且通过属性state指定登录成功后要跳转回之前的页面路径
            return <Redirect to={ {pathname:'/login',state:{from: props.location}} }/>

        }
    }}></Route>
}

export default AuthRoute;