function fillCategoriesList(callback){
  let catList = {};
  catList['list'] = [];
  dbp.any('select count(*) from cars', [true]).then(data => {
    let makeCutOff = Math.round(data[0]['count'] * cutOffPercent);
    dbp.any('select marka_pojazdu, count(marka_pojazdu) from cars group by marka_pojazdu having count(marka_pojazdu)>' + makeCutOff, [true]).then(data => {
      data.forEach((makeElement, makeIndex) => {
        let isLastMake = false;
        if (makeIndex == (data.length -1)) {
          isLastMake = true;
        }
        let makeList = {};
        makeList['list'] =[];
        makeList['value'] = makeElement['marka_pojazdu'];
        catList['list'].push(makeList);
        dbp.any('select count(*) from cars where marka_pojazdu=\'' + makeElement['marka_pojazdu'] + '\'', [true]).then(data => {
          let modelCutOff = Math.round(data[0]['count'] * cutOffPercent);
          dbp.any('select model_pojazdu, count(model_pojazdu) from cars where marka_pojazdu=\'' + makeElement['marka_pojazdu'] + '\'' + 'group by model_pojazdu having count(model_pojazdu)>' + modelCutOff, [true]).then(data => {
            data.forEach((modelElement, modelIndex) => {
              let isLastModel = false;
              if (modelIndex == (data.length -1)) {
                isLastModel = true;
              }
              let modelList = {};
              modelList['list'] = [];
              modelList['value'] = modelElement['model_pojazdu'];
              catList['list'][makeIndex]['list'].push(modelList);
              dbp.any('select count(*) from cars where marka_pojazdu=\'' + makeElement['marka_pojazdu'] + '\' and model_pojazdu =\'' + modelElement['model_pojazdu'] + '\'', [true]).then(data => {
                let verCutOff = Math.round(data[0]['count'] * cutOffPercent);
                dbp.any('select wersja, count(wersja) from cars where marka_pojazdu=\'' + makeElement['marka_pojazdu'] + '\'and model_pojazdu =\'' + modelElement['model_pojazdu'] + '\'' + 'group by wersja having count(wersja)>' + verCutOff, [true]).then(data => {
                  data.forEach((verElement, verIndex) => {
                    let isLastVer = false;
                    if (verIndex == (data.length -1)) {
                      isLastVer = true;
                    }
                    let varList = {};
                    varList['value'] = verElement['wersja'];
                    catList['list'][makeIndex]['list'][modelIndex]['list'].push(varList);
                    if (isLastMake && isLastModel && isLastVer) {
                      callback(catList);
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};