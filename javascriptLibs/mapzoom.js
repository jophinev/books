var originalMarkerRadius = 5;
var smallMarkerRadius = 3.5;
var svgContainerSize = originalMarkerRadius * 2 + 1;

function createMarker(sectionTop, sectionLeft, sectionColor, id, clsName,rowId) {
    var svgElem = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
    svgElem.css({'position': 'absolute', 'top': sectionTop + 'px', 'left': sectionLeft + 'px'})
    svgElem.attr('height', svgContainerSize + "px");
    svgElem.attr('width', svgContainerSize + "px");
    svgElem.attr('id',rowId);
    svgElem.attr('class', clsName);

    var marker = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
    marker.attr('cx', svgContainerSize / 2);
    marker.attr('cy', svgContainerSize / 2);

    if(clsName == "subSectionMarker"){
        marker.attr('r', smallMarkerRadius/2);
    } else{
        marker.attr('r', originalMarkerRadius);
    }

    marker.attr('stroke', "white");
    marker.attr('stroke-width', '1');
    marker.attr('fill', sectionColor);

    marker.appendTo(svgElem);

    if (clsName == "subSectionMarkerPort") {
        svgElem.appendTo($markersHolderPort);
    }
    else {
        svgElem.appendTo($markersHolderLand);
    }
}

function gotoPano(event){
    window.location = "vrview.html?section=1&row=1&seat=6";
}

