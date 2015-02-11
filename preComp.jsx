//quick precomp and set workarea script
//version 4.2
//update 2014.12.10 22:23
//usage:select the layers you wanna precompose and Leave all attributes
//copyright (c) songz meng

(function quickPrecomp() {

    //global

    qP_Data = new Object();
    qP_Data.scriptName = "quickPrecomp";
    qP_Data.scriptTitle = qP_Data.scriptName + " v4.1";
    qP_Data.NoComp = {
        en: "Please select a single composition in the Project panel, and try again.",
        cn: "在项目面板选中或打开一个合成"
    };
    qP_Data.NoLayer = {
        en: "Please add some layers, and try again.",
        cn: "没有图层，添加一个试试"
    };

    //localize

    function qP_localize(Var) {
        if (app.isoLanguage === "zh_CN") {
            return Var["cn"];
        } else {
            return Var["en"];
        }
    }

    //error detect

    aI = app.project.activeItem;

    if ((aI === null) || !(aI instanceof CompItem)) {
        alert(qP_localize(qP_Data.NoComp), qP_Data.scriptName, "x");
        return;
    }
    if (aI.numLayers == 0) {
        alert(qP_localize(qP_Data.NoLayer), qP_Data.scriptName, "x");
        return;
    }

    //main function

    app.beginUndoGroup(qP_Data.scriptTitle);
    if (aI.selectedLayers.length == 0) {
        for (t = 1; t <= aI.numLayers; t++) {
            aI.layers[t].selected = true;
        }
    }
    sL = aI.selectedLayers;
    sLn = sL.length - 1;
    for (i = 0; i <= sLn; i++) {
        slAry = new Array();
        slAry[0] = sL[i].index;
        oS=sL[i].stretch; //origin stretch
        sL[i].stretch=100;
        aI.layers.precompose(slAry, sL[i].name, false);
        app.project.timeDisplayType = TimeDisplayType.FRAMES;
        iT = sL[i].source;
        fD = iT.frameDuration;
        nA = iT.name;
        fps = 1 / fD;
        iP = timeToCurrentFormat(sL[i].inPoint, fps, false);
        sT = timeToCurrentFormat(sL[i].startTime, fps, false);
        oP = timeToCurrentFormat(sL[i].outPoint, fps, false);
        bG = iP - sT;
        dR = oP - iP;
        eD = bG + dR;
        iT.workAreaStart=iT.layer(1).inPoint = bG * fD;
        iT.layer(1).outPoint = eD * fD;
        iT.displayStartTime = 0;
        iT.workAreaDuration = dR * fD;
        mM = new MarkerValue(bG);
        iT.layer(1).property("Marker").setValueAtTime(bG * fD, mM);
        mM = new MarkerValue(eD-1);
        iT.layer(1).property("Marker").setValueAtTime((eD - 1) * fD, mM);
        sL[i].label = slAry % 16;
        sL[i].stretch = oS;
        sL[i].selected = false;
    }
    app.endUndoGroup();
})();
