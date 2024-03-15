import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';
import {Button,Row,Col,Form} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery,useCreateProductMutation,useDelteProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';

const ProductsListScreen = () => {
    const {pageNumber} =useParams();
    const {data,isLoading , error,refetch} = useGetProductsQuery({pageNumber});
    const [createProduct]= useCreateProductMutation();
    const [deleteProduct]=useDelteProductMutation();
    async function createProductHandler(){
        if(window.confirm('Are You Sure You Want To Create A New Product ?')){
            try{
                await createProduct();
                refetch();
                toast.success('New Product Created');
    
            }catch(error){
                toast.error(error?.data?.message || error.message);
            }
        }
    }
    async function deleteHandler(productId){
        if(window.confirm('Are You Sure You Want To Dete The Product ?')){
            try{
                await deleteProduct(productId);
                refetch();
                toast.success('Product Deleted');
    
            }catch(error){
                toast.error(error?.data?.message || error.message);
            }
        }
    }
  return (
    <>
      <Row className='align-items-center'>
        <Col>
            <h1>Products</h1>
        </Col>
        <Col className='text-end'>
            <Button className='btn-sm m-3' onClick={createProductHandler}>
                <FaEdit/> Create Product
            </Button>
        </Col>
      </Row>
      {isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error}</Message>) : (
        <>
            <Form striped hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>                        
                    </tr>
                </thead>
                <tbody>
                    {data.products.map((product)=>(
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}><Button className='btn-sm mx-2' variant='light'><FaEdit/></Button></LinkContainer>
                                <Button variant='danger' className='btn-sm' onClick={()=>deleteHandler(product._id)}><FaTrash/></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Form>
            <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
        </>
      )}
    </>
  )
}

export default ProductsListScreen
