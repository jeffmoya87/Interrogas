import React, { useEffect, useState } from 'react';
import { Card, Row, Button } from 'react-bootstrap';
import electionResultsService from '../../../services/electionResultsService';
import debug from 'sabio-debug';
import ElectionResultsChild from './ElectionResultsChild';
import CampaignPagination from './CampaignPagination';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllCandidates } from '../../../services/candidatesService';
import './campaign.css';
import { CSVLink } from 'react-csv';

const basicSchema = Yup.object().shape({
    query: Yup.string().min(1).max(50).required('Is Required'),
});

const ElectionResults = () => {
    const _logger = debug.extend('ElectionResults');

    const [resultsInfo, setResultsData] = useState({
        resultsArr: [],
        page: 0,
        pageSize: 5,
        totalResults: 0,
        totalPages: 0,
        startIndex: 0,
        endIndex: 0,
    });

    const [candidateInfo, setCandidateInfo] = useState({
        data: [],
        surnames: '',
        query: '',
    });

    useEffect(() => {
        getAllCandidates().then(onGetCandidatesSuccess).catch(onGetCandidatesFail);
    }, []);

    const onGetResultsSuccess = (response) => {
        const data = response.data.item;
        setResultsData((prevState) => {
            const pd = { ...prevState };
            pd.page = data.pageIndex;
            pd.startIndex = (data.pageIndex + 1) * data.pageSize - data.pageSize + 1;
            pd.endIndex = (data.pageIndex + 1) * data.pageSize;
            pd.totalResults = data.totalCount;
            pd.totalPages = data.totalPages;
            pd.resultsArr = data.pagedItems;
            return pd;
        });
    };

    const headers = [
        { label: 'Avatar', key: 'avatarUrl' },
        { label: 'Given Name', key: 'givenName' },
        { label: 'Surnames', key: 'surnames' },
        { label: 'Party', key: 'party' },
        { label: 'Election Date', key: 'electionDate' },
        { label: 'Votes', key: 'votes' },
        { label: 'Percentage', key: 'percentage' },
    ];

    const csvReport = {
        filename: 'ElectionResultsByCandidate.csv',
        headers: headers,
        data: resultsInfo.resultsArr,
    };

    const nextPageClicked = () => {
        electionResultsService
            .getElectionResultsSearch(resultsInfo.page + 1, resultsInfo.pageSize, candidateInfo.query)
            .then(onGetResultsSuccess)
            .catch(onGetResultsFail);
    };

    const prevPageClicked = () => {
        electionResultsService
            .getElectionResultsSearch(resultsInfo.page - 1, resultsInfo.pageSize, candidateInfo.query)
            .then(onGetResultsSuccess)
            .catch(onGetResultsFail);
    };

    const setPaginationSize = (size) => {
        setResultsData((prevState) => {
            const pd = { ...prevState };
            pd.pageSize = size;
            return pd;
        });
        electionResultsService
            .getElectionResultsSearch(0, size, candidateInfo.query)
            .then(onGetResultsSuccess)
            .catch(onGetResultsFail);
    };

    const onGetCandidatesSuccess = (response) => {
        const newArr = response.data.items;
        setCandidateInfo((prevState) => {
            const candidateData = { ...prevState };
            candidateData.data = newArr.map(mapCandidates);
            return candidateData;
        });
    };

    const mapCandidates = (result) => {
        if (result.surnames !== 'Ford' && result.surnames !== 'Hyper') {
            return (
                <option key={result.id} align="center">
                    {result.surnames}
                </option>
            );
        }
    };

    const handleOnChange = (event) => {
        setCandidateInfo((prevState) => {
            return { ...prevState, query: event.target.value };
        });
        electionResultsService
            .getElectionResultsSearch(resultsInfo.page, resultsInfo.pageSize, event.target.value)
            .then(onGetResultsSuccess)
            .catch(onGetResultsFail);
    };

    const onGetResultsFail = (err) => {
        _logger('getSearchResults Fail', err);
    };

    const onGetCandidatesFail = (err) => {
        _logger('getCandidates Fail', err);
    };

    return (
        <Card className="cardHeight">
            <Card.Title className="header-title mt-1 mb-3 cardSticky">
                <Row>
                    <CSVLink {...csvReport}>
                        {resultsInfo.totalResults !== 0 && (
                            <Button variant="link" className="p-0 float-end">
                                Export <i className="mdi mdi-download ms-1 paddingRight"></i>
                            </Button>
                        )}
                    </CSVLink>
                </Row>
                <Row className="cardCenter rowPadding">Election Results</Row>
                <Row>
                    <Formik enableReinitialize={true} initialValues={candidateInfo} validationSchema={basicSchema}>
                        <Form onChange={handleOnChange}>
                            <div className="form-group divCenter">
                                <label htmlFor="query">Candidate Surnames</label>
                            </div>
                            <div className="form-group divCenter">
                                <Field
                                    component="select"
                                    name="query"
                                    className="form-control"
                                    style={{ width: '250px' }}>
                                    <option value="query" align="center">
                                        Search by Candidate
                                    </option>
                                    {candidateInfo.data}
                                </Field>
                                <ErrorMessage name="query" component="div" className="has-error" />
                            </div>
                        </Form>
                    </Formik>
                </Row>
            </Card.Title>
            <Card.Body>
                <ElectionResultsChild resultsArr={resultsInfo.resultsArr} />
            </Card.Body>
            <Card.Footer className="cardSticky">
                <CampaignPagination
                    total={resultsInfo.totalResults}
                    page={resultsInfo.page}
                    startIndex={resultsInfo.startIndex}
                    endIndex={resultsInfo.endIndex}
                    totalPages={resultsInfo.totalPages}
                    pageSize={resultsInfo.pageSize}
                    onGetPrevPage={prevPageClicked}
                    onGetNextPage={nextPageClicked}
                    onSetPaginationSize={setPaginationSize}
                />
            </Card.Footer>
        </Card>
    );
};

export default ElectionResults;
