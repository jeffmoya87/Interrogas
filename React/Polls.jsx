import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import logger from 'sabio-debug';
import * as pollsService from '../../../services/pollsService';
import PollsChild from './PollsChild';
import CampaignPagination from './CampaignPagination';
import { CSVLink } from 'react-csv';

const _logger = logger.extend('dashboardPolls');

const Polls = () => {
    const [pollsInfo, setPollsInfo] = useState({
        pollsArr: [],
        page: 0,
        pageSize: 5,
        totalPolls: 0,
        totalPages: 0,
        startIndex: 0,
        endIndex: 0,
    });

    useEffect(() => {
        pollsService.listAll(pollsInfo.page, pollsInfo.pageSize).then(onGetPollsSuccess).catch(onGetPollsFail);
    }, []);

    const onGetPollsSuccess = (response) => {
        const data = response.data.item;
        setPollsInfo((prevState) => {
            const pd = { ...prevState };
            pd.page = data.pageIndex;
            pd.startIndex = (data.pageIndex + 1) * data.pageSize - data.pageSize + 1;
            pd.endIndex = (data.pageIndex + 1) * data.pageSize;
            pd.totalPolls = data.totalCount;
            pd.totalPages = data.totalPages;
            pd.pollsArr = data.pagedItems;
            return pd;
        });
    };

    const headers = [
        { label: 'Pollster Name', key: 'pollster.name' },
        { label: 'Date Poll Taken', key: 'dateTaken' },
        { label: 'Election Year', key: 'electionYear' },
    ];

    const csvReport = {
        filename: 'Polls.csv',
        headers: headers,
        data: pollsInfo.pollsArr,
    };

    const nextPageClicked = () => {
        pollsService
            .listAll(pollsInfo.page + 1, pollsInfo.pageSize)
            .then(onGetPollsSuccess)
            .catch(onGetPollsFail);
    };

    const prevPageClicked = () => {
        pollsService
            .listAll(pollsInfo.page - 1, pollsInfo.pageSize)
            .then(onGetPollsSuccess)
            .catch(onGetPollsFail);
    };

    const setPaginationSize = (size) => {
        setPollsInfo((prevState) => {
            const pd = { ...prevState };
            pd.pageSize = size;
            return pd;
        });
        pollsService.listAll(0, size).then(onGetPollsSuccess).catch(onGetPollsFail);
    };

    const onGetPollsFail = (err) => {
        _logger('onGetPollsError', err);
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
                <Row className="cardCenter rowPadding">Polls</Row>
                <Row>
                    <Col className="col-1"></Col>
                    <Col className="divCenter">Pollster</Col>
                    <Col className="divCenter">Date Taken</Col>
                    <Col className="divCenter">Election Year</Col>
                </Row>
            </Card.Title>
            <Card.Body className="cardScroll">
                <PollsChild pollsArr={pollsInfo.pollsArr} />
            </Card.Body>
            <Card.Footer className="cardSticky">
                <CampaignPagination
                    total={pollsInfo.totalPolls}
                    page={pollsInfo.page}
                    startIndex={pollsInfo.startIndex}
                    endIndex={pollsInfo.endIndex}
                    totalPages={pollsInfo.totalPages}
                    pageSize={pollsInfo.pageSize}
                    onGetPrevPage={prevPageClicked}
                    onGetNextPage={nextPageClicked}
                    onSetPaginationSize={setPaginationSize}
                />
            </Card.Footer>
        </Card>
    );
};

export default Polls;
