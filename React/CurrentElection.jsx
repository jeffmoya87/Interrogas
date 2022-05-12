import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { getCandidateById } from '../../services/candidatesService';
import logger from 'sabio-debug';
import './current.css';
const _logger = logger.extend('CurrentElection');

const CurrentElection = () => {
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
        <Card>
            <Card.Body>
                <Row className="align-items-center">
                    <Col></Col>
                    <div className="col-1">
                        <Image
                            src={candidateInfo.avatar}
                            alt="candidate1"
                            align="right"
                            className="image-responsive rounded-circle"
                            style={{ maxWidth: 400, height: 100 }}
                        />
                    </div>
                    <div className="col-2 pad-remove">
                        <div className="card-body candidate-card text-align-center border-right">
                            <h5 className="card-title">
                                {candidateInfo.givenName} {candidateInfo.surnames}
                            </h5>
                            <p className="card-text">{candidateInfo.party}</p>
                        </div>
                    </div>
                    <div className="col-2 pad-remove">
                        <div className="card-body candidate-card text-align-center">
                            <h5 className="card-title">
                                {candidateInfo2.givenName} {candidateInfo2.surnames}
                            </h5>
                            <p className="card-text">{candidateInfo2.party}</p>
                        </div>
                    </div>

                    <div className="col-1">
                        <Image
                            src={candidateInfo2.avatar}
                            alt="candidate2"
                            align="left"
                            className="image-responsive rounded-circle"
                            style={{ maxWidth: 400, height: 100 }}
                        />
                    </div>
                    <Col></Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default CurrentElection;
