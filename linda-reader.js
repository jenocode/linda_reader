/** Javascript **/
$(function() {

    let janCode;

    // スキャンボタン操作
    $("#button-scanner").click(function(){
        if ($("#button-scanner").html() == "Scan") {
            $(this).html("Stop");
            startScanner();
        } else {
            $(this).html("Scan");
            Quagga.stop();
        };
    });

    // Copyボタン
    $("#button-copy").click(function(){
        getJanCode();
        navigator.clipboard.writeText(janCode);
    });

    // リンクボタン
    // ヤフトク価格推移
    $("#link-yahutoku").click(function(){
        getJanCode();
        window.open(
            "https://yahutoku.com/kakaku2?jan_code=" + janCode,
            "_blank",
        );
    });
    // 買取商店
    $("#link-shouten").click(function(){
        getJanCode();
        window.open(
            "https://www.kaitorishouten-co.jp/category/2/70?name=" + janCode,
            "_blank",
        );
    });
    // 森森商店
    $("#link-morimori").click(function(){
        getJanCode();
        window.open(
            "https://www.morimori-kaitori.jp/search/" + janCode,
            "_blank",
        );
    });
    // 買取wiki
    $("#link-wiki").click(function(){
        getJanCode();
        window.open(
            "https://kaitori.wiki/search?&keyword=" + janCode,
            "_blank",
        );
    });

    const getJanCode =() => {
        janCode = $("#input-jan").val();
    };

    const startScanner = () => {
        // Quagga
        Quagga.init({
            inputStream: {
                name : "Live",
                type : "LiveStream",
                target: document.getElementById("quagga"),
                constraints: {
                    width: 640,
                    height: 480,
                },
            },
            decoder: {
                readers: ["ean_reader"]
            }
        }, err=>{
            if(err){
                console.log(err);
                return;
            }
            console.log("Initialization finished!!");
            Quagga.start();
        });

        Quagga.onProcessed(result=>{
            if(result == null) return;
            if(typeof(result) != "object") return;
            if(result.boxes == undefined) return;
            const ctx = Quagga.canvas.ctx.overlay;
            const canvas = Quagga.canvas.dom.overlay;
            ctx.clearRect(0, 0, parseInt(canvas.width), parseInt(canvas.height));
            Quagga.ImageDebug.drawPath(result.box, 
                {x: 0, y: 1}, ctx, {color: "blue", lineWidth: 5});
        });

        Quagga.onDetected(result=>{
            console.log(result.codeResult.code);
            $("#input-jan").val(result.codeResult.code);
    //		$("#my_barcode div").barcode(result.codeResult.code, "ean13");
        });

    };

});