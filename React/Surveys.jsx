import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { getSurveyAll } from '../../../services/surveysService';
import logger from 'sabio-debug';
import SurveysChild from './SurveysChild';
import CampaignPagination from './CampaignPagination';
import './campaign.css';
import { CSVLink } from 'react-csv';

const _logger = logger.extend('surveys');

const Surveys = () => {
    const [surveyInfo, setSurveyData] = useState({
        surveysArr: [],
        page: 0,
        pageSize: 5,
        totalSurveys: 0,
        totalPages: 0,
        startIndex: 0,
        endIndex: 0,
    });

    useEffect(() => {
        getSurveyAll(surveyInfo.page, surveyInfo.pageSize).then(onGetSurveysSuccess).catch(onGetSurveysFail);
    }, []);

    const onGetSurveysSuccess = (response) => {
        const data = response.data.item;
        setSurveyData((prevState) => {
            const pd = { ...prevState };
            pd.page = data.pageIndex;
            pd.startIndex = (data.pageIndex + 1) * data.pageSize - data.pageSize + 1;
            pd.endIndex = (data.pageIndex + 1) * data.pageSize;
            pd.totalSurveys = data.totalCount;
            pd.totalPages = data.totalPages;
            pd.surveysArr = data.pagedItems;
            return pd;
        });
    };

    const headers = [
        { label: 'Survey Name', key: 'name' },
        { label: 'Description', key: 'description' },
    ];

    const csvReport = {
        filename: 'DashboardSurveys.csv',
        headers: headers,
        data: surveyInfo.surveysArr,
    };

    const nextPageClicked = () => {
        getSurveyAll(surveyInfo.page + 1, surveyInfo.pageSize)
            .then(onGetSurveysSuccess)
            .catch(onGetSurveysFail);
    };

    const prevPageClicked = () => {
        getSurveyAll(surveyInfo.page - 1, surveyInfo.pageSize)
            .then(onGetSurveysSuccess)
            .catch(onGetSurveysFail);
    };

    const setPaginationSize = (size) => {
        setSurveyData((prevState) => {
            const pd = { ...prevState };
            pd.pageSize = size;
            return pd;
        });
        getSurveyAll(0, size).then(onGetSurveysSuccess).catch(onGetSurveysFail);
    };

    const onGetSurveysFail = (err) => {
        _logger('surveysFail', err);
    };

    return (
        <Card className="cardHeight">
            <Card.Title className="header-title mt-1 mb-3 cardSticky">
                <Row className="paddingRight">
                    <CSVLink {...csvReport}>
                        <Button variant="link" className="p-0 float-end">
                            Export <i className="mdi mdi-download ms-1"></i>
                        </Button>
                    </CSVLink>
                </Row>
                <Row className="cardCenter rowPadding">Surveys</Row>
                <Row align="center">
                    <Col className="divCenter">Name</Col>
                    <Col className="divCenter">Description</Col>
                    <Col className="col-2"></Col>
                </Row>
            </Card.Title>
            <Card.Body className="cardScroll">
                <SurveysChild surveyArr={surveyInfo.surveysArr} />
            </Card.Body>
            <Card.Footer className="cardSticky">
                <CampaignPagination
                    total={surveyInfo.totalSurveys}
                    page={surveyInfo.page}
                    startIndex={surveyInfo.startIndex}
                    endIndex={surveyInfo.endIndex}
                    totalPages={surveyInfo.totalPages}
                    pageSize={surveyInfo.pageSize}
                    onGetPrevPage={prevPageClicked}
                    onGetNextPage={nextPageClicked}
                    onSetPaginationSize={setPaginationSize}
                />
            </Card.Footer>
        </Card>
    );
};

export default Surveys;
