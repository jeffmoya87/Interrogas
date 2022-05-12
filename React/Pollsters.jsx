import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import * as pollsterService from '../../../services/pollstersService';
import logger from 'sabio-debug';
import PollstersChild from './PollstersChild';
import CampaignPagination from './CampaignPagination';
import { CSVLink } from 'react-csv';

const _logger = logger.extend('dashboardPollsters');

const Pollsters = () => {
    const [pollsterInfo, setPollsterData] = useState({
        pollsterArr: [],
        page: 0,
        pageSize: 5,
        totalPollsters: 0,
        totalPages: 0,
        startIndex: 0,
        endIndex: 0,
    });

    useEffect(() => {
        pollsterService
            .getPollsters(pollsterInfo.page, pollsterInfo.pageSize)
            .then(onGetPollstersSuccess)
            .catch(onGetPollstersFail);
    }, []);

    const onGetPollstersSuccess = (response) => {
        const data = response.data.item;
        setPollsterData((prevState) => {
            const pd = { ...prevState };
            pd.page = data.pageIndex;
            pd.startIndex = (data.pageIndex + 1) * data.pageSize - data.pageSize + 1;
            pd.endIndex = (data.pageIndex + 1) * data.pageSize;
            pd.totalPollsters = data.totalCount;
            pd.totalPages = data.totalPages;
            pd.pollsterArr = data.pagedItems;
            return pd;
        });
    };

    const headers = [{ label: 'Pollster Logo', key: 'logoUrl' }];

    const csvReport = {
        filename: 'DashboardPollsters.csv',
        headers: headers,
        data: pollsterInfo.pollsterArr,
    };

    const nextPageClicked = () => {
        pollsterService
            .getPollsters(pollsterInfo.page + 1, pollsterInfo.pageSize)
            .then(onGetPollstersSuccess)
            .catch(onGetPollstersFail);
    };

    const prevPageClicked = () => {
        pollsterService
            .getPollsters(pollsterInfo.page - 1, pollsterInfo.pageSize)
            .then(onGetPollstersSuccess)
            .catch(onGetPollstersFail);
    };

    const setPaginationSize = (size) => {
        setPollsterData((prevState) => {
            const pd = { ...prevState };
            pd.pageSize = size;
            return pd;
        });
        pollsterService.getPollsters(0, size).then(onGetPollstersSuccess).catch(onGetPollstersFail);
    };

    const onGetPollstersFail = (err) => {
        _logger(err);
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
                <Row className="cardCenter rowPadding">Pollsters</Row>
                <Row align="center">
                    <Col className="divCenter">Name</Col>
                    <Col className="divCenter">Accuracy</Col>
                    <Col className="col-1"></Col>
                </Row>
            </Card.Title>
            <Card.Body className="cardScroll">
                <PollstersChild pollsterArr={pollsterInfo.pollsterArr} />
            </Card.Body>
            <Card.Footer className="cardSticky">
                <CampaignPagination
                    total={pollsterInfo.totalPollsters}
                    page={pollsterInfo.page}
                    startIndex={pollsterInfo.startIndex}
                    endIndex={pollsterInfo.endIndex}
                    totalPages={pollsterInfo.totalPages}
                    pageSize={pollsterInfo.pageSize}
                    onGetPrevPage={prevPageClicked}
                    onGetNextPage={nextPageClicked}
                    onSetPaginationSize={setPaginationSize}
                />
            </Card.Footer>
        </Card>
    );
};

export default Pollsters;
