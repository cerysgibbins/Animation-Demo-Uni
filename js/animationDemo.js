function Car(imgSrc, x, y) {
    this.x = x;
    this.y = y;
    this.vX = 0; // how fast is an object moving aka velocity along the horizontal axis
    this.aX = 0.1; // how fast is the speed changing along the horizontal axis
    this.vY = 0; // 
    this.aY = 0;
    this.maxSpeed = 5;
    this.scale = 1;
    this.image = new Image();
    if (imgSrc != null) {
        this.image.src = imgSrc;
    } else {
        this.image.src = "images/car1.png";
    }

    this.draw = function (context) {
        if (context != null) {
            var car = this;

            if (car.image.width > 0) {
                context.drawImage(car.image, car.x, car.y);
            } else {
                this.image.onload = function () {
                    context.drawImage(car.image, car.x, car.y);
                };
            }
        }
    };
}


$(document).ready(function () {
    var canvas = $("#myCanvas"); //jQuery

    // Getting canvas dimensions
    var canvasWidth;
    var canvasHeight;

    // to store the centre coordinates of the canvas
    var canvasHalfWidth;
    var canvasHalfHeight;
    var cars = new Array();

    // Getting the 2d surface to draw on
    var context = canvas.get(0).getContext("2d");

    var paused = false;

    resizeCanvas();
    createCars();
    animate();

    function createCars() {
        for (var loopCounter = 1; loopCounter <= 3; loopCounter++) {
            var carImage = $("#car" + loopCounter + "Option").val();
            var carPosX = parseInt($("#car" + loopCounter + "PositionX").val(), 10);
            var carPosY = parseInt($("#car" + loopCounter + "PositionY").val(), 10);
            var carVelocity = parseFloat($("#car" + loopCounter + "Velocity").val());
            var carAcceleration = parseFloat($("#car" + loopCounter + "Acceleration").val());
            var carMaxSpeed = parseFloat($("#car" + loopCounter + "MaxSpeed").val());

            var car = new Car(carImage, carPosX, carPosY);
            car.vX = carVelocity;
            car.aX = carAcceleration;
            car.maxSpeed = carMaxSpeed;
            cars.push(car);
        }
    }


    function animate() {
        clearCanvas();
        var numberCars = cars.length;

        for (var loopCounter = 0; loopCounter < numberCars; loopCounter++) {
            var currentCar = cars[loopCounter];
            currentCar.draw(context);
            
            // accelerate or decelerate the car based on the defined acceleration
            if (currentCar.vX < currentCar.maxSpeed) {
                currentCar.vX += currentCar.aX;
            }
            // update the position of the car
            currentCar.x += currentCar.vX;

            // if car is out of view, make it display from the left edge again
            if (currentCar.x > canvasWidth) {
                currentCar.x = -currentCar.image.width;
            }

            if (currentCar.vY < currentCar.maxSpeed) {
                currentCar.vY += currentCar.aY;
            }
            currentCar.y += currentCar.vY;
        }
        
        if (!paused) {
            requestAnimationFrame(function () {
                animate();
            });
        }
    }

    function resizeCanvas() {
        // Making the canvas fill the browser window

        // Get the size of the window's viewport
        canvasWidth = $(window).get(0).innerWidth;
        canvasHeight = $(window).get(0).innerHeight;

        // Update the width and height attributes
        canvas.attr("width", canvasWidth);
        canvas.attr("height", canvasHeight);

        // Set the centre point coords
        canvasHalfWidth = canvasWidth / 2;
        canvasHalfHeight = canvasHeight / 2;
    }

    function clearCanvas() {
        // clear entire canvas
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    $(window).resize(function () {
        paused = true;
        clearCanvas();
        resizeCanvas();
        paused = false;
        animate();
    });

    $("#updateAnimation").click(function () {
        paused = true;
        cars = new Array();
        createCars();
        paused = false;
        animate();
    });

    $("#pauseAnimation").click(function () {
        if (paused) {
            paused = false;
            $(this).val("Pause");
            animate();
        } else {
            paused = true;
            $(this).val("Resume");
        }
    });
});