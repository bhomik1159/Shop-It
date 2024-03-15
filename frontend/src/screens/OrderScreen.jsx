import React ,{ useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link , useParams } from 'react-router-dom';
import { Row,Col,ListGroup,Image,Button,Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { PayPalButtons,usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useGetOrderDetailsQuery,usePayOrderMutation,useGetPayPalClientIdQuery,useDeliverOrderMutation } from '../slices/orderApiSlice'; 

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const { data: order , refetch , isLoading , error } = useGetOrderDetailsQuery( orderId );
    const [ payOrder , {isLoading: loadingPay} ] = usePayOrderMutation();
    const [deliverOrder,{isLoading: loadingDeliver}] =useDeliverOrderMutation();

    const [ {isPending},paypalDispatch ] = usePayPalScriptReducer();

    const {userInfo} = useSelector((state)=>state.auth);

    const { data: paypal,isLoading:loadingPayPal, error:errorPayPal } = useGetPayPalClientIdQuery();

    useEffect(()=>{
        if(!errorPayPal && !loadingPayPal && paypal.clientId){
            const loadPayPalScript = async () =>{
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'clientId': paypal.clientId,
                        currency: 'USD',
                    }
                });
                paypalDispatch({type: 'setLoadingStatus', value: 'pending'});               
            }
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript();
                }
            }
        }
    },[order,paypal,paypalDispatch,loadingPayPal,errorPayPal]);
    function onApprove(data,actions){
        return actions.order.capture().then(async function(details){
            try{
                await payOrder({orderId,details});
                refetch();
                toast.success('Payment Successful');
            }catch(error){
                toast.error(error?.data?.message || error.message);
            }

        });
    }
    async function onApproveTest(){
        await payOrder({orderId,details: {payer: {}}});
                refetch();
                toast.success('Payment Successful');
    }
    function createOrder(data,actions){
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId)=>{
            return orderId;
        });
    }
    function onError(error){
        toast.error(error.message);
    }
    async function deliverOrderHandler(){
        try{
            await deliverOrder(orderId);
            refetch();
            toast.success('Order Delivered');
        }
        catch(error){
            toast.error(error?.data?.message || error.message);
        }
    }


  return (
    isLoading ? (<Loader/>)
    : error ? (<Message variant='danger'/>)
    : (
        <>
            <h1>Order {orderId}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (<Message variant='success'> Delivered on {order.deliveredAt}</Message>) : (<Message variant='danger'>Not Delivered</Message>) }
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                            {order.isPaid ? (<Message variant='success'> Paid on {order.paidAt}</Message>) : (<Message variant='danger'>Not Paid</Message>) }
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.map((item,index)=>(
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${item.qty*item.price} 
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup.Item>

                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>                          
                    <Row>
                        <Col>Shipping:</Col>
                        <Col>
                            ${order.shippingPrice}
                        </Col>
                    </Row>
                    <Row>
                        <Col>Tax:</Col>
                        <Col>
                            ${order.taxPrice}
                        </Col>
                    </Row>
                    <Row>
                        <Col>Total:</Col>
                        <Col>
                            ${order.totalPrice}
                        </Col>
                    </Row>
                    {!order.isPaid && (
                        <ListGroup.Item>
                        {loadingPay && <Loader/>}
                        {isPending ? <Loader/> : (
                            <>
                            <Button onClick={onApproveTest} style={{marginBottom: '10px'}}>Test Pay Order</Button>
                            <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                            </>                                
                        )}
                        </ListGroup.Item>
                    )}
                </ListGroup.Item>
                {loadingDeliver && <Loader/>}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                        <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                            Mark As Delivered
                        </Button>
                    </ListGroup.Item>
                )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
  );
};

export default OrderScreen
