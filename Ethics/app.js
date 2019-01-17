d3.csv('sample.csv').then(res => {
    console.error(res, 'rsp');

    const getActionKeys = Object.keys(res[0]).filter(
        k => k.indexOf('Action') > -1
    );
    const validData = getActionKeys.map(k => {
        const filterData = res
            .filter(r => r[k] !== 'FIND_FAILED' && r[k] !== 'FIT_FAILED')
            .map(e => e[k]);
        return {
            actionKey: k,
            data: filterData
        };
    });
    const keys = ['NotActive', 'B', 'A', 'C', 'D'];
    const dataWithEmotions = validData.map(vd => {
        const getUniqueEmotions = _.uniqBy(vd.data);

        const countEmotions = getUniqueEmotions.map(emotion => {
            const count = vd.data.filter(vde => vde === emotion).length;
            return {
                emotion,
                count
            };
        });

        const fillValues = keys.map(k => {
            const f = countEmotions.filter(ce => ce.emotion === k);
            if (f && f.length) {
                return {
                    emotion: f[0].emotion,
                    count: f[0].count
                };
            }
            return {
                emotion: k,
                count: 0
            };
        });

        const sorted = _.sortBy(fillValues, 'emotion');

        return {
            actionKey: vd.actionKey,
            countEmotions: sorted
        };
    });
    console.error(dataWithEmotions, 'faf');
    console.log(JSON.stringify(dataWithEmotions))
});
