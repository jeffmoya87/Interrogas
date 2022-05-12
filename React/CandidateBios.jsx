import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import './current.css';
import logger from 'sabio-debug';
import { getCandidateById } from '../../services/candidatesService';

const CandidateBios = () => {
    const _logger = logger.extend('CandidateBios');

    const [candidateInfo, setCandidateInfo] = useState({
        givenName: '',
        surnames: '',
        party: '',
        avatar: '',
        bio: '',
    });

    const [candidateInfo2, setCandidateInfo2] = useState({
        givenName: '',
        surnames: '',
        party: '',
        avatar: '',
        bio: '',
    });

    useEffect(() => {
        onGetCandidate(1);
        onGetCandidate(2);
    }, []);

    const onGetCandidate = (id) => {
        getCandidateById(id).then(onGetCandidateSuccess).catch(onGetCandidateFail);
    };

    const onGetCandidateSuccess = (response) => {
        const newData = response.data.item;
        if (newData.id === 1) {
            setCandidateInfo((prevState) => {
                const cd1 = { ...prevState };
                cd1.givenName = newData.name;
                cd1.surnames = newData.surnames;
                cd1.party = newData.party;
                cd1.avatar = newData.avatarUrl;
                cd1.biography = newData.biography;
                return cd1;
            });
        } else {
            setCandidateInfo2((prevState) => {
                const cd = { ...prevState };
                cd.givenName = newData.name;
                cd.surnames = newData.surnames;
                cd.party = newData.party;
                cd.avatar = newData.avatarUrl;
                cd.biography = newData.biography;
                return cd;
            });
        }
    };

    const onGetCandidateFail = (err) => {
        _logger('getFail', err);
    };

    return (
        <>
            <Card className="candidate-card">
                <Row className="align-items-center">
                    <Col className="col-4">
                        <Image
                            src={candidateInfo.avatar}
                            alt="candidate1"
                            className="rounded-circle"
                            align="right"
                            style={{ maxWidth: '100px' }}
                        />
                    </Col>

                    <Col className="col-8">
                        <Card.Title>
                            {candidateInfo.givenName} {candidateInfo.surnames}
                        </Card.Title>
                        <Card.Body className="pad-remove card-body-size">{candidateInfo.party}</Card.Body>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-7 m-auto">
                        <Card.Body>{candidateInfo.biography}</Card.Body>
                    </Col>
                </Row>
            </Card>
            <Card className="candidate-card">
                <Row className="align-items-center">
                    <Col className="col-4">
                        <Image
                            src={candidateInfo2.avatar}
                            alt="candidate2"
                            align="right"
                            className="rounded-circle"
                            style={{ maxWidth: '100px' }}
                        />
                    </Col>
                    <Col className="col-8">
                        <Card.Title>
                            {candidateInfo2.givenName} {candidateInfo2.surnames}
                        </Card.Title>
                        <Card.Body className="pad-remove card-body-size">{candidateInfo2.party}</Card.Body>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-7 m-auto">
                        <Card.Body>{candidateInfo2.biography}</Card.Body>
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default CandidateBios;
