import React from 'react';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
    <Header/>
    <main className='py-3'>
    <Container>
     <Outlet/>

    </Container>
    </main>
    <Footer/>
    <ToastContainer/>
    </div>
  )
}

export default App
