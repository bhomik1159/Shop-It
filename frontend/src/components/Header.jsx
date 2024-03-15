import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Badge,Navbar,Nav,Container, NavbarToggle, NavbarCollapse, NavDropdown} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { FaShoppingCart,FaUser } from "react-icons/fa";
import { SiShopware } from "react-icons/si";
import { useSelector,useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';


const Header = () => {
  const {cartItems} = useSelector((state)=>state.cart);
  const {userInfo} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutAPICall]= useLogoutMutation();
  const logoutHandler =async()=>{
    try{
      await logoutAPICall().unwrap();
    dispatch(logout());
    navigate('/login');
    }
    catch(error){
      console.log('not working');
    }
    
  }
  return (
    <div>
    <header>
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
            <Container >
            <LinkContainer to='/'>
            <Navbar.Brand><SiShopware/>  Shop It</Navbar.Brand>
            </LinkContainer>
            <NavbarToggle aria-controls='basic-navbar-nav' />
            <NavbarCollapse id='basic-navbar-nav'>
                <Nav className='ms-auto'>
                <SearchBox/>
                <LinkContainer to='/cart'><Nav.Link><FaShoppingCart/> Cart{
                  cartItems.length > 0 && (
                    <Badge pill bg='danger' style={{marginLeft: '5px'}}>
                    {cartItems.reduce((acc,item)=>acc+item.qty,0)}
                    </Badge>
                  )
                }</Nav.Link></LinkContainer>
                {userInfo ? 
                (<NavDropdown title={userInfo.name} id='username'><LinkContainer to='/profile'><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer><NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item></NavDropdown>)
                 : (<LinkContainer to='/login'><Nav.Link ><FaUser/> Sign In</Nav.Link></LinkContainer>)}
                 {userInfo && userInfo.isAdmin && (
                  <NavDropdown title='admin' id='adminmenu'>
                    <LinkContainer to='admin/productlist'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='admin/userlist'>
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='admin/orderlist'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>)}
                </Nav>
            </NavbarCollapse>
            </Container>
        </Navbar>
    </header>
      
    </div>
  )
}

export default Header
