import React from 'react'
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

const Footer = () => {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted footer_c'>

      <section className='d-flex justify-content-center justify-content-lg-between p-1 border-bottom'>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
              ΣDU
              </h6>
              <p>
                <a href="/adatvedelmi_nyilatkozat" className="text-reset">Adatvédelmi Nyilatkozat</a>
              </p>
              <p>
                <a href="/aszf" className="text-reset">ÁSZF</a>
              </p> 
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Menü</h6>
              <p>
                <a href="/kapcsolat" className="text-reset">Regisztráció</a>
              </p>              
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Kapcsolat</h6>
              <p>
                pinterbence5@gmail.com
              </p>
              <p>
                +36 30 449 4996
              </p>
            </MDBCol>

          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 Copyright: ΣDU
      </div>
    </MDBFooter>
  )
}

export default Footer
