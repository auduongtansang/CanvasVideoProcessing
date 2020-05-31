window.onload = function () {
    var canvas1 = document.getElementById("myCanvas1");
    var context1 = canvas1.getContext("2d");

    var canvas2 = document.getElementById("myCanvas2");
    var context2 = canvas2.getContext("2d");

    var threshold = 250;
    var slider = document.getElementById("intensity");
    slider.oninput = function () {
        threshold = 500 - parseInt(slider.value);
    };

    var video = document.getElementById("myVideo");

    video.oncanplay = function () {
        var vid = this;

        canvas1.width = canvas2.width = vid.videoWidth;
        canvas1.height = canvas2.height = vid.videoHeight;
    };

    video.onplay = function () {
        var vid = this;

        (function loop() {
            if (!vid.paused && !vid.ended) {
                context1.drawImage(vid, 0, 0);

                var frameData = context1.getImageData(0, 0, vid.videoWidth, vid.videoHeight);
                var frameEdge = sobel(frameData, threshold);

                context2.putImageData(frameEdge, 0, 0);

                setTimeout(loop, 1000 / 30);
            }
        })();
    };
};

function sobel(imgData, th) {
    var row = imgData.height;
    var col = imgData.width;

    var rowStep = col * 4;
    var colStep = 4;

    var data = imgData.data;

    var newImgData = new ImageData(col, row);

    for (var i = 1; i < row - 1; i += 1)
        for (var j = 1; j < col - 1; j += 1) {

            var topLeft = data[(i - 1) * rowStep + (j - 1) * colStep + 1];
            var top = data[(i - 1) * rowStep + j * colStep + 1];
            var topRight = data[(i - 1) * rowStep + (j + 1) * colStep + 1];
            var right = data[i * rowStep + (j + 1) * colStep + 1];
            var bottomRight = data[(i + 1) * rowStep + (j + 1) * colStep + 1];
            var bottom = data[(i + 1) * rowStep + j * colStep + 1];
            var bottomLeft = data[(i + 1) * rowStep + (j - 1) * colStep + 1];
            var left = data[i * rowStep + (j - 1) * colStep + 1];

            var dx = (topRight - topLeft) + 2 * (right - left) + (bottomRight - bottomLeft);
            var dy = (bottomLeft - topLeft) + 2 * (bottom - top) + (bottomRight - topRight);
            var grad = Math.sqrt(dx * dx + dy * dy);

            if (grad >= th) {
                newImgData.data[i * rowStep + j * colStep] = 255;
                newImgData.data[i * rowStep + j * colStep + 1] = 255;
                newImgData.data[i * rowStep + j * colStep + 2] = 255;
                newImgData.data[i * rowStep + j * colStep + 3] = 255;
            }
            else {
                newImgData.data[i * rowStep + j * colStep] = 0;
                newImgData.data[i * rowStep + j * colStep + 1] = 0;
                newImgData.data[i * rowStep + j * colStep + 2] = 0;
                newImgData.data[i * rowStep + j * colStep + 3] = 255;
            }
        }

    return newImgData;
}