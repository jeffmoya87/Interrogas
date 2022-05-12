import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CountryMap from './CountryMap';
import Pollsters from './Pollsters';
import Polls from './Polls';
import Surveys from './Surveys';
import ElectionResults from './ElectionResults';
import './campaign.css';

const CampaignDashboardPage = () => {
    return (
        <>
            <Row>
                <Col>
                    <div className="page-title-box dashboardTitle">
                        <h1 className="page-title">Campaign Dashboard</h1>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <CountryMap />
                </Col>
            </Row>

            <Row>
                <Col xl={4} lg={12}>
                    <Pollsters />
                </Col>
                <Col xl={4} lg={12}>
                    <Polls />
                </Col>
                <Col xl={4} lg={12}>
                    <Surveys />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ElectionResults />
                </Col>
            </Row>
        </>
    );
};

export default CampaignDashboardPage;
