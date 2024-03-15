import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {Row,Col} from 'react-bootstrap';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarasoul from '../components/ProductCarasoul';


const HomeScreen = () => {
  const {pageNumber , keyword}= useParams()
  const {data,isLoading,error}=useGetProductsQuery({keyword,pageNumber});
  return (
    <div>
    {!keyword ? (<ProductCarasoul/>) : (<Link to='/' className='btn btn-light'>Go Back</Link>)}
    {isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error?.data?.message||error.error}</Message>) : (
      <>
      <h1>Latest Products</h1>
         <Row>
        {data.products.map((product)=>{
            return (<Col key={product._id}sm={12} md={6} lg={4} xl={3}>
                 <Product product={product}/>
            </Col>)

        })}
         </Row>
         <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''}/>
      </>
    )}  
    </div>
  );
}

export default HomeScreen;
