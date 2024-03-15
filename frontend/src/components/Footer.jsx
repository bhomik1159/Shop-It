import React from 'react';
import {Container,Row,Col} from 'react-bootstrap';

const Footer = () => {
    let date = new Date().getFullYear();
  return (
    <div>
      <footer>
        <Container>
        <Row>
            <Col className='text-center py-3'>
            <p>Shop It &copy; {date}</p>
            </Col>
        </Row>
        </Container>
      </footer>
    </div>
  )
}

export default Footer