function updateMarkersVisibility(panzoom){
    var orientation = getOrientation();
//    console.log("updateMarkersVisibility ", orientation, panzoom.getZoom())
    if(panzoom.getZoom() >= 1.5) {

        if(orientation == "Land"){
            if($(".subSectionMarkerLand").css('display') == 'none') {
                console.log("animating markers")
                setTimeout(function () {
                    $(".sectionMarkersLand").fadeOut();
                    $(".subSectionMarkerLand").fadeIn();
                }, 100);
                /*$(".sectionMarkersLand").fadeOut();
                $(".subSectionMarkerLand").fadeIn();*/
            }
        }
        else{
            if($(".subSectionMarkerPort").css('display') == 'none') {
                console.log("animating markers")
                setTimeout(function () {
                    $(".sectionMarkersPort").fadeOut();
                    $(".subSectionMarkerPort").fadeIn();
                }, 100);
                /*$(".sectionMarkersPort").fadeOut();
                $(".subSectionMarkerPort").fadeIn();*/
            }
        }

       /// $(".subSectionMarker circle").attr("r", originalMarkerRadius / panzoom.getZoom());
    }
    else {
        console.log("Deleting clickedmarker")
        clickedMarkerID = null;
        $("circle").attr("fill", "white");
        if(orientation == "Land"){
            if($(".subSectionMarkerLand").css('display') == 'block') {
                console.log("animating markers")
                setTimeout(function () {
                    $(".sectionMarkersLand").fadeIn();
                    $(".subSectionMarkerLand").fadeOut();
                }, 100);
                /*$(".sectionMarkersLand").fadeIn();
                $(".subSectionMarkerLand").fadeOut();*/
            }
        }
        else{
            if($(".subSectionMarkerPort").css('display') == 'block') {
                console.log("animating markers")
                setTimeout(function () {
                    $(".sectionMarkersPort").fadeIn();
                    $(".subSectionMarkerPort").fadeOut();
                }, 100);
                /*$(".sectionMarkersPort").fadeIn();
                $(".subSectionMarkerPort").fadeOut();*/
            }
        }
    }
//    console.log('zoom end ', panzoom.getZoom());
}
$(function(){
    $markersHolderLand = $("#inner > .landscapeMode");
    $markersHolderPort = $("#inner > .portraitMode");

    if(window.orientation == 90 || window.orientation == -90) {
        $("#mapimg").attr("src", mapLandscape);
        $('.landscapeMode').show();
        $('.portraitMode').hide();
    }
    else {
        $("#mapimg").attr("src", mapPortrait);
        $('.landscapeMode').hide();
        $('.portraitMode').show();
    }

    panzoomOptions = { minScale: 1, maxScale: 3, contain: 'invert'};

    var top,left,currentTop,currentLeft;

    //Create Main Markers
    for (var i = 0; i < sectionMarkersLand.length; i++) {
        var count = i + 1;
        var svgElem = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
        svgElem.css({'position': 'absolute', 'top': sectionMarkersLand[i].top + 'px', 'left': sectionMarkersLand[i].left + 'px'})
        svgElem.attr('height', 10);
        svgElem.attr('width', 10);
        svgElem.attr('id', "section_" + count);
        svgElem.attr('class', "sectionMarkersLand");

        var marker = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
        marker.attr('cx', 5);
        marker.attr('cy', 5);
        marker.attr('r', originalMarkerRadius);
        var color = "white";
        marker.attr('stroke', color);
        marker.attr('stroke-width', '1');
        marker.attr('fill', color);

        marker.appendTo(svgElem);

        svgElem.appendTo($markersHolderLand);
    }
    for (var i = 0; i < sectionMarkersPort.length; i++) {
        var count = i + 1;
        var svgElem = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
        svgElem.css({'position': 'absolute', 'top': sectionMarkersPort[i].top + 'px', 'left': sectionMarkersPort[i].left + 'px'})
        svgElem.attr('height', 10);
        svgElem.attr('width', 10);
        svgElem.attr('id', "section_" + count);
        svgElem.attr('class', "sectionMarkersPort");

        var marker = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
        marker.attr('cx', 5);
        marker.attr('cy', 5);
        marker.attr('r', originalMarkerRadius);
        var color = "white";
        marker.attr('stroke', color);
        marker.attr('stroke-width', '1');
        marker.attr('fill', color);

        marker.appendTo(svgElem);

        svgElem.appendTo($markersHolderPort);
    }

    //Create Sub Markers

    for (var i = 0; i < sectionMarkersPort.length; i++) {
        for (var k = 0; k < sectionMarkersPort[i].seats.length; k++) {
            var newRows = sectionMarkersPort[i].seats[k];
            var rowId = newRows.row_id;
            createMarker(newRows.top, newRows.left, "white", k, "subSectionMarkerPort",rowId);
        }
    }
    for (var i = 0; i < sectionMarkersLand.length; i++) {
        for (var k = 0; k < sectionMarkersLand[i].seats.length; k++) {
            var newRows = sectionMarkersLand[i].seats[k];
            var rowId = newRows.row_id;
            createMarker(newRows.top, newRows.left, "white", k, "subSectionMarkerLand",rowId);
        }
    }
    $("svg").attr("width", svgContainerSize  + "px");
    $("svg").attr("height", svgContainerSize + "px");
    $("circle").attr('cx', svgContainerSize / 2);
    $("circle").attr('cy', svgContainerSize / 2)
    $("circle").attr('r', originalMarkerRadius);

    $(".sectionMarkersPort,.sectionMarkersLand").on('touchstart', function(e){
        clickedMarkerID = e.currentTarget.id;

        console.log("section marker touched", clickedMarkerID)
        var clickedCircle = e.currentTarget.firstChild;
        console.log( clickedCircle );
        console.log(  $(clickedCircle).offset()) ;
        console.log($elem.width()/2);

        var matrix =$elem.panzoom('instance').getMatrix();
        console.log(matrix);
        var currentScale = Number(matrix[0]);
        var x = parseInt($(clickedCircle).parent().css('left'));
        var y = parseInt($(clickedCircle).parent().css('top'));
        var cx =  $elem.width()/2 ;
        var cy = $elem.height()/2 ;

        var scale = 2;

        var xAdjust = (cx - x- clickedCircle.attributes[2].value)*scale ;
        var yAdjust = (cy - y-clickedCircle.attributes[2].value)*scale ;

        if(Math.abs(xAdjust) > cx){
            if(xAdjust < 0){
                xAdjust = -cx;
            }else{
                xAdjust = cx;
            }
        }

        if(Math.abs(yAdjust) > cy){
            if(yAdjust < 0){
                yAdjust = -cy;
            }else{
                yAdjust = cy;
            }
        }

        matrix[0] = scale;
        matrix[3] = scale;
        matrix[4] = "" +xAdjust;
        matrix[5] = "" +yAdjust;

//        var transformMatrix = 'matrix('+matrix[0]+','+matrix[1]+','+matrix[2]+','+matrix[3]+','+matrix[4]+','+matrix[5]+')';
//        $elem.panzoom('instance').setTransform(transformMatrix);


        var gm = matrix;
        // pz.setMatrix(gm, {'animate':true});
        //pz.zoom(matrix[0]);
        setTimeout(function(){
            //  $elem.panzoom("zoom",scale,{'animate':true});
            pz.setMatrix(gm, {'animate':true})
            $elem.trigger('panzoomend',pz);
        },100)

    });

    $(".subSectionMarkerPort,.subSectionMarkerLand").hide();

    $(".subSectionMarkerPort ,.subSectionMarkerLand").on('touchstart', gotoPano);

    $elem = $("#outer");

    $elem.panzoom(panzoomOptions);

    pz = $elem.panzoom("instance");

    map = pz;
    map.setZoom = map.zoom;

    map.getZoom = function(){
        var matrix = pz.getMatrix();
        return matrix[0];
    }

    //Setup Event Handlers
    
    //Build header/footer
    orientationChangeHandler();

    $('circle').off();

    $elem.on('panzoomend', function (event, panzoom) {
        console.log("panzoomend", panzoom.getZoom());
        orientationChangeHandler();
        if (panzoom.getZoom() >= 1.5) {
            $(".subSectionMarkerPort circle").attr("r", smallMarkerRadius/panzoom.getZoom());
            $(".subSectionMarkerLand circle").attr("r", smallMarkerRadius/panzoom.getZoom());
            if (window.orientation == 90 || window.orientation == -90) {
                $(".sectionMarkersPort").hide();
                $(".subSectionMarkerPort").hide();
                $(".sectionMarkersLand").hide();
                $(".subSectionMarkerLand").show();
            }
            else {
                $(".sectionMarkersPort").hide();
                $(".subSectionMarkerPort").show();
                $(".sectionMarkersLand").hide();
                $(".subSectionMarkerLand").hide();
            }
//            if (typeof clickedMarkerID != "undefined") {
            if (clickedMarkerID) {
                console.log("make me green")
                changeMarkerColor();
            }
        }
        else {
            $("circle").attr("r", (originalMarkerRadius / panzoom.getZoom()));
            if (window.orientation == 90 || window.orientation == -90) {
                $(".sectionMarkersPort").hide();
                $(".subSectionMarkerPort").hide();
                $(".sectionMarkersLand").show();
                $(".subSectionMarkerLand").hide();
            }
            else {
                $(".sectionMarkersPort").show();
                $(".subSectionMarkerPort").hide();
                $(".sectionMarkersLand").hide();
                $(".subSectionMarkerLand").hide();
            }
        }
        console.log('zoom end ', panzoom.getZoom());
    });

    $elem.on('panzoomzoom', function(event, panzoom, scale, options){                
        $("#log").html(scale);
        updateMarkersVisibility(panzoom);
        if (panzoom.getZoom() >= 1.5) {
//            $(".subSectionMarker" + getOrientation() + " circle").attr("r", smallMarkerRadius/scale);
            $(".subSectionMarkerLand circle").attr("r", smallMarkerRadius/scale);
            $(".subSectionMarkerPort circle").attr("r", smallMarkerRadius/scale);
        } else {
            $("circle").attr("r", (originalMarkerRadius / scale));
        }

    });

    window.addEventListener("orientationchange", function() {

        var orientation = window.orientation;
        var img = document.getElementById('mapimg');
        img.style.display = 'none';

        if (pz.getZoom() >= 1.5) {
            if (window.orientation == 90 || window.orientation == -90) {
                $(".sectionMarkersPort").hide();
                $(".subSectionMarkerPort").hide();
                $(".sectionMarkersLand").hide();
                $(".subSectionMarkerLand").show();
            }
            else {
                $(".sectionMarkersPort").hide();
                $(".subSectionMarkerPort").show();
                $(".sectionMarkersLand").hide();
                $(".subSectionMarkerLand").hide();
            }
        }
        else {
            if (window.orientation == 90 || window.orientation == -90) {
                $(".sectionMarkersPort").hide();
                $(".subSectionMarkerPort").hide();
                $(".sectionMarkersLand").show();
                $(".subSectionMarkerLand").hide();
            }
            else {
                $(".sectionMarkersPort").show();
                $(".subSectionMarkerPort").hide();
                $(".sectionMarkersLand").hide();
                $(".subSectionMarkerLand").hide();
            }
        }

        if(orientation == 90 || orientation == -90){
            window.scrollTo(0, 0);
            img.src = mapLandscape;
            $elem.removeClass('portrait').addClass('landscape');
            $('.landscapeMode').show();
            $('.portraitMode').hide();

            //rotation panning adjustment
            var matrix =$elem.panzoom('instance').getMatrix();

            var yAdjust = -(Number(matrix[4]));
            var xAdjust = Number(matrix[5]);

            matrix[4] = "" +xAdjust;
            matrix[5] = "" +yAdjust;

            //  $('#map').panzoom('instance').setMatrix(matrix);
            var transformMatrix = 'matrix('+matrix[0]+','+matrix[1]+','+matrix[2]+','+matrix[3]+','+matrix[4]+','+matrix[5]+')';
            $elem.panzoom('instance').setTransform(transformMatrix);
        }
        else{
            img.src= mapPortrait;
            $elem.removeClass('landscape').addClass('portrait');
            $('.landscapeMode').hide();
            $('.portraitMode').show();

            //rotation panning adjustment
            var matrix = $elem.panzoom('instance').getMatrix();

            var yAdjust = Number(matrix[4]);
            var xAdjust = -(Number(matrix[5]));

            matrix[4] = "" +xAdjust;
            matrix[5] = "" +yAdjust;

            var transformMatrix = 'matrix('+matrix[0]+','+matrix[1]+','+matrix[2]+','+matrix[3]+','+matrix[4]+','+matrix[5]+')';
            $elem.panzoom('instance').setTransform(transformMatrix);
        }
        img.style.display = 'block'
        $elem.panzoom("resetDimensions");
        orientationChangeHandler();
    });
    
    // End Setup Event Handlers

    pz.zoom(1);
    $("#footerSlideContent").on('touchstart', gotoDefaultPano);

    $("#log").click(function(){
        pz.zoom(2);
    });

    setTimeout(function(){$elem.panzoom("resetDimensions");},200);
})
function gotoDefaultPano(event){
    window.location = "vrview.html?section=3&row=1&seat=1";
}

function getOrientation(){
    if(window.orientation == 90 || window.orientation == -90)
        return "Land";
    return "Port";
}
function changeMarkerColor() {
    for (var i = 0; i < sectionMarkersPort.length; i++) {
        var currentSection = sectionMarkersPort[i];
        if (clickedMarkerID == currentSection.section_id) {
            for (var j = 0; j < currentSection.seats.length; j++) {
              $('#' + currentSection.seats[j].row_id + ' circle').attr('fill', 'green');
            }
        }
        else {
            for (var j = 0; j < currentSection.seats.length; j++) {
                $('#' + currentSection.seats[j].row_id + ' circle').attr('fill', 'white');
            }
        }

    }
    for (var i = 0; i < sectionMarkersLand.length; i++) {
        var currentSection = sectionMarkersLand[i];
        if (clickedMarkerID == currentSection.section_id) {
            for (var j = 0; j < currentSection.seats.length; j++) {
                $('#' + currentSection.seats[j].row_id + ' circle').attr('fill', 'green');
            }
        }
        else {
            for (var j = 0; j < currentSection.seats.length; j++) {
                $('#' + currentSection.seats[j].row_id + ' circle').attr('fill', 'white');
            }
        }
    }
}