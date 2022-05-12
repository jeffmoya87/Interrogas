import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import CurrentElection from './CurrentElection';
import CandidateBios from './CandidateBios';
import './current.css';
import MultipleLineChart from '../../components/charts/MultipleLineChart';

const PublicPage = () => {
    return (
        <>
            <Row>
                <Col className="page-title-center image-logo-container">
                    <img
                        src="https://bit.ly/3EBBcHq"
                        alt="Voting Box"
                        className="rounded-circle"
                        style={{ height: '150px', maxWidth: '700px', paddingTop: '20px' }}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3 className="page-title-box page-header">Who Will Win The Election</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="page-title-box sub-header">These Are the Current Polls</div>
                </Col>
            </Row>

            <Row>
                <CurrentElection />
            </Row>

            <Row>
                <Col className="col-7 m-auto">
                    <MultipleLineChart />
                </Col>
            </Row>

            <Row>
                <Col className="col-7 m-auto">
                    <Card.Body>
                        <h3>The Candidates</h3>
                    </Card.Body>
                </Col>
            </Row>

            <Row>
                <CandidateBios />
            </Row>
        </>
    );
};

export default PublicPage;
