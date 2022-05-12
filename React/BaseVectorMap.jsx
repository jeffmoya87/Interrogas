import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const BaseVectorMap = ({ width, height, options, type }) => {
    const selectorId = type + new Date().getTime();
    const [map, setMap] = useState();

    useEffect(() => {
        if (!map) {
            const map = new window['jsVectorMap']({
                selector: '#' + selectorId,
                map: type,
                ...options,
            });

            setMap(map);
        }
    }, [selectorId, map, options, type]);
    return (
        <>
            <div id={selectorId} style={{ width: width, height: height }}></div>
        </>
    );
};

BaseVectorMap.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    options: PropTypes.shape({}),
    type: PropTypes.string,
};

export default BaseVectorMap;
